import DefaultPageLayout from "../layout/DefaultPageLayout";
import { useEffect } from "react";
import { TITLE } from "../../constants/const";

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
          src="https://docs.google.com/forms/d/e/1FAIpQLSfVhyTjeH5NG0QnYU0LozFR1tlkiNvl8nN5g5pIrcL76yO4YA/viewform?embedded=true"
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
