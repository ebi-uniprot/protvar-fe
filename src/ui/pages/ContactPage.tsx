import DefaultPageLayout from "../layout/DefaultPageLayout";
import email from "../../images/email-image.png";

function ContactPageContent() {
  return <>
    <div className="container">
      <h4>Contact us</h4>
      <p>Get in touch using the form below or send us an email with any attachments at&nbsp;
      <img className="img-size" src={email} alt="protvar-email" /></p>
      <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfVhyTjeH5NG0QnYU0LozFR1tlkiNvl8nN5g5pIrcL76yO4YA/viewform?embedded=true"
        width="760" height="970" frameBorder={0} marginHeight={0} marginWidth={0} title="Contact us" id="googleContactForm"
      >
        Loading...
      </iframe>
    </div>
  </>
}

function ContactPage() {
  return <DefaultPageLayout content={<ContactPageContent />} />
}
export default ContactPage;