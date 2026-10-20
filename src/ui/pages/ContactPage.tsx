import DefaultPageLayout from "../layout/DefaultPageLayout";
import { useEffect } from "react";
import { TITLE } from "../../constants/const";
import {CONTACT_FORM_URL} from "../../constants/ExternalUrls";

function ContactPageContent() {
  useEffect(() => {
    document.title = `Contact | ${TITLE}`;
  }, []);

  return (
    <div className="container">
      <h5 className="page-header">Contact us</h5>

      <div className="contact-intro">
        <div className="contact-intro-text">
          <p>Use the form below to send us feedback, report an issue, or ask a question about ProtVar.</p>
          <p className="contact-alt">
            <i className="bi bi-envelope" />
            Prefer email?&nbsp;<a href="mailto:protvar@ebi.ac.uk">protvar@ebi.ac.uk</a>
          </p>
        </div>
      </div>

      <div className="contact-form-wrapper">
        <iframe
          src={CONTACT_FORM_URL}
          height="970"
          title="Contact us"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}

function ContactPage() {
  return <DefaultPageLayout content={<ContactPageContent />} />;
}

export default ContactPage;
