import { ButtonModal } from "franklin-sites";

function ContactModal() {
  return <ButtonModal
    buttonText="Contact"
    title="Contact"
    withFooterCloseButton={true}
    withHeaderCloseButton={false}
    height="20%"
    width="30%"
  >
    <div className="container">
      <p>
        For any suggestions, queries or issues please contact us
        at below email address:
      </p>
      <b>help@uniprot.org</b>
    </div>
  </ButtonModal>
}
export default ContactModal;