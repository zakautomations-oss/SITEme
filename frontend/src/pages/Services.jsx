import React from "react";
import { motion } from "framer-motion";
import { Reveal, Words } from "../components/AnimatedText";
import CalendlyInline from "../components/CalendlyInline";

const CALENDLY = "https://calendly.com/evoskin9/ak-automations-meeting-s";

/* Each step has a DIFFERENT layout. No 3-card grids. */

function StepShell({ n, title, kicker, children }) {
  return (
    <section
      data-testid={`process-step-${n}`}
      className="rule-top py-16 md:py-24"
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
        <div className="col-span-12 md:col-span-3">
          <p className="mono text-[10px] tracking-mono uppercase text-white/40">
            Step {n} / {kicker}
          </p>
          <p className="hidden md:block font-serif mt-10 text-[120px] leading-none tracking-tightest text-white/[0.06]">
            {n}
          </p>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="font-serif text-white text-[44px] md:text-[72px] leading-[0.98] tracking-tightest">
            {title}
          </h2>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}

/* STEP 01: prose + INLINE Calendly. No card grid. */
function Step01() {
  return (
    <StepShell
      n="01"
      kicker="Book"
      title={
        <>
          <Words text="Open the link." />{' '}
          <br />
          <Words text="Pick a time." className="serif-italic" delay={0.15} />
        </>
      }
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <Reveal as="div" className="col-span-12 md:col-span-5 text-white/75 text-[17px] leading-relaxed">
          <p>
            No forms. No qualifier survey. The calendar shows real, available
            slots in your timezone. Pick one. You will get a Google Meet link
            and a one-paragraph agenda an hour before.
          </p>
          <p className="mt-5 text-white/55 text-[14px]">
            What you can do before the call: write down three workflows that
            cost you the most time this month. We will use those as the
            scoping anchor.
          </p>
          <p className="mt-8 mono text-[10px] tracking-mono uppercase text-white/40">
            30 min · free · video meeting · details on confirmation
          </p>
        </Reveal>
        <Reveal as="div" delay={0.1} className="col-span-12 md:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="mono text-[10px] tracking-mono uppercase text-periwinkle">
              pick a slot below
            </p>
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="process-01-open-newtab"
              className="mono text-[10px] tracking-mono uppercase text-white/50 hover:text-white transition"
            >
              Open in new tab ↗
            </a>
          </div>
          <CalendlyInline url={CALENDLY} height={680} />
        </Reveal>
      </div>
    </StepShell>
  );
}

/* STEP 02: dense prose with INLINE numbered deliverables. No icons. No tiles. */
function Step02() {
  return (
    <StepShell
      n="02"
      kicker="Clarity session"
      title={
        <>
          <Words text="The Ackra" />{' '}
          <br />
          <Words text="Clarity System." className="serif-italic text-periwinkle" delay={0.15} />
        </>
      }
    >
      <div className="grid grid-cols-12 gap-x-6">
        <Reveal as="div" className="col-span-12 md:col-span-7 text-white/75 text-[17px] leading-[1.6]">
          <p>
            A complete onboarding and strategy session, tailored to your
            business. Not a generic template. Free. The session lands you
            three deliverables, sent the same day as a single PDF, built off
            the workflows you brought to the call.
          </p>
          <p className="mt-6">
            <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">
              i.
            </span>
            <span className="serif-italic text-white">Workflow Report.</span>{" "}
            We analyze your current processes and quantify where you are
            losing time and money. One page, every leak named in plain
            English with the dollar value attached.
          </p>
          <p className="mt-5">
            <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">
              ii.
            </span>
            <span className="serif-italic text-white">Custom Solutions.</span>{" "}
            We present AI agents built specifically for your situation. For
            each automation: the trigger, the prompt outline, the data
            sources, the failure mode, and where a human stays in the loop.
          </p>
          <p className="mt-5">
            <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">
              iii.
            </span>
            <span className="serif-italic text-white">Full Walkthrough.</span>{" "}
            We walk you through everything, step by step. No jargon, no
            tech overwhelm. By the end you can explain the plan to anyone on
            your team in five minutes.
          </p>
        </Reveal>

        <Reveal as="aside" delay={0.15} className="col-span-12 md:col-span-4 md:col-start-9 mt-10 md:mt-0">
          <div className="rule-y py-6">
            <p className="mono text-[10px] tracking-mono uppercase text-white/40">
              Your cost
            </p>
            <p className="font-serif text-[80px] md:text-[112px] leading-none tracking-tightest mt-2">
              Free<span className="text-periwinkle">.</span>
            </p>
            <p className="mt-3 mono text-[10px] tracking-mono uppercase text-periwinkle">
              no obligation / no upsell
            </p>
          </div>
          <p className="mt-6 text-white/55 text-[13px] leading-relaxed">
            We give the session away because the PDF is also the contract.
            If we are not the right fit, you still leave with a usable plan
            you can hand to anyone.
          </p>
        </Reveal>
      </div>
    </StepShell>
  );
}

/* STEP 03: editorial paragraph + A/B/C inline list + signature. No CTA tiles. */
function Step03() {
  return (
    <StepShell
      n="03"
      kicker="Decide"
      title={
        <>
          <Words text="Evaluate." />{' '}
          <Words text="Reflect." delay={0.1} />{' '}
          <Words text="Decide." className="serif-italic text-periwinkle" delay={0.2} />
        </>
      }
    >
      <div className="grid grid-cols-12 gap-x-6">
        <Reveal as="div" className="col-span-12 md:col-span-9 font-serif text-white text-[24px] md:text-[34px] leading-[1.3] tracking-[-0.015em] max-w-3xl">
          <p>
            After the meeting, you have everything you need. No pressure.
            No hard sell. This is your business.{" "}
            <span className="serif-italic text-periwinkle">
              You decide.
            </span>
          </p>
        </Reveal>
        <Reveal as="div" delay={0.2} className="col-span-12 md:col-span-3 mt-8 md:mt-2">
          <p className="mono text-[10px] tracking-mono uppercase text-white/40">
            Average reply window
          </p>
          <p className="font-serif text-[64px] md:text-[80px] leading-none tracking-tightest mt-2">
            6 <span className="text-white/40 text-[20px] mono normal-case">days</span>
          </p>
        </Reveal>

        <div className="col-span-12 mt-10 max-w-3xl">
          <Reveal as="div" className="rule-top py-5">
            <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">
              A.
            </span>
            <span className="serif-italic text-white text-[18px]">Evaluate the information given.</span>{" "}
            <span className="text-white/65 text-[17px]">
              We send the recording, the deck, and the agent spec within an
              hour of the call. Read on your own clock.
            </span>
          </Reveal>
          <Reveal as="div" delay={0.08} className="rule-top py-5">
            <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">
              B.
            </span>
            <span className="serif-italic text-white text-[18px]">Reflect on the meeting.</span>{" "}
            <span className="text-white/65 text-[17px]">
              Talk to whoever you need to talk to. Sit with the numbers. We
              are not going anywhere.
            </span>
          </Reveal>
          <Reveal as="div" delay={0.16} className="rule-y py-5">
            <span className="mono text-[11px] tracking-mono uppercase text-periwinkle mr-3">
              C.
            </span>
            <span className="serif-italic text-white text-[18px]">Decide your future.</span>{" "}
            <span className="text-white/65 text-[17px]">
              When you are ready, we are ready. You set the pace.
            </span>
          </Reveal>
        </div>
      </div>
    </StepShell>
  );
}

/* STEP 04: 3+ week deployment timeline + What Happens After Yes (Deploy / Growth / Enjoy). */
function Step04() {
  const T = [
    {
      d: "Week 1",
      t: "Kickoff and scoping",
      n: "We send a recorded walkthrough of the first agent's prompt, triggers, and integrations. You comment in line. We finalize the spec by end of week.",
    },
    {
      d: "Week 2",
      t: "Agent build",
      n: "We wire it up: prompts, integrations, escalation paths, fallback rules. Internal QA happens in this window before your data ever touches it.",
    },
    {
      d: "Week 3",
      t: "Dry-run on your data",
      n: "Sandbox copy of your CRM. Twenty to fifty test calls or messages. We share every transcript and tune the agent against real cases.",
    },
    {
      d: "Week 3-4",
      t: "Live with you on Slack",
      n: "Real traffic. Shared Slack channel. We watch the first hundred real interactions and patch in flight. This is when efficiency starts visibly climbing.",
    },
    {
      d: "Week 4+",
      t: "First readout and revisions",
      n: "Numbers: calls answered, replies sent, leads booked. Three concrete patches shipped next cycle. Second-agent scoping starts whenever you are ready.",
    },
  ];

  const AFTER_YES = [
    {
      label: "Deploy the Systems",
      desc: "Your AI agents go live over the course of three weeks. We build, deploy, and maintain everything.",
    },
    {
      label: "See the Growth",
      desc: "Efficiency climbs and conversion rates rise inside the first full week of live traffic.",
    },
    {
      label: "Enjoy.",
      desc: "Your AI works 24/7 so you focus on relationships, strategy, and growth.",
    },
  ];

  return (
    <StepShell
      n="04"
      kicker="Deploy"
      title={
        <>
          <Words text="First agent live in" />{" "}
          <Words text="3+ weeks." className="serif-italic text-periwinkle" delay={0.15} />
        </>
      }
    >
      <div className="max-w-3xl">
        {/* What Happens After Yes (Deploy / Growth / Enjoy) */}
        <Reveal as="div" className="rule-top pt-6 pb-2">
          <p className="mono text-[10px] tracking-mono uppercase text-white/40 mb-5">
            What happens after yes
          </p>
          {AFTER_YES.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="py-3 grid grid-cols-12 gap-x-4"
            >
              <p className="col-span-3 mono text-[11px] tracking-mono uppercase text-periwinkle pt-1">
                {String.fromCharCode(65 + i)}.
              </p>
              <div className="col-span-9">
                <p className="font-serif text-white text-[20px] md:text-[24px] leading-tight tracking-[-0.015em]">
                  {row.label}
                </p>
                <p className="mt-1 text-white/60 text-[15px] leading-relaxed">
                  {row.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </Reveal>

        {/* Week-by-week timeline */}
        <p className="mono text-[10px] tracking-mono uppercase text-white/40 mt-12 mb-2">
          The timeline / week by week
        </p>
        {T.map((row, i) => (
          <motion.div
            key={row.d}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="rule-top py-6 grid grid-cols-12 gap-x-4"
          >
            <p className="col-span-3 mono text-[11px] tracking-mono uppercase text-periwinkle pt-1">
              {row.d}
            </p>
            <div className="col-span-9">
              <p className="font-serif text-white text-[22px] md:text-[26px] leading-tight tracking-[-0.015em]">
                {row.t}
              </p>
              <p className="mt-2 text-white/60 text-[15px] leading-relaxed">
                {row.n}
              </p>
            </div>
          </motion.div>
        ))}

        <div className="rule-top mt-2 pt-8">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="process-01-cta"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black mono text-[11px] tracking-mono uppercase hover:bg-periwinkle hover:text-white transition-colors"
          >
            Start week one ↗
          </a>
        </div>
      </div>
    </StepShell>
  );
}

export default function Services() {
  return (
    <div data-testid="page-services" className="bg-ink">
      {/* HEADER */}
      <section className="pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3">
            <p className="mono text-[10px] tracking-mono uppercase text-white/40">
              §01 / The process
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-serif text-white text-[48px] md:text-[72px] lg:text-[88px] leading-[0.92] tracking-tightest">
              <Words text="Four steps." immediate />{" "}
              <Words
                text="One scoping call."
                className="serif-italic text-periwinkle"
                delay={0.2}
                immediate
              />
            </h1>
            <Reveal immediate delay={0.5} className="mt-8 max-w-2xl text-white/70 text-[17px] leading-relaxed">
              <p>
                Book a slot, walk away with a written plan, decide on your own
                clock, and have the first agent in production over three weeks.
                The whole arc, top to bottom, on this page.
              </p>
            </Reveal>
            <Reveal delay={0.7} className="mt-10 grid grid-cols-2 md:grid-cols-4">
              {[
                { n: "01", l: "Book" },
                { n: "02", l: "Clarity session" },
                { n: "03", l: "Decide" },
                { n: "04", l: "Deploy" },
              ].map((s, i) => (
                <a
                  key={s.n}
                  href={`#step-${s.n}`}
                  data-testid={`process-index-${s.n}`}
                  className="py-4 pr-6 group"
                  style={{ borderLeft: i === 0 ? "none" : "1px solid var(--rule)" }}
                >
                  <p className="mono text-[10px] tracking-mono uppercase text-white/40 pl-0 md:pl-4">
                    {s.n}
                  </p>
                  <p className="mt-1 text-white text-[15px] pl-0 md:pl-4 group-hover:text-periwinkle transition">
                    {s.l}
                  </p>
                </a>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <div id="step-01"><Step01 /></div>
      <div id="step-02"><Step02 /></div>
      <div id="step-03"><Step03 /></div>
      <div id="step-04"><Step04 /></div>

      {/* CLOSING */}
      <section className="rule-top py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <h2 className="font-serif text-white text-[44px] md:text-[80px] leading-[0.95] tracking-tightest max-w-4xl">
            <Words text="No forms." />{" "}
            <Words text="No qualifier survey." className="serif-italic" delay={0.2} />{' '}
            <br />
            <Words text="Just a calendar link." delay={0.4} />
          </h2>
          <Reveal delay={0.6} className="mt-10">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="services-bottom-cta"
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
