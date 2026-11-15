import React from "react";
import { CONTACT_EMAIL } from "../config/site";

const EFFECTIVE_DATE = "November 15, 2026";
const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function Privacy() {
  return <div data-testid="page-privacy">
    <section className="site-container legal-page">
      <h1 className="section-title">Privacy Policy</h1>
      <p className="body-note">ACKRA LLC, doing business as Ackra AI. Effective {EFFECTIVE_DATE}.</p>

      <div className="legal-body">
        <p>This policy explains what personal information ACKRA LLC (“Ackra”, “we”) handles, why, and how you can ask us to delete it. It covers two things: this website, and the messaging service we run for the businesses we work with.</p>

        <h2>Who we are</h2>
        <p>Ackra builds and runs messaging assistants for jewelry businesses. You can reach us at {mail}.</p>

        <h2>If you message a business that uses Ackra</h2>
        <p>A business can connect its Facebook Page or Instagram professional account to Ackra. When you send that business a message on Messenger or Instagram, Meta delivers the message to us on the business’s behalf. The business decides how its conversations are handled. We act on its instructions.</p>
        <h3>What we receive and store</h3>
        <ul>
          <li>The messages you send to the business and the replies sent to you, including attachments.</li>
          <li>The identifier Meta assigns to you for that Page or account, and the time of each message.</li>
          <li>Contact details and other information you choose to give in the conversation.</li>
        </ul>
        <h3>What we use it for</h3>
        <ul>
          <li>To prepare replies to your message for the business’s staff to review, and to send replies where the business has turned that on.</li>
          <li>To keep the business’s record of the conversation.</li>
          <li>To keep the service working and secure.</li>
        </ul>
        <p>Replies may be drafted by software. We do not sell this information. We do not share one business’s conversations with another business.</p>

        <h2>If you visit this website</h2>
        <ul>
          <li>If you send the contact form, we receive the details you enter and use them to reply to you.</li>
          <li>If you book a call, the booking is handled by Calendly under its own privacy policy.</li>
          <li>We use a Google Ads tag to measure whether our advertising leads to enquiries. Google may set cookies for this.</li>
        </ul>

        <h2>Who we share it with</h2>
        <p>We use service providers to run Ackra. They process information for us and only for the purposes above:</p>
        <ul>
          <li>Meta Platforms, which delivers Messenger and Instagram messages.</li>
          <li>Amazon Web Services, which hosts the messaging service and its records.</li>
          <li>Anthropic, whose AI models draft replies.</li>
          <li>Vercel, which hosts this website.</li>
          <li>Google and Calendly, as described above.</li>
        </ul>
        <p>We may also disclose information when the law requires it.</p>

        <h2>How long we keep it</h2>
        <p>We keep conversation records for as long as the business needs them, or until you or the business asks us to delete them. We keep website enquiries for as long as we need them to reply and to keep a record of the enquiry.</p>

        <h2 id="data-deletion">How to delete your data</h2>
        <p>Email {mail} with the subject “Delete my data”. Tell us which business you messaged and the name on the Facebook or Instagram account you used, so we can find your conversation. You can also ask the business directly.</p>
        <p>We delete your messages and your contact record within 30 days and confirm by email when it is done. We keep a record that the request was made and carried out.</p>

        <h2>Your choices and rights</h2>
        <p>You can ask us for a copy of your information, ask us to correct it, or ask us to stop using it, at {mail}. Depending on where you live, the law may give you further rights. If a request is one only the business can decide, we will pass it to the business and tell you.</p>

        <h2>Children</h2>
        <p>Ackra is not directed to children under 13, and we do not knowingly collect their information.</p>

        <h2>Changes</h2>
        <p>If we change this policy, we will post the new version here with a new effective date.</p>
      </div>
    </section>
  </div>;
}
