import React from "react";
import { Link } from "react-router-dom";
import { Reveal, Words, CountUp } from "../components/AnimatedText";

const CALENDLY = "https://calendly.com/evoskin9/ak-automations-meeting-s";

export default function SolutionReduceWorkload() {
  return (
    <div data-testid="page-solution-reduce" className="bg-ink">
      <section className="pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3">
            <Link
              to="/"
              data-testid="solution-back-link"
              className="mono text-[10px] tracking-mono uppercase text-white/40 hover:text-periwinkle transition"
            >
              ← Solutions / 01
            </Link>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-serif text-white text-[44px] md:text-[72px] lg:text-[88px] leading-[0.92] tracking-tightest">
              <Words text="Get your" immediate />{" "}
              <Words text="evenings back." className="serif-italic text-periwinkle" delay={0.2} immediate />
            </h1>
            <Reveal immediate delay={0.5} className="mt-8 max-w-2xl text-white/70 text-[17px] leading-relaxed">
              <p>
                For owners and operators who are still answering email at 11pm
                because nobody else will. We build the agents that pick up the
                slack so you can close the laptop.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE LEAK: dense prose block, not card tiles */}
      <section className="rule-top py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §02 / The leak
          </div>
          <div className="col-span-12 md:col-span-9 max-w-3xl">
            <Reveal as="p" className="font-serif text-white text-[28px] md:text-[40px] leading-[1.18] tracking-[-0.015em]">
              The same three things drain every team we audit. Inbox triage.
              Copy-paste between tools. Follow-ups that never happen.
            </Reveal>
            <Reveal as="p" delay={0.15} className="mt-8 text-white/70 text-[17px] leading-relaxed">
              An ops manager at one of our retail clients was spending fourteen
              hours a week pasting order confirmations from Shopify into
              QuickBooks, then sending each customer a hand-written shipping
              email. Fourteen hours. Every week. By a person we hired to
              actually manage the store.
            </Reveal>
            <Reveal as="p" delay={0.25} className="mt-6 text-white/70 text-[17px] leading-relaxed">
              Two agents, four days of build, and that number is now six
              minutes a week of human review. The fourteen hours go back into
              the storefront.
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHAT WE WIRE: inline numbered list, no card grid */}
      <section className="rule-top py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §03 / Inventory
          </div>
          <div className="col-span-12 md:col-span-9 max-w-3xl">
            <h2 className="font-serif text-white text-[40px] md:text-[64px] leading-[1.0] tracking-tightest">
              <Words text="Four agents we" />{" "}
              <Words text="actually" className="serif-italic" delay={0.15} />{" "}
              <Words text="ship." delay={0.3} />
            </h2>
            <ol className="mt-10 space-y-6 text-white/80 text-[18px] leading-[1.5]">
              <Reveal as="li" className="rule-top pt-5">
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">01.</span>
                <span className="serif-italic text-white">Inbox triage.</span>{" "}
                <span className="text-white/65">
                  Reads every incoming email, classifies by intent, drafts the
                  reply in your voice, pins anything that needs you. We have
                  shipped this for legal practices, agencies, and one
                  contractor with 300 emails a day.
                </span>
              </Reveal>
              <Reveal as="li" delay={0.08} className="rule-top pt-5">
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">02.</span>
                <span className="serif-italic text-white">Cross-tool sync.</span>{" "}
                <span className="text-white/65">
                  HubSpot to Stripe to Notion to Slack. The agent watches every
                  webhook and writes the consequences. No more "wait, did
                  anyone update the CRM."
                </span>
              </Reveal>
              <Reveal as="li" delay={0.16} className="rule-top pt-5">
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">03.</span>
                <span className="serif-italic text-white">Follow-up firer.</span>{" "}
                <span className="text-white/65">
                  Every quote, contract, and proposal you send gets a tracked
                  follow-up window. The agent nudges at the right time, in your
                  voice, until the prospect replies or opts out.
                </span>
              </Reveal>
              <Reveal as="li" delay={0.24} className="rule-y py-5">
                <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">04.</span>
                <span className="serif-italic text-white">Report ghostwriter.</span>{" "}
                <span className="text-white/65">
                  Weekly Loom-style written report on what your team got done,
                  pulled from Linear, Asana, GitHub, or Sheets. You read it
                  Sunday night in two minutes.
                </span>
              </Reveal>
            </ol>
          </div>
        </div>
      </section>

      {/* OUTCOMES: numeric, no card grid */}
      <section className="rule-top py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §04 / Outcomes
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-serif text-white text-[40px] md:text-[64px] leading-[1.0] tracking-tightest max-w-3xl">
              <Words text="What clients see by week four." />
            </h2>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4">
              {[
                { v: 30, suf: "%", l: "less manual work" },
                { v: 10, suf: "×", l: "faster reply time" },
                { v: 0, suf: "", l: "forgotten follow-ups" },
                { v: 3, suf: " wks", l: "to first agent live" },
              ].map((m, i) => (
                <div
                  key={m.l}
                  data-testid={`reduce-metric-${i}`}
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

      {/* CTA */}
      <section className="rule-top py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <h2 className="font-serif text-white text-[44px] md:text-[80px] leading-[0.95] tracking-tightest max-w-4xl">
            <Words text="Hand off the" />{" "}
            <Words text="busywork." className="serif-italic text-periwinkle" delay={0.15} />
          </h2>
          <Reveal delay={0.35} className="mt-10">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="solution-reduce-cta-top"
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
