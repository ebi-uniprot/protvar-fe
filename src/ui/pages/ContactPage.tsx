import Loader from "../elements/Loader";
import DefaultPageLayout from "../layout/DefaultPageLayout";

function ContactPageContent() {
  return <>
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfVhyTjeH5NG0QnYU0LozFR1tlkiNvl8nN5g5pIrcL76yO4YA/viewform?embedded=true"
      width="760" height="970" frameBorder={0} marginHeight={0} marginWidth={0} title="Contact us"
    >
      <Loader />
    </iframe>
  </>
}

function ContactPage() {
  return <DefaultPageLayout content={<ContactPageContent />} />
}
export default ContactPage;