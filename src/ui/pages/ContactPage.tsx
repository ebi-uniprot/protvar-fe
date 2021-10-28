import DefaultPageLayout from "../layout/DefaultPageLayout";

function ContactPageContent() {
  return <>
    <div className="container">
      <h3>Contact us</h3>
      <p>Use below form to contact us. You can also email us directly on Ap1e2Bp3Cv4De5p@6e7b8i9.ac.uk,
        especially if you would like to send attachments or screenshots.
        Remove all the number and capital letters from email address.</p>
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