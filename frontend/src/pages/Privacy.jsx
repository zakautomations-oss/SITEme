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
        <p>This policy explains what personal information ACKRA LLC (“Ackra”, “we”) handles, why, and how you can ask us to delete it. It covers two things: this website, and the Ackra AI app and messaging service we run for the businesses we work with.</p>

        <h2>Who we are</h2>
        <p>Ackra builds and runs messaging assistants for jewelry businesses. You can reach us at {mail}.</p>

        <h2>If you message a business that uses Ackra</h2>
        <p>A business can connect its Facebook Page or Instagram professional account to Ackra. When you send that business a message on Messenger or Instagram, Meta delivers the message to us on the business’s behalf. The business decides how its conversations are handled. We act on its instructions.</p>
        <h3>What we receive and store</h3>
        <ul>
          <li>The text of the messages you send to the business and of the replies sent to you. If you send a photo or other attachment, we record that one arrived, but we do not store the file.</li>
          <li>The identifier Meta assigns to you for that Page or account, and the time of each message.</li>
          <li>Contact details and other information you choose to give in the conversation.</li>
          <li>Where the business turns these features on, notes the assistant takes from the conversation, such as a date or preference you mention, and contact details you type, which are stored encrypted.</li>
        </ul>
        <h3>What we use it for</h3>
        <ul>
          <li>To prepare replies to your message for the business’s staff to review, and to send replies where the business has turned that on.</li>
          <li>To keep the business’s record of the conversation.</li>
          <li>To improve that business’s own assistant, for example by learning from replies its staff approve or edit. We do not use one business’s conversations to improve another business’s assistant.</li>
          <li>To keep the service working and secure.</li>
        </ul>
        <p>Replies may be drafted by software. We do not sell this information. We do not share one business’s conversations with another business.</p>

        <h2>If you visit this website</h2>
        <ul>
          <li>If you send the contact form, we receive the details you enter and use them to reply to you.</li>
          <li>Our Services page shows a booking calendar provided by Calendly, which loads from Calendly when you open that page and may set cookies. If you book a call, Calendly handles the booking under its own privacy policy.</li>
          <li>We use a Google Ads tag to measure whether our advertising leads to enquiries. Google may set cookies for this.</li>
        </ul>

        <h2>Who we share it with</h2>
        <p>We use service providers to run Ackra. Amazon Web Services, Anthropic, Vercel and our database and email providers process information for us. Meta, Google and Calendly also handle information under their own privacy policies.</p>
        <ul>
          <li>Meta Platforms, which delivers Messenger and Instagram messages.</li>
          <li>Amazon Web Services, which hosts the messaging service and its records.</li>
          <li>Anthropic, whose AI models draft replies.</li>
          <li>Vercel, which hosts this website.</li>
          <li>A database provider, which stores contact form enquiries.</li>
          <li>Google, which provides our email and the advertising tag described above, and Calendly, as described above.</li>
        </ul>
        <p>We may also disclose information when the law requires it.</p>

        <h2>How long we keep it</h2>
        <p>Conversation records do not expire automatically. We keep them until you or the business asks us to delete them. Website enquiries also do not expire automatically. We keep them until we delete them.</p>

        <h2 id="data-deletion">How to delete your data</h2>
        <p>Email {mail} with the subject “Delete my data”. Tell us which business you messaged, the Facebook or Instagram account you used, and roughly when you wrote, so we can find your conversation. You can also ask the business, which will pass your request to us.</p>
        <p>We delete your messages, your contact record and anything the assistant noted about you within 30 days of your request, including copies used to improve the business’s assistant. We confirm when it is done, by email to the address you wrote from, or through the business if your request came through it. We keep a record that the request was made and carried out, any request you made to stop receiving messages, and a log of events in the conversation. That log holds our internal identifiers, times and codes, and may include the text of automatic messages we sent you. Deleted records remain in encrypted backups until those backups expire, up to 14 days later.</p>

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
