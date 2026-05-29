import React from "react";
import { Link } from "react-router-dom";
import { Reveal, Words, CountUp } from "../components/AnimatedText";

const CALENDLY = "https://calendly.com/evoskin9/ak-automations-meeting-s";

export default function SolutionIncreaseConversion() {
  return (
    <div data-testid="page-solution-conversion" className="bg-ink">
      <section className="pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3">
            <Link
              to="/"
              data-testid="solution-back-link"
              className="mono text-[10px] tracking-mono uppercase text-white/40 hover:text-periwinkle transition"
            >
              ← Solutions / 02
            </Link>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-serif text-white text-[44px] md:text-[72px] lg:text-[88px] leading-[0.92] tracking-tightest">
              <Words text="The lead" immediate />{" "}
              <Words text="never waits." className="serif-italic text-periwinkle" delay={0.2} immediate />
            </h1>
            <Reveal immediate delay={0.5} className="mt-8 max-w-2xl text-white/70 text-[17px] leading-relaxed">
              <p>
                A prospect calling at 7:42pm is a paying customer somewhere by
                7:48pm. The only question is whether they buy from you or the
                next listing on Google. We close that window.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE MATH: editorial paragraph + pull-out stat */}
      <section className="rule-top py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §02 / The math
          </div>
          <div className="col-span-12 md:col-span-6 max-w-2xl">
            <Reveal as="p" className="font-serif text-white text-[28px] md:text-[40px] leading-[1.18] tracking-[-0.015em]">
              Respond in under five minutes and conversion goes up nine times.
              Most businesses take four hours.
            </Reveal>
            <Reveal as="p" delay={0.2} className="mt-6 text-white/65 text-[15px]">
              Source: Inside Sales Lead Response Management Study, 2024 update.
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-3">
            <p className="mono text-[10px] tracking-mono uppercase text-white/40">
              Median Ackra reply
            </p>
            <p className="font-serif text-white text-[80px] md:text-[112px] leading-none tracking-tightest mt-2">
              <CountUp to={4} suffix="s" />
            </p>
            <p className="mt-3 mono text-[10px] tracking-mono uppercase text-periwinkle">
              voice · sms · web chat
            </p>
          </div>
        </div>
      </section>

      {/* THE PLAYS: inline numbered list */}
      <section className="rule-top py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §03 / Plays
          </div>
          <div className="col-span-12 md:col-span-9 max-w-3xl">
            <h2 className="font-serif text-white text-[40px] md:text-[64px] leading-[1.0] tracking-tightest">
              <Words text="Four agents," />{" "}
              <Words text="one funnel." className="serif-italic" delay={0.15} />
            </h2>
            <ol className="mt-10 space-y-0 text-white/80 text-[18px] leading-[1.5]">
              <Reveal as="li" className="rule-top py-5">
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">01.</span>
                <span className="serif-italic text-white">Voice pickup.</span>{" "}
                <span className="text-white/65">
                  Inbound call answered on the second ring. Three qualifying
                  questions. Booking handed straight to your calendar. Recording
                  and transcript in your inbox.
                </span>
              </Reveal>
              <Reveal as="li" delay={0.08} className="rule-top py-5">
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">02.</span>
                <span className="serif-italic text-white">Text-first reply.</span>{" "}
                <span className="text-white/65">
                  SMS, web chat, Instagram DM. The agent replies in seven
                  seconds in your voice, books a slot or asks the next
                  question, hands to you when intent crosses the threshold.
                </span>
              </Reveal>
              <Reveal as="li" delay={0.16} className="rule-top py-5">
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">03.</span>
                <span className="serif-italic text-white">Review engine.</span>{" "}
                <span className="text-white/65">
                  Catches every five-star customer at the right window. Fires
                  the Google ask, watches for unhappy ones, escalates before
                  they hit public.
                </span>
              </Reveal>
              <Reveal as="li" delay={0.24} className="rule-y py-5">
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">04.</span>
                <span className="serif-italic text-white">Re-engagement loop.</span>{" "}
                <span className="text-white/65">
                  Old leads, lapsed customers, half-booked appointments. The
                  agent revives them with personalized SMS or email pulled from
                  the original conversation.
                </span>
              </Reveal>
            </ol>
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="rule-top py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §04 / Outcomes
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-serif text-white text-[40px] md:text-[64px] leading-[1.0] tracking-tightest max-w-3xl">
              <Words text="What moves in the first month." />
            </h2>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4">
              {[
                { v: 9, suf: "×", l: "conversion at sub-5-min reply" },
                { v: 24, suf: "/7", l: "lead capture coverage" },
                { v: 0.7, suf: "★", l: "avg google rating lift" },
                { v: 30, suf: "%", l: "more booked appointments" },
              ].map((m, i) => (
                <div
                  key={m.l}
                  data-testid={`conv-metric-${i}`}
                  className="py-6 pr-6"
                  style={{ borderLeft: i === 0 ? "none" : "1px solid var(--rule)" }}
                >
                  <p className="font-serif text-white text-[52px] md:text-[80px] leading-none tracking-tightest pl-0 md:pl-6">
                    <CountUp to={m.v} suffix={m.suf} />
                  </p>
                  <p className="mt-3 mono text-[10px] tracking-mono uppercase text-white/45 pl-0 md:pl-6">
                    {m.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rule-top py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <h2 className="font-serif text-white text-[44px] md:text-[80px] leading-[0.95] tracking-tightest max-w-4xl">
            <Words text="Pick up every" />{" "}
            <Words text="lead." className="serif-italic text-periwinkle" delay={0.15} />
          </h2>
          <Reveal delay={0.35} className="mt-10">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="solution-conversion-cta-top"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black mono text-[11px] tracking-mono uppercase hover:bg-periwinkle hover:text-white transition-colors"
            >
              Book a 30-min scoping call ↗
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
