import DefaultPageLayout from "../layout/DefaultPageLayout";

function ContactPageContent() {
  return <>
    <div className="container">
      <h4>Contact us</h4>
      <p>Get in touch using the form below.</p>
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