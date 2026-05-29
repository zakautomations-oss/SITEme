import React from "react";
import { Link } from "react-router-dom";
import { Reveal, Words, CountUp } from "../components/AnimatedText";

const CALENDLY = "https://calendly.com/evoskin9/ak-automations-meeting-s";

export default function About() {
  return (
    <div data-testid="page-about" className="bg-ink">
      <section className="pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3">
            <p className="mono text-[10px] tracking-mono uppercase text-white/40">
              §01 / About Ackra
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-serif text-white text-[44px] md:text-[72px] lg:text-[88px] leading-[0.92] tracking-tightest">
              <Words text="A workshop," immediate />{" "}
              <Words text="not a platform." className="serif-italic text-periwinkle" delay={0.2} immediate />
            </h1>
          </div>
        </div>
      </section>

      {/* STORY: editorial long-form, not card grid */}
      <section className="rule-top py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §02 / Origin
          </div>
          <div className="col-span-12 md:col-span-9 max-w-3xl">
            <Reveal as="p" className="font-serif text-white text-[28px] md:text-[40px] leading-[1.18] tracking-[-0.015em]">
              Ackra was started in New York in 2024 after watching one too many
              small business owners answer their own phones at 9pm. We are not
              an app you log into. We are people who build, ship, and operate
              the agents on your behalf.
            </Reveal>
            <Reveal as="p" delay={0.15} className="mt-8 text-white/70 text-[17px] leading-relaxed">
              Most automation companies sell you software and disappear. We
              sell you outcomes. Every Ackra build is owned by a named human
              who stays in the Slack channel for the life of the agent. If a
              prompt drifts, a tool breaks, or a customer complains, that human
              is the first to know.
            </Reveal>
            <Reveal as="p" delay={0.3} className="mt-6 text-white/70 text-[17px] leading-relaxed">
              We work in 90-day cycles. We name agents (yes, literally). We
              write the prompts in plain English so you can read them. We
              publish the failure modes.
            </Reveal>
          </div>
        </div>
      </section>

      {/* RECEIPTS: inline numerical block, no card tiles */}
      <section className="rule-top py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §03 / Receipts
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-serif text-white text-[36px] md:text-[56px] leading-[1.0] tracking-tightest">
              <Words text="What the work looks like, in numbers." />
            </h2>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4">
              {[
                { v: 30, suf: "%", l: "average cost reduction" },
                { v: 4, suf: "s", l: "median reply time" },
                { v: 50, suf: "+", l: "live agents shipped" },
                { v: 3, suf: " wks", l: "to first agent in production" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  data-testid={`about-stat-${i}`}
                  className="py-6 pr-6"
                  style={{ borderLeft: i === 0 ? "none" : "1px solid var(--rule)" }}
                >
                  <p className="font-serif text-white text-[52px] md:text-[80px] leading-none tracking-tightest pl-0 md:pl-6">
                    <CountUp to={s.v} suffix={s.suf} />
                  </p>
                  <p className="mt-3 mono text-[10px] tracking-mono uppercase text-white/45 pl-0 md:pl-6">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES: single dense prose block with inline numbered principles. No icons in squares. */}
      <section className="rule-top py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §04 / Principles
          </div>
          <div className="col-span-12 md:col-span-9 max-w-3xl">
            <h2 className="font-serif text-white text-[40px] md:text-[64px] leading-[1.0] tracking-tightest">
              <Words text="Three things we will not do." />
            </h2>
            <ol className="mt-10 space-y-7 text-white/80 text-[18px] md:text-[20px] leading-[1.5]">
              <Reveal as="li">
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">
                  i.
                </span>
                <span className="serif-italic text-white">
                  We will not sell you a tool we have never run ourselves.
                </span>{" "}
                <span className="text-white/65">
                  Every agent we ship has handled real, paying traffic for
                  another client first. No betas dressed up as launches.
                </span>
              </Reveal>
              <Reveal as="li" delay={0.1}>
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">
                  ii.
                </span>
                <span className="serif-italic text-white">
                  We will not hide the prompt.
                </span>{" "}
                <span className="text-white/65">
                  You own the system prompts. They live in a Notion doc you can
                  read. If you want to take them with you, take them.
                </span>
              </Reveal>
              <Reveal as="li" delay={0.2}>
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">
                  iii.
                </span>
                <span className="serif-italic text-white">
                  We will not pretend the AI is perfect.
                </span>{" "}
                <span className="text-white/65">
                  Every agent has a hand-off. Every weekly readout has a
                  failure log. The point is more done, not theatre.
                </span>
              </Reveal>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rule-top py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <h2 className="font-serif text-white text-[44px] md:text-[80px] leading-[0.95] tracking-tightest max-w-4xl">
            <Words text="Bring one workflow." />{' '}
            <br />
            <Words text="We will ship the agent." className="serif-italic text-periwinkle" delay={0.2} />
          </h2>
          <Reveal delay={0.4} className="mt-10 flex flex-wrap gap-4">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="about-cta"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black mono text-[11px] tracking-mono uppercase hover:bg-periwinkle hover:text-white transition-colors"
            >
              Book a 30-min scoping call ↗
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mono text-[11px] tracking-mono uppercase text-white/70 hover:text-white transition py-3"
              style={{ borderBottom: "1px solid var(--rule-hard)" }}
            >
              Write us a note →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
