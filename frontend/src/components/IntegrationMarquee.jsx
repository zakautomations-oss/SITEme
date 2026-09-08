import React, { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

const integrations = [["hubspot", "HubSpot"], ["notion", "Notion"], ["stripe", "Stripe"], ["zapier", "Zapier"], ["googlesheets", "Google Sheets"]];

export default function IntegrationMarquee() {
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <section className={`home-integrations site-container ${ready ? "is-ready" : ""} ${paused ? "is-paused" : ""}`} aria-label="Integrations">
      <p>Built around <br />your existing tools.</p>
      <div className="integration-window"><div className="integration-track">
        {[0, 1].map(copy => <ul key={copy} className={`integration-group ${copy ? "integration-copy" : ""}`} aria-hidden={copy ? "true" : undefined}>{integrations.map(([slug, name]) => <li key={slug}><img src={`/brands/${slug}.svg`} alt="" width="25" height="25" loading="lazy" /><span>{name}</span></li>)}</ul>)}
      </div></div>
      {ready && <button className="integration-pause" type="button" aria-label={paused ? "Play integration animation" : "Pause integration animation"} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button>}
    </section>
  );
}
