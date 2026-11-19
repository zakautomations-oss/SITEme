import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Rotate3d } from "lucide-react";
import { projectAckra } from "./ackraGeometry";
import "./AckraMark.css";

const REST = { yaw: -0.32, pitch: 0.08 };
const VIEWS = [-0.32, 0, 0.32];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function AckraMark({ motionAreaRef }) {
  const id = useId();
  const [pose, setPose] = useState(REST);
  const view = useRef(0);
  const stageRef = useRef(null);
  const current = useRef(REST);
  const target = useRef(REST);
  const restingPose = useRef(REST);
  const frame = useRef(null);
  const reducedMotion = useRef(true);
  const pointer = useRef(null);
  const clickPointer = useRef(null);
  const suppressClick = useRef(false);

  const stop = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotion.current = !media || media.matches;
      if (reducedMotion.current) {
        stop();
        current.current = REST;
        target.current = REST;
        restingPose.current = REST;
        pointer.current = null;
        clickPointer.current = null;
        suppressClick.current = false;
        setPose(REST);
        view.current = 0;
      }
    };
    update();
    media?.addEventListener("change", update);
    return () => {
      stop();
      media?.removeEventListener("change", update);
    };
  }, [stop]);

  const aim = useCallback((next) => {
    target.current = next;
    if (reducedMotion.current) {
      stop();
      current.current = next;
      setPose(next);
      return;
    }
    if (frame.current !== null) return;
    const tick = () => {
      const previous = current.current;
      const destination = target.current;
      const settled = Math.abs(destination.yaw - previous.yaw) + Math.abs(destination.pitch - previous.pitch) < 0.001;
      const value = settled ? destination : {
        yaw: previous.yaw + (destination.yaw - previous.yaw) * 0.24,
        pitch: previous.pitch + (destination.pitch - previous.pitch) * 0.24,
      };
      current.current = value;
      setPose(value);
      frame.current = settled ? null : requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [stop]);

  useEffect(() => {
    const area = motionAreaRef?.current ?? stageRef.current;
    if (!area) return;
    const followPointer = (event) => {
      if (reducedMotion.current || pointer.current || event.pointerType === "touch") return;
      const bounds = area.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = clamp((event.clientX - bounds.left) / bounds.width - 0.5, -0.5, 0.5);
      const y = clamp((event.clientY - bounds.top) / bounds.height - 0.5, -0.5, 0.5);
      aim({ yaw: clamp(restingPose.current.yaw + x * 1.1, -1.25, 1.25), pitch: clamp(restingPose.current.pitch - y * 0.48, -0.5, 0.5) });
    };
    const rest = () => {
      if (!pointer.current && !reducedMotion.current) aim(restingPose.current);
    };
    area.addEventListener("pointermove", followPointer, { passive: true });
    area.addEventListener("pointerleave", rest);
    return () => {
      area.removeEventListener("pointermove", followPointer);
      area.removeEventListener("pointerleave", rest);
    };
  }, [aim, motionAreaRef]);

  const rotate = (direction = 1) => {
    const next = (view.current + direction + VIEWS.length) % VIEWS.length;
    view.current = next;
    restingPose.current = { yaw: VIEWS[next], pitch: REST.pitch };
    aim(restingPose.current);
  };

  const move = (event) => {
    if (reducedMotion.current) return;
    const pressed = pointer.current;
    if (pressed) {
      if (pressed.id !== event.pointerId) return;
      const dx = event.clientX - pressed.x;
      const dy = event.clientY - pressed.y;
      const intendsDrag = event.pointerType === "touch"
        ? Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)
        : Math.hypot(dx, dy) > 6;
      if (!pressed.dragging && intendsDrag) {
        pressed.dragging = true;
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }
      if (pressed.dragging) {
        suppressClick.current = true;
        aim({ yaw: clamp(pressed.yaw + dx * 0.009, -1.25, 1.25), pitch: clamp(pressed.pitch - dy * 0.004, -0.5, 0.5) });
      }
      return;
    }
  };

  const finishPointer = (event) => {
    if (pointer.current?.id !== event.pointerId) return;
    if (pointer.current.dragging) restingPose.current = target.current;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const faces = projectAckra(pose.yaw, pose.pitch);
  return (
    <figure className="ackra-mark" data-testid="hero-ackra-mark">
      <button
        ref={stageRef}
        type="button"
        className="ackra-mark-stage"
        aria-label="Rotate the Ackra mark"
        aria-describedby={`${id}-help`}
        onPointerDown={(event) => {
          if (event.button !== 0 || event.isPrimary === false || pointer.current) return;
          clickPointer.current = event.pointerId;
          suppressClick.current = false;
          if (reducedMotion.current) return;
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: current.current.yaw, pitch: current.current.pitch, dragging: false };
        }}
        onPointerMove={move}
        onPointerUp={finishPointer}
        onPointerCancel={(event) => {
          if (pointer.current?.id !== event.pointerId) return;
          finishPointer(event);
          clickPointer.current = null;
          suppressClick.current = false;
        }}
        onLostPointerCapture={finishPointer}
        onPointerLeave={(event) => {
          if (pointer.current?.id === event.pointerId && !pointer.current.dragging) pointer.current = null;
        }}
        onClick={(event) => {
          if (event.detail !== 0) {
            const { pointerId: clickId, pointerType: clickType } = event.nativeEvent;
            // Legacy mouse clicks may have no pointer metadata.
            if (pointer.current || (clickType && clickId != null && clickId !== clickPointer.current)) return;
            if (suppressClick.current) { suppressClick.current = false; return; }
          }
          rotate();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            rotate(event.key === "ArrowLeft" ? -1 : 1);
          }
          if (event.key === "Escape") { view.current = 0; restingPose.current = REST; aim(REST); }
        }}
      >
        <svg className="ackra-mark-art" viewBox="0 0 600 560" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={`${id}-left`} x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0" className="mark-metal-bright" />
              <stop offset="0.4" className="mark-metal-mid" />
              <stop offset="0.47" className="mark-metal-bright" />
              <stop offset="1" className="mark-metal-low" />
            </linearGradient>
            <linearGradient id={`${id}-right`} x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0" className="mark-metal-bright" />
              <stop offset="0.55" className="mark-metal-mid" />
              <stop offset="0.76" className="mark-metal-bright" />
              <stop offset="1" stopColor="#7b7fe8" />
            </linearGradient>
            <radialGradient id={`${id}-shadow`}>
              <stop offset="0" stopColor="#000" stopOpacity=".3" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse className="ackra-mark-shadow" cx="300" cy="493" rx="166" ry="25" fill={`url(#${id}-shadow)`} />
          <g className="ackra-mark-object">
            {faces.filter(face => face.facing).map(face => <polygon
              key={face.id}
              points={face.polygon}
              className={`ackra-mark-face ackra-mark-face-${face.surface}`}
              fill={face.surface === "front" ? `url(#${id}-${face.leg === 0 ? "left" : "right"})` : undefined}
              style={{ "--face-light": face.illumination }}
            />)}
          </g>
        </svg>
        <Rotate3d className="ackra-mark-hint" size={18} strokeWidth={1.25} aria-hidden="true" />
      </button>
      <figcaption id={`${id}-help`} className="sr-only">Move your pointer or drag to rotate. Use Enter or the left and right arrow keys to change the view. Escape resets the view.</figcaption>
    </figure>
  );
}
