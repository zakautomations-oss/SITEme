import React from "react";
import { Link } from "react-router-dom";
import { Reveal, Words } from "../components/AnimatedText";

export default function NotFound() {
  return (
    <div data-testid="page-not-found" className="bg-ink min-h-screen">
      <section className="pt-32 md:pt-40 pb-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <p className="mono text-[10px] tracking-mono uppercase text-white/55">
            § 404 / Not found
          </p>
          <h1 className="mt-6 font-serif text-white text-[44px] md:text-[88px] leading-[0.95] tracking-tightest">
            <Words text="This page" immediate />{" "}
            <Words
              text="doesn't exist."
              className="serif-italic text-periwinkle"
              delay={0.15}
              immediate
            />
          </h1>
          <Reveal
            immediate
            delay={0.4}
            className="mt-8 max-w-xl text-white/70 text-[17px] leading-relaxed"
          >
            <p>
              The link may be old or mistyped. Head back home, or tell us what
              you were looking for and we will point you the right way.
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              to="/"
              data-testid="notfound-home"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black mono text-[11px] tracking-mono uppercase hover:bg-periwinkle hover:text-black transition-colors"
            >
              Back to home
            </Link>
            <Link
              to="/contact"
              data-testid="notfound-contact"
              className="mono text-[11px] tracking-mono uppercase text-periwinkle hover:text-white transition pb-1"
              style={{ borderBottom: "1px solid var(--rule-hard)" }}
            >
              Contact us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
