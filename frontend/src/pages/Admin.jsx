import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API = "/api";
const SESSION_KEY = "ackra_admin_token";
const PAGE_SIZE = 25;
const muted = { color: "var(--muted)" };
const border = { borderColor: "var(--line)" };

function savedToken() {
  try { return typeof window === "undefined" ? "" : sessionStorage.getItem(SESSION_KEY) || ""; }
  catch { return ""; }
}

function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!pw || checking) return;
    setChecking(true);
    setError("");
    try {
      await axios.get(`${API}/admin/check`, {
        headers: { Authorization: `Bearer ${pw}` }, timeout: 10000,
      });
      try { sessionStorage.setItem(SESSION_KEY, pw); } catch { /* Current-tab state still works. */ }
      onAuth(pw);
    } catch (err) {
      setError(err?.response?.status === 401
        ? "That token was not accepted."
        : "We could not verify access. Please try again.");
    } finally { setChecking(false); }
  };

  return (
    <section data-testid="admin-gate" className="min-h-[75vh] flex items-center justify-center px-6 py-24">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.16em] mb-5" style={muted}>Private workspace</p>
        <h1 className="font-serif text-4xl mb-3">Contact inbox</h1>
        <p className="text-sm leading-relaxed mb-8" style={muted}>Enter your admin token to read and manage inquiries.</p>
        <label htmlFor="admin-token" className="field-label block mb-2">Admin token</label>
        <input id="admin-token" name="admin-token" type="password" value={pw}
          onChange={(event) => { setPw(event.target.value); setError(""); }}
          autoComplete="current-password" required className="input w-full" autoFocus
          aria-describedby={error ? "admin-auth-error" : undefined} />
        {error && <p id="admin-auth-error" role="alert" className="mt-3 text-sm" style={{ color: "var(--error)" }}>{error}</p>}
        <button type="submit" disabled={checking || !pw} className="button mt-6 w-full">
          {checking ? "Checking access…" : "Open inbox"}
        </button>
      </form>
    </section>
  );
}

function Message({ text }) {
  const [expanded, setExpanded] = useState(false);
  const needsExpansion = text.length > 180;
  return (
    <div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
        {needsExpansion && !expanded ? `${text.slice(0, 180)}…` : text}
      </p>
      {needsExpansion && <button type="button" aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        className="mt-3 text-sm underline underline-offset-4" style={{ color: "var(--accent)" }}>
        {expanded ? "Show less" : "Read full message"}
      </button>}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(savedToken);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");
  const [notice, setNotice] = useState("");
  const requestSequence = useRef(0);

  const evict = useCallback(() => {
    requestSequence.current += 1;
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Clear React state regardless. */ }
    setToken("");
    setItems([]);
    setTotal(null);
    setPage(1);
    setNotice("");
    setError("");
  }, []);

  const load = useCallback(async (nextPage = 1, signal) => {
    const request = ++requestSequence.current;
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API}/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: nextPage, page_size: PAGE_SIZE }, timeout: 15000, signal,
      });
      if (request !== requestSequence.current) return;
      setItems(data.items);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      if (axios.isCancel(err) || request !== requestSequence.current) return;
      if (err?.response?.status === 401) { evict(); return; }
      setError("The inbox could not be loaded. Please try refreshing.");
    } finally {
      if (request === requestSequence.current) setLoading(false);
    }
  }, [token, evict]);

  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    load(1, controller.signal);
    return () => controller.abort();
  }, [token, load]);

  const remove = async (id) => {
    if (deleting || !window.confirm("Permanently delete this inquiry?")) return;
    setDeleting(id);
    setError("");
    setNotice("");
    try {
      await axios.delete(`${API}/contact/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token}` }, timeout: 10000,
      });
      setNotice("Inquiry deleted.");
      await load(page);
    } catch (err) {
      if (err?.response?.status === 401) evict();
      else setError("The inquiry could not be deleted. Please refresh before trying again.");
    } finally { setDeleting(""); }
  };

  if (!token) return <PasswordGate onAuth={setToken} />;
  const pages = Math.max(1, Math.ceil((total || 0) / PAGE_SIZE));
  const first = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const last = total ? first + items.length - 1 : 0;
  const busy = loading || Boolean(deleting);

  return (
    <div data-testid="page-admin" className="max-w-6xl mx-auto px-6 md:px-10 py-24" style={{ color: "var(--text)" }}>
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b" style={border}>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] mb-4" style={muted}>Private workspace</p>
          <h1 className="font-serif text-4xl md:text-6xl">Contact inbox</h1>
          <p className="mt-3 text-sm" style={muted} data-testid="admin-count">
            {total === null ? "Loading inquiries…" : `${total} ${total === 1 ? "inquiry" : "inquiries"} total`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => load(page)} disabled={busy} data-testid="admin-refresh" className="button button-secondary">Refresh</button>
          <button type="button" onClick={evict} disabled={Boolean(deleting)} className="button button-secondary">Sign out</button>
        </div>
      </div>
      {error && <p role="alert" className="my-6 text-sm" style={{ color: "var(--error)" }}>{error}</p>}
      <p role="status" aria-live="polite" className="mt-4 text-sm" style={{ color: "var(--success)" }}>{notice}</p>
      {loading ? (
        <p data-testid="admin-loading" role="status" className="py-16" style={muted}>Loading inquiries…</p>
      ) : items.length === 0 && !error ? (
        <div data-testid="admin-empty" className="py-16">
          <h2 className="font-serif text-3xl">The inbox is clear.</h2>
          <p className="mt-3" style={muted}>New contact form inquiries will appear here.</p>
        </div>
      ) : (
        <div data-testid="admin-table" className="divide-y" style={border}>
          {items.map((contact) => (
            <article key={contact.id} data-testid={`admin-row-${contact.id}`}
              className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 py-8 border-b" style={border}>
              <div className="min-w-0">
                <h2 className="font-medium break-words">{contact.name}</h2>
                {contact.company && <p className="text-sm mt-1 break-words" style={muted}>{contact.company}</p>}
                <a className="block text-sm mt-3 underline underline-offset-4 break-all" href={`mailto:${contact.email}`}>{contact.email}</a>
                {contact.phone && <p className="text-sm mt-2" style={muted}>{contact.phone}</p>}
                <time dateTime={contact.created_at} className="block text-xs mt-4" style={muted}>
                  {new Date(contact.created_at).toLocaleString()}
                </time>
              </div>
              <div className="min-w-0">
                <Message text={contact.message} />
                <button type="button" onClick={() => remove(contact.id)} disabled={busy}
                  aria-label={`Delete inquiry from ${contact.name}`} data-testid={`admin-delete-${contact.id}`}
                  className="mt-5 text-xs underline underline-offset-4 disabled:opacity-50" style={muted}>
                  {deleting === contact.id ? "Deleting…" : "Delete inquiry"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {total > 0 && <nav aria-label="Inbox pages" className="flex flex-wrap items-center justify-between gap-4 pt-7">
        <p className="text-sm" style={muted} aria-live="polite">{first}–{last} of {total} · Page {page} of {pages}</p>
        <div className="flex gap-3">
          <button type="button" className="button button-secondary" disabled={busy || page <= 1} onClick={() => load(page - 1)}>Previous</button>
          <button type="button" className="button button-secondary" disabled={busy || page >= pages} onClick={() => load(page + 1)}>Next</button>
        </div>
      </nav>}
    </div>
  );
}
