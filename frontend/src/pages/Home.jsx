import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal, Words, CountUp } from "../components/AnimatedText";
import LogoA3D from "../components/LogoA3D";

const CALENDLY = "https://calendly.com/evoskin9/ak-automations-meeting-s";

const STATS = [
  { v: 30, suf: "%",   l: "avg cost reduction" },
  { v: 4,  suf: "s",   l: "median reply time" },
  { v: 24, suf: "/7",  l: "answering coverage" },
  { v: 3,  suf: " wks", l: "to first live agent" },
];

const TOOLS = [
  "HubSpot", "Slack", "Google", "Notion", "Stripe",
  "Calendly", "Sheets", "GoHighLevel", "Twilio", "Salesforce",
  "Zapier", "Make", "WhatsApp", "Gmail",
];

const AGENTS = [
  {
    n: "01",
    title: "Voice Agents",
    desc: "Pick up at 2 am, qualify with three questions, push the booking into your calendar before the caller hangs up.",
  },
  {
    n: "02",
    title: "Text Agents",
    desc: "SMS, web chat, and DMs answered inside seven seconds. Trained on your last six months of replies, handed to a human when intent gets serious.",
  },
  {
    n: "03",
    title: "Review Loops",
    desc: "Catch every satisfied customer at the right window, fire the Google ask, escalate the unhappy ones before they hit public.",
  },
  {
    n: "04",
    title: "Workflow Orchestration",
    desc: "HubSpot, GHL, Notion, Sheets, Slack, Stripe. We stop your stack from copy-pasting itself.",
  },
];

const EASE = [0.22, 1, 0.36, 1];

export default function Home() {
  return (
    <div data-testid="page-home" className="bg-ink">

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden text-center">

        {/* Atmospheric radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(123,127,232,0.10) 0%, rgba(123,127,232,0.03) 45%, transparent 70%)" }}
        />

        {/* Floating orbs */}
        <div className="absolute top-[12%] left-[8%] w-[380px] h-[380px] rounded-full bg-periwinkle/[0.05] blur-[130px] pointer-events-none animate-drift-1" />
        <div className="absolute bottom-[18%] right-[6%] w-[300px] h-[300px] rounded-full bg-purple-500/[0.04] blur-[110px] pointer-events-none animate-drift-2" />
        <div className="absolute top-[60%] left-[55%] w-[200px] h-[200px] rounded-full bg-blue-500/[0.03] blur-[90px] pointer-events-none animate-drift-3" />

        {/* 3D mark — atmospheric background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[80vw] max-w-[780px] aspect-square opacity-[0.07]">
            <LogoA3D className="w-full h-full" height="100%" />
          </div>
        </div>

        {/* Main headline */}
        <div className="relative w-full max-w-[1100px] mx-auto px-6 md:px-10">
          <h1 className="font-serif text-white leading-[0.93] tracking-tightest text-[54px] sm:text-[78px] md:text-[106px] lg:text-[138px]">
            <Words text="AI Agents" immediate />
            <br />
            <Words
              text="Built For You."
              className="serif-italic text-periwinkle"
              delay={0.2}
              immediate
            />
          </h1>

          {/* Sub-headline */}
          <Reveal immediate delay={0.6} className="mt-8 max-w-2xl mx-auto text-white/55 text-[17px] leading-relaxed">
            <p>
              Ackra builds the AI agents that answer your leads, reply to texts
              in seconds, automate your workflows, and grow your reviews,
              fully managed, live in 3&nbsp;weeks.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal immediate delay={0.8} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-cta-book"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-periwinkle text-white mono text-[11px] tracking-mono uppercase rounded-sm transition-all hover:shadow-[0_0_30px_rgba(123,127,232,0.45)]"
            >
              Book a 30-min scoping call ↗
            </a>
            <Link
              to="/services"
              data-testid="hero-cta-services"
              className="inline-flex items-center gap-2 px-6 py-3.5 mono text-[11px] tracking-mono uppercase text-white/55 hover:text-white hover:border-white/25 transition-all rounded-sm border border-white/[0.1]"
            >
              See how it works →
            </Link>
          </Reveal>
        </div>

        {/* Stats row */}
        <Reveal immediate delay={1.1} className="mt-20 w-full max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 rule-top">
            {STATS.map((s, i) => (
              <div
                key={s.l}
                data-testid={`stat-${i}`}
                className="py-6 px-4 md:px-6"
                style={{ borderLeft: i === 0 ? "none" : "1px solid var(--rule)" }}
              >
                <p className="font-serif text-white text-[40px] md:text-[52px] leading-none tracking-tightest">
                  <CountUp to={s.v} suffix={s.suf} />
                </p>
                <p className="mt-2 mono text-[10px] tracking-mono uppercase text-white/40">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───────────────── INTEGRATIONS MARQUEE ───────────────── */}
      <section className="rule-y py-5 overflow-hidden marquee-fade">
        <div className="flex items-center gap-10 animate-marquee whitespace-nowrap">
          {[...TOOLS, ...TOOLS].map((t, i) => (
            <span
              key={i}
              className="mono text-[11px] tracking-[0.2em] uppercase text-white/20 flex-shrink-0 flex items-center gap-3"
            >
              <span className="inline-block w-1 h-1 rounded-full bg-white/20" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ───────────────── THESIS ───────────────── */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-20 md:py-28 grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
            §02 / The thesis
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-serif text-white text-[32px] md:text-[48px] leading-[1.08] tracking-tightest max-w-3xl">
              <Words text="Most businesses don't have a traffic problem." />{" "}
              <Words
                text="They have a response problem."
                className="serif-italic text-white/50"
                delay={0.3}
              />
            </h2>
            <Reveal delay={0.5} className="mt-7 max-w-2xl text-white/50 text-[16px] leading-relaxed">
              <p>
                A lead calls at 7:42 pm and gets voicemail. A prospect texts on
                Sunday and waits till Tuesday. A happy customer never gets
                asked for a review. The math compounds. We close every gap
                with one agent at a time, named, scoped, and shipped.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────── INVENTORY — glass cards ───────────────── */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-periwinkle/[0.03] blur-[140px] pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-6 md:px-10 relative">
          <div className="grid grid-cols-12 gap-x-6 mb-10">
            <div className="col-span-12 md:col-span-3 mono text-[10px] tracking-mono uppercase text-white/40">
              §03 / Inventory
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="font-serif text-white text-[36px] md:text-[56px] leading-[1.05] tracking-tightest">
                <Words text="What we" />{" "}
                <Words text="actually" className="serif-italic" delay={0.15} />{" "}
                <Words text="build." delay={0.3} />
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 md:col-start-4 md:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AGENTS.map((a, i) => (
                  <motion.div
                    key={a.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                    className="glass group rounded-lg p-7 md:p-8 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="mono text-[11px] tracking-mono text-periwinkle uppercase">
                        {a.n}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-periwinkle/30 group-hover:bg-periwinkle group-hover:shadow-[0_0_8px_rgba(123,127,232,0.6)] transition-all duration-300" />
                    </div>
                    <h3 className="font-serif text-white text-[22px] md:text-[26px] tracking-tight leading-tight">
                      {a.title}
                      <span className="text-periwinkle">.</span>
                    </h3>
                    <p className="mt-3 text-white/45 text-[15px] leading-relaxed">
                      {a.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Reveal delay={0.4} className="mt-8">
                <Link
                  to="/services"
                  data-testid="home-services-link"
                  className="mono text-[11px] tracking-mono uppercase text-white/55 hover:text-periwinkle transition pb-1"
                  style={{ borderBottom: "1px solid var(--rule-hard)" }}
                >
                  Read the four-step process →
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── CLOSING CTA ───────────────── */}
      <section className="rule-top py-20 md:py-28 relative overflow-hidden">
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-periwinkle/[0.06] blur-[120px] pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-6 md:px-10 relative grid grid-cols-12 gap-x-6 items-center">
          <div className="col-span-12 md:col-span-7">
            <p className="mono text-[10px] tracking-mono uppercase text-white/40">
              §04 / Next move
            </p>
            <h2 className="font-serif text-white text-[40px] md:text-[72px] leading-[0.98] tracking-tightest mt-6">
              <Words text="The first " />
              <Words text="agent" className="serif-italic text-periwinkle" delay={0.15} />{" "}
              <Words text="ships in 3+ weeks." delay={0.3} />
            </h2>
            <Reveal delay={0.55} className="mt-8 max-w-xl text-white/50 text-[16px] leading-relaxed">
              <p>
                Bring a workflow that bleeds time. We name the agent, write the
                prompts, wire the integrations, and run it on your data over the
                course of three weeks. Live with you on Slack the whole way.
              </p>
            </Reveal>
            <Reveal delay={0.7} className="mt-10">
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="home-bottom-cta"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-periwinkle text-white mono text-[11px] tracking-mono uppercase rounded-sm hover:shadow-[0_0_30px_rgba(123,127,232,0.45)] transition-all"
              >
                Book a 30-min scoping call ↗
              </a>
            </Reveal>
          </div>

          {/* Right side — animated timeline visual */}
          <div className="hidden md:block col-span-5 relative">
            <div className="relative pl-8">
              {/* Vertical glowing line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-periwinkle/40 to-transparent" />

              {[
                { wk: "Week 1", label: "Scope & spec" },
                { wk: "Week 2", label: "Build & wire" },
                { wk: "Week 3", label: "Dry-run on your data" },
                { wk: "Week 4", label: "Live traffic" },
              ].map((step, i) => (
                <motion.div
                  key={step.wk}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.12, ease: EASE }}
                  className="relative py-5 group"
                >
                  {/* Node dot on the line */}
                  <span className="absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-periwinkle/50 bg-ink group-hover:bg-periwinkle group-hover:shadow-[0_0_10px_rgba(123,127,232,0.5)] transition-all duration-300" />
                  <p className="mono text-[10px] tracking-mono uppercase text-periwinkle/70">{step.wk}</p>
                  <p className="mt-1 text-white/60 text-[15px] group-hover:text-white/90 transition-colors">{step.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
