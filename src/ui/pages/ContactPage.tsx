import DefaultPageLayout from "../layout/DefaultPageLayout";

function ContactPageContent() {
  return <div className="container">
    <p>
      For any suggestions, queries or issues please contact us at below email address:
    </p>
    <b>help@uniprot.org</b>
  </div>
}

function ContactPage() {
  return <DefaultPageLayout content={<ContactPageContent />} />
}
export default ContactPage;