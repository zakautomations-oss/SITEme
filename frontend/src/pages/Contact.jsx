import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowUpRight, Check } from "lucide-react";
import { BOOKING_LABEL, BOOKING_URL, CONTACT_EMAIL, CONTACT_PHONE } from "../config/site";
import "../components/functional.css";

const initial = { name: "", email: "", phone: "", company: "", message: "", website: "" };
const limits = { name: 120, email: 254, phone: 40, company: 160, message: 4000, website: 200 };
const labels = { name: "Name", email: "Email", phone: "Phone", company: "Company", message: "Message" };

export function validateContact(form) {
  const errors = {};
  for (const key of ["name", "email", "message"]) {
    if (!form[key].trim()) errors[key] = `Enter your ${key === "message" ? "project or message" : key}.`;
  }
  for (const key of Object.keys(labels)) {
    if (form[key].trim().length > limits[key]) errors[key] = `${labels[key]} must be ${limits[key]} characters or fewer.`;
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const successRef = useRef(null);
  const requestRef = useRef(null);
  const inFlightRef = useRef(false);
  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => { if (status === "success") successRef.current?.focus(); }, [status]);

  const update = (key) => (event) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }));
    setErrors((previous) => { const next = { ...previous }; delete next[key]; return next; });
  };
  const focusError = (fieldErrors) => formRef.current?.elements.namedItem(Object.keys(fieldErrors)[0])?.focus();

  const submit = async (event) => {
    event.preventDefault();
    if (inFlightRef.current) return;
    setError("");
    const fieldErrors = validateContact(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) { focusError(fieldErrors); return; }
    inFlightRef.current = true;
    setStatus("loading");
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      await axios.post("/api/contact", {
        name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || null,
        company: form.company.trim() || null, message: form.message.trim(), website: form.website,
      }, { timeout: 15000, signal: controller.signal });
      if (controller.signal.aborted) return;
      setStatus("success");
      setForm(initial);
    } catch (failure) {
      if (controller.signal.aborted) return;
      setStatus("error");
      const responseStatus = failure.response?.status;
      if (responseStatus === 422 && Array.isArray(failure.response?.data?.detail)) {
        const serverErrors = {};
        failure.response.data.detail.forEach((item) => {
          const key = item.loc?.[item.loc.length - 1];
          if (labels[key]) serverErrors[key] = key === "email" ? "Enter a valid email address." : `Check your ${key} and try again.`;
        });
        setErrors(serverErrors);
        setTimeout(() => focusError(serverErrors), 0);
        setError("Please check the highlighted fields and send your note again.");
      } else if (responseStatus === 429) {
        setError("Too many attempts. Please wait a few minutes before trying again, or email us directly.");
      } else if (failure.code === "ECONNABORTED" || failure.code === "ETIMEDOUT") {
        setError("Sending took too long. Your note is still here. Please try again or email us directly.");
      } else {
        setError("We could not send your note. Your details are still here. Please try again or email us directly.");
      }
    } finally {
      inFlightRef.current = false;
      if (requestRef.current === controller) requestRef.current = null;
    }
  };

  return (
    <div data-testid="page-contact" className="contact-page">
      <section className="site-container contact-heading">
        <h1>What would you<br />like to build?</h1>
        <p>A new website, a better app, or a system that makes work easier. Tell us what you have in mind.</p>
      </section>
      <section className="site-container contact-layout" aria-label="Contact Ackra">
        <aside className="contact-details">
          <h2>Start with a note.</h2>
          <p>Share your goals, who you are building for, and what you would like to change.</p>
          <div className="contact-direct">
            <a href={`mailto:${CONTACT_EMAIL}`} data-testid="contact-email">{CONTACT_EMAIL}</a>
            <a href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`} data-testid="contact-phone">{CONTACT_PHONE}</a>
            <span>New York City</span>
          </div>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="footer-book-link">
            {BOOKING_LABEL}<ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </aside>
        <form ref={formRef} onSubmit={submit} noValidate data-testid="contact-form" className="contact-form" aria-busy={status === "loading"}>
          {status === "success" ? (
            <div className="contact-success" ref={successRef} tabIndex={-1} role="status" data-testid="contact-success">
              <Check size={26} strokeWidth={1.6} aria-hidden="true" />
              <h2>Your note is with us.</h2>
              <p>Thank you for sharing the details. We will follow up at the email address you provided.</p>
              <button type="button" className="button button-secondary" data-testid="contact-send-another"
                onClick={() => { setStatus("idle"); setError(""); setTimeout(() => formRef.current?.elements.namedItem("name")?.focus(), 0); }}>
                Send another note
              </button>
            </div>
          ) : (
            <>
              <p className="contact-required-note">Fields marked * are required.</p>
              <fieldset disabled={status === "loading"}>
                <legend className="sr-only">Your contact details and project</legend>
                <div className="contact-fields">
                  <Field id="name" label="Name" value={form.name} onChange={update("name")} autoComplete="name" placeholder="Your name" required error={errors.name} />
                  <Field id="email" label="Email" type="email" value={form.email} onChange={update("email")} autoComplete="email" placeholder="you@yourcompany.com" required error={errors.email} />
                  <Field id="phone" label="Phone" type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" placeholder="Your phone number" error={errors.phone} />
                  <Field id="company" label="Company" value={form.company} onChange={update("company")} autoComplete="organization" placeholder="Your company" error={errors.company} />
                </div>
                <div className="field contact-message-field">
                  <label htmlFor="message" className="field-label">Tell us about your project <span aria-hidden="true">*</span></label>
                  <textarea id="message" name="message" data-testid="contact-input-message" value={form.message} onChange={update("message")}
                    rows={6} maxLength={limits.message} placeholder="What are you building or improving? Tell us about your audience, goals, and any existing website, app, or tools." className="input"
                    required aria-invalid={Boolean(errors.message)} aria-describedby={`message-hint${errors.message ? " message-error" : ""}`} />
                  <p id="message-hint" className="field-hint">Up to 4,000 characters.</p>
                  {errors.message && <p id="message-error" className="field-error">{errors.message}</p>}
                </div>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={update("website")} maxLength={limits.website} className="contact-honeypot" />
              </fieldset>
              {error && <div data-testid="contact-error" className="contact-error" role="alert"><p>{error}</p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div>}
              <div className="contact-form-actions">
                <button type="submit" data-testid="contact-submit" disabled={status === "loading"} className="button">
                  {status === "loading" ? "Sending..." : "Send the note"}
                  {status !== "loading" && <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />}
                </button>
                <span role="status" aria-live="polite" className="sr-only">{status === "loading" ? "Sending your note." : Object.keys(errors).length ? "Please correct the highlighted fields." : ""}</span>
                <p className="field-hint contact-data-note">Your contact details and message are stored for Ackra to review your inquiry.</p>
              </div>
            </>
          )}
        </form>
      </section>
    </div>
  );
}

function Field({ id, label, value, onChange, placeholder, autoComplete, type = "text", required, error }) {
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">{label}{required && <span aria-hidden="true"> *</span>}</label>
      <input id={id} name={id} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        maxLength={limits[id]} required={required} data-testid={`contact-input-${id}`} className="input"
        aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  );
}
