import React, { useEffect, useState } from "react";
import axios from "axios";
import { Reveal, Words } from "../components/AnimatedText";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SESSION_KEY = "ackra_admin_token";

function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState("");
  const [wrong, setWrong] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChecking(true);
    try {
      await axios.get(`${API}/contact`, {
        headers: { Authorization: `Bearer ${pw}` },
      });
      sessionStorage.setItem(SESSION_KEY, pw);
      onAuth(pw);
    } catch {
      setWrong(true);
      setPw("");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div data-testid="admin-gate" className="bg-ink min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm px-8">
        <p className="mono text-[10px] tracking-mono uppercase text-white/40 mb-8">
          §00 / Admin access
        </p>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setWrong(false); }}
          placeholder="Admin token"
          autoFocus
          className="w-full bg-transparent border-b border-white/20 text-white py-3 text-[15px] outline-none focus:border-white/60 transition placeholder:text-white/25"
        />
        {wrong && (
          <p className="mono text-[10px] tracking-mono uppercase text-red-400 mt-3">
            Incorrect token.
          </p>
        )}
        <button
          type="submit"
          disabled={checking || !pw}
          className="mt-8 w-full mono text-[11px] tracking-mono uppercase text-white/70 hover:text-white py-3 transition disabled:opacity-40"
          style={{ border: "1px solid var(--rule-hard)" }}
        >
          {checking ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY) || "");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = { Authorization: `Bearer ${token}` };

  const evict = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken("");
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await axios.get(`${API}/contact`, { headers: authHeaders });
      setItems(r.data || []);
    } catch (e) {
      if (e?.response?.status === 401) { evict(); return; }
      setError(`Failed to load. (${e?.response?.status ?? "network error"})`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      await axios.delete(`${API}/contact/${id}`, { headers: authHeaders });
      setItems((arr) => arr.filter((i) => i.id !== id));
    } catch (e) {
      if (e?.response?.status === 401) evict();
    }
  };

  if (!token) {
    return <PasswordGate onAuth={(tok) => setToken(tok)} />;
  }

  return (
    <div data-testid="page-admin" className="bg-ink">
      <section className="pt-24 md:pt-28 pb-12">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-3">
            <p className="mono text-[10px] tracking-mono uppercase text-white/40">
              §01 / Inbox
            </p>
          </div>
          <div className="col-span-12 md:col-span-9 flex items-end justify-between">
            <div>
              <h1 className="font-serif text-white text-[44px] md:text-[80px] leading-[0.95] tracking-tightest">
                <Words text="Contact" immediate />{" "}
                <Words text="inbox." className="serif-italic text-periwinkle" delay={0.15} immediate />
              </h1>
              <Reveal immediate delay={0.4} className="mt-3">
                <p className="mono text-[11px] tracking-mono uppercase text-white/45">
                  {items.length} {items.length === 1 ? "entry" : "entries"} / live from mongo
                </p>
              </Reveal>
            </div>
            <button
              onClick={load}
              data-testid="admin-refresh"
              className="mono text-[11px] tracking-mono uppercase text-white/70 hover:text-white px-4 py-2"
              style={{ border: "1px solid var(--rule-hard)" }}
            >
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="rule-top">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 pt-10 pb-24">
          {loading ? (
            <p data-testid="admin-loading" className="mono text-[11px] tracking-mono uppercase text-white/40 py-10">
              Loading…
            </p>
          ) : error ? (
            <p className="text-red-400 py-10">{error}</p>
          ) : items.length === 0 ? (
            <div data-testid="admin-empty" className="py-16">
              <p className="font-serif text-white text-[40px] tracking-tightest">
                Nothing yet.
              </p>
              <p className="mt-2 text-white/50 text-[15px]">
                When someone writes in, it lands here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]" data-testid="admin-table">
                <thead>
                  <tr className="rule-bottom text-left mono text-[10px] tracking-mono uppercase text-white/40">
                    <th className="py-3 pr-6">Received</th>
                    <th className="py-3 pr-6">Name</th>
                    <th className="py-3 pr-6">Contact</th>
                    <th className="py-3 pr-6">Company</th>
                    <th className="py-3 pr-6">Message</th>
                    <th className="py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr
                      key={c.id}
                      data-testid={`admin-row-${c.id}`}
                      className="rule-bottom hover:bg-white/[0.02] transition align-top"
                    >
                      <td className="py-4 pr-6 mono text-[11px] text-white/50 whitespace-nowrap">
                        {new Date(c.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 pr-6 text-white">{c.name}</td>
                      <td className="py-4 pr-6 text-white/70">
                        <div>{c.email}</div>
                        {c.phone && <div className="text-white/45">{c.phone}</div>}
                      </td>
                      <td className="py-4 pr-6 text-white/70">
                        {c.company || <span className="text-white/30">/</span>}
                      </td>
                      <td className="py-4 pr-6 text-white/80 max-w-md">
                        <p className="line-clamp-3">{c.message}</p>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => remove(c.id)}
                          data-testid={`admin-delete-${c.id}`}
                          className="mono text-[10px] tracking-mono uppercase text-white/50 hover:text-red-400 transition px-3 py-1.5"
                          style={{ border: "1px solid var(--rule)" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
