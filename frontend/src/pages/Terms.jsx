import React from "react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "../config/site";

const EFFECTIVE_DATE = "November 15, 2026";
const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function Terms() {
  return <div data-testid="page-terms">
    <section className="site-container legal-page">
      <h1 className="section-title">Terms of Service</h1>
      <p className="body-note">ACKRA LLC, doing business as Ackra AI. Effective {EFFECTIVE_DATE}.</p>

      <div className="legal-body">
        <p>These terms are between you and ACKRA LLC (“Ackra”, “we”). By using this website, you agree to them.</p>

        <h2>Who we are</h2>
        <p>Ackra builds and runs messaging assistants for jewelry businesses. You can reach us at {mail}.</p>

        <h2>What these terms cover</h2>
        <ul>
          <li>This website.</li>
          <li>The Ackra messaging service, as you experience it when you message a business that uses Ackra on Messenger or Instagram.</li>
        </ul>
        <p>These terms do not cover a business’s own use of Ackra.</p>

        <h2>If you message a business that uses Ackra</h2>
        <p>This section explains how the service works; it does not create an agreement between you and Ackra. You do not need an account with us. Your relationship is with the business you messaged.</p>
        <ul>
          <li>Replies may be drafted by software. A person reviews each draft before it is sent, unless the business has chosen to have replies sent on its behalf.</li>
          <li>Ackra is built so that if you ask whether you are talking to software, the reply says so.</li>
          <li>The business, not Ackra, is the seller. It is responsible for its products, its prices, and any promise made to you in the conversation.</li>
        </ul>

        <h2>Acceptable use</h2>
        <p>Do not use this website or the service to:</p>
        <ul>
          <li>break the law or the rights of others;</li>
          <li>send spam, harassment, or content that is threatening or abusive;</li>
          <li>pretend to be someone else;</li>
          <li>try to get into systems or data you are not allowed to reach, or interfere with how the website or the service works;</li>
          <li>copy, resell, or try to extract the source code of our software.</li>
        </ul>

        <h2>Our content and software</h2>
        <p>We own this website, its content, and the Ackra software, apart from material that belongs to others. You may view the website for your own use. These terms do not give you any other right to them.</p>

        <h2>Your privacy</h2>
        <p>How we handle personal information is set out in our <Link to="/privacy">Privacy Policy</Link>. To ask us to delete your data, follow the steps in <Link to="/privacy#data-deletion">How to delete your data</Link>.</p>

        <h2>No guarantee</h2>
        <p>We provide this website and the service “as is” and “as available”. A drafted reply can be wrong. We do not promise that the website or the service will be uninterrupted or free of errors.</p>

        <h2>Limit of liability</h2>
        <p>To the extent the law allows, Ackra is not liable for any indirect or consequential loss, or for any loss that comes from a business’s products, prices, or promises, arising from your use of this website or the service.</p>

        <h2>Changes</h2>
        <p>If we change these terms, we will post the new version here with a new effective date.</p>

        <h2>Contact</h2>
        <p>Questions about these terms go to {mail}.</p>
      </div>
    </section>
  </div>;
}
