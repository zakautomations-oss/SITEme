import React, { useState } from "react";
import axios from "axios";
import { Reveal, Words } from "../components/AnimatedText";

const API = "/api";
const CALENDLY = "https://calendly.com/evoskin9/ak-automations-meeting-s";

const initial = { name: "", email: "", phone: "", company: "", message: "", website: "" };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Name, email, and message are required.");
      return;
    }
    setStatus("loading");
    try {
      await axios.post(`${API}/contact`, {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        company: form.company || null,
        message: form.message,
        website: form.website || "",
      });
      setStatus("success");
      setForm(initial);
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please check your details and try again.");
    }
  };

  return (
    <div data-testid="page-contact" className="bg-ink">
      <section className="pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3">
            <p className="mono text-[10px] tracking-mono uppercase text-white/40">
              §01 / Contact
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="font-serif text-white text-[44px] md:text-[72px] lg:text-[88px] leading-[0.92] tracking-tightest">
              <Words text="Write us" immediate />{" "}
              <Words text="a note." className="serif-italic text-periwinkle" delay={0.2} immediate />
            </h1>
            <Reveal immediate delay={0.5} className="mt-8 max-w-xl text-white/70 text-[17px] leading-relaxed">
              <p>
                Want the call before the call? Send a paragraph about the
                workflow that costs you the most time. We will reply inside one
                business hour with a sample agent spec.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="rule-top pb-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6 pt-12">
          {/* Direct info, no icons in squares */}
          <div className="col-span-12 md:col-span-4 space-y-10">
            <Reveal>
              <p className="mono text-[10px] tracking-mono uppercase text-white/40">
                Direct
              </p>
              <ul className="mt-4 space-y-2.5 text-white/85 text-[15px]">
                <li>
                  <a
                    href="mailto:ackra@ackraai.com"
                    data-testid="contact-email"
                    className="hover:text-periwinkle transition"
                  >
                    ackra@ackraai.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+16469442162"
                    data-testid="contact-phone"
                    className="hover:text-periwinkle transition"
                  >
                    +1 (646) 944 2162
                  </a>
                </li>
                <li className="text-white/55">New York City</li>
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mono text-[10px] tracking-mono uppercase text-white/40">
                Or skip the form
              </p>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 mono text-[11px] tracking-mono uppercase text-periwinkle hover:text-white transition"
                style={{ borderBottom: "1px solid var(--rule-hard)" }}
              >
                Book the call directly →
              </a>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mono text-[10px] tracking-mono uppercase text-white/40">
                What happens next
              </p>
              <ol className="mt-4 space-y-2 text-white/65 text-[14px] leading-relaxed">
                <li>
                  <span className="mono text-periwinkle mr-2">01.</span>
                  We read your note within the business hour.
                </li>
                <li>
                  <span className="mono text-periwinkle mr-2">02.</span>
                  You get a 1-page agent spec sketched against your workflow.
                </li>
                <li>
                  <span className="mono text-periwinkle mr-2">03.</span>
                  If it fits, we book the 30-min call. If not, no follow-up.
                </li>
              </ol>
            </Reveal>
          </div>

          {/* Form: sharp edges, hairline borders, mono labels, no rounded-2xl */}
          <form
            onSubmit={submit}
            data-testid="contact-form"
            className="col-span-12 md:col-span-8 mt-12 md:mt-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Field
                id="name"
                label="Name"
                value={form.name}
                onChange={update("name")}
                placeholder="Jane Doe"
                required
                edge="left"
              />
              <Field
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="jane@company.com"
                required
              />
              <Field
                id="phone"
                label="Phone"
                value={form.phone}
                onChange={update("phone")}
                placeholder="+1"
                edge="left top"
              />
              <Field
                id="company"
                label="Company"
                value={form.company}
                onChange={update("company")}
                placeholder="Acme Inc."
                edge="top"
              />
            </div>

            <div
              className="mt-0"
              style={{ borderLeft: "1px solid var(--rule)", borderTop: "1px solid var(--rule)" }}
            >
              <label
                htmlFor="message"
                className="block px-5 pt-5 mono text-[10px] tracking-mono uppercase text-white/40"
              >
                Workflow that costs you the most time*
              </label>
              <textarea
                id="message"
                data-testid="contact-input-message"
                value={form.message}
                onChange={update("message")}
                rows={6}
                placeholder="Be specific. Name the tool, the volume, the hour of day it bleeds."
                className="w-full bg-transparent px-5 py-3 text-white placeholder:text-white/50 text-[15px] focus:outline-none resize-none"
                required
              />
            </div>

            {/* Honeypot: hidden from humans, catches bots. Leave empty. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={form.website}
              onChange={update("website")}
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
            />

            {error && (
              <div
                data-testid="contact-error"
                className="mt-4 text-[13px] text-red-400 px-4 py-3"
                style={{ border: "1px solid rgba(239,68,68,0.35)" }}
              >
                {String(error)}
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              {status === "success" ? (
                <>
                  <p
                    data-testid="contact-success"
                    className="mono text-[11px] tracking-mono uppercase text-periwinkle"
                  >
                    Sent. We reply within the business hour.
                  </p>
                  <button
                    type="button"
                    data-testid="contact-send-another"
                    onClick={() => { setStatus("idle"); setError(""); }}
                    className="mono text-[10px] tracking-mono uppercase text-white/55 hover:text-white transition"
                  >
                    Send another
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  data-testid="contact-submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black mono text-[11px] tracking-mono uppercase hover:bg-periwinkle hover:text-black transition-colors disabled:opacity-50"
                >
                  {status === "loading" ? "Sending…" : "Send the note ↗"}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({ id, label, value, onChange, placeholder, type = "text", required, edge = "" }) {
  const style = {
    borderTop: edge.includes("top") ? "1px solid var(--rule)" : "1px solid var(--rule)",
    borderLeft: edge.includes("left") ? "1px solid var(--rule)" : "1px solid var(--rule)",
    borderRight: "1px solid var(--rule)",
  };
  return (
    <div style={style}>
      <label
        htmlFor={id}
        className="block px-5 pt-4 mono text-[10px] tracking-mono uppercase text-white/40"
      >
        {label}
        {required && <span className="text-periwinkle">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        data-testid={`contact-input-${id}`}
        className="w-full bg-transparent px-5 py-3 text-white placeholder:text-white/50 text-[15px] focus:outline-none"
      />
    </div>
  );
}
