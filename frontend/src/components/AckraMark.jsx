import React, { useEffect, useId, useRef, useState } from "react";
import { projectAckra } from "./ackraGeometry";
import "./AckraMark.css";

const REST = { yaw: -0.32, pitch: 0.08 };
const VIEWS = [-0.32, 0, 0.32];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function AckraMark() {
  const id = useId();
  const [mode, setMode] = useState("solid");
  const [pose, setPose] = useState(REST);
  const [turn, setTurn] = useState(0);
  const current = useRef(REST);
  const target = useRef(REST);
  const frame = useRef(null);
  const reducedMotion = useRef(true);
  const pointer = useRef(null);
  const suppressClick = useRef(false);

  const stop = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotion.current = !media || media.matches;
      if (reducedMotion.current) {
        stop();
        current.current = REST;
        target.current = REST;
        setPose(REST);
        setTurn(0);
      }
    };
    update();
    media?.addEventListener("change", update);
    return () => {
      stop();
      media?.removeEventListener("change", update);
    };
  }, []);

  const aim = (next) => {
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
        yaw: previous.yaw + (destination.yaw - previous.yaw) * 0.18,
        pitch: previous.pitch + (destination.pitch - previous.pitch) * 0.18,
      };
      current.current = value;
      setPose(value);
      frame.current = settled ? null : requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  const rotate = (direction = 1) => {
    const next = (turn + direction + VIEWS.length) % VIEWS.length;
    setTurn(next);
    aim({ yaw: VIEWS[next], pitch: REST.pitch });
  };

  const move = (event) => {
    if (reducedMotion.current) return;
    const pressed = pointer.current;
    if (pressed) {
      const dx = event.clientX - pressed.x;
      const dy = event.clientY - pressed.y;
      if (!pressed.dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        pressed.dragging = true;
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }
      if (pressed.dragging) {
        suppressClick.current = true;
        aim({ yaw: clamp(pressed.yaw + dx * 0.007, -0.95, 0.95), pitch: clamp(pressed.pitch - dy * 0.002, -0.22, 0.28) });
      }
      return;
    }
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    aim({ yaw: VIEWS[turn] + x * 0.38, pitch: REST.pitch - y * 0.24 });
  };

  const finishPointer = (event) => {
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const faces = projectAckra(pose.yaw, pose.pitch);
  return (
    <figure className="ackra-mark" data-mode={mode} data-testid="hero-ackra-mark">
      <button
        type="button"
        className="ackra-mark-stage"
        aria-label="Rotate the Ackra mark"
        aria-describedby={`${id}-help`}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          suppressClick.current = false;
          pointer.current = { x: event.clientX, y: event.clientY, yaw: current.current.yaw, pitch: current.current.pitch, dragging: false };
        }}
        onPointerMove={move}
        onPointerUp={finishPointer}
        onPointerCancel={(event) => { finishPointer(event); suppressClick.current = false; }}
        onLostPointerCapture={() => { pointer.current = null; }}
        onPointerLeave={() => {
          if (pointer.current && !pointer.current.dragging) pointer.current = null;
          if (!pointer.current && !reducedMotion.current) aim({ yaw: VIEWS[turn], pitch: REST.pitch });
        }}
        onClick={(event) => {
          if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; }
          rotate();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            rotate(event.key === "ArrowLeft" ? -1 : 1);
          }
          if (event.key === "Escape") { setTurn(0); aim(REST); }
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
            {faces.filter(face => mode === "structure" || face.facing).map(face => <polygon
              key={face.id}
              points={face.polygon}
              className={`ackra-mark-face ackra-mark-face-${face.surface}`}
              fill={face.surface === "front" ? `url(#${id}-${face.leg === 0 ? "left" : "right"})` : undefined}
              style={{ "--face-light": face.illumination, "--edge-opacity": face.facing ? 0.85 : 0.24 }}
            />)}
          </g>
        </svg>
      </button>
      <figcaption className="ackra-mark-caption">
        <span id={`${id}-help`} className="ackra-mark-help"><span className="mark-pointer-hint">Drag to turn</span><span className="mark-touch-hint">Tap to turn</span><span className="sr-only">. Use Enter or the left and right arrow keys to change the view.</span></span>
        <div className="ackra-mark-modes" role="group" aria-label="Mark appearance">
          <button type="button" aria-pressed={mode === "solid"} onClick={() => setMode("solid")}>Solid</button>
          <button type="button" aria-pressed={mode === "structure"} onClick={() => setMode("structure")}>Structure</button>
        </div>
      </figcaption>
    </figure>
  );
}
