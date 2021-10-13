import { EmptyElement } from "../../../constants/Const";
import Tool from "../../elements/Tool";

const ProteinReviewStatus = (props: { type: string }) => {
  switch (props.type) {
    case 'Swiss-Prot isoform':
      return <Tool tip="UniProt isoform reviewed">
        <span className="icon icon-generic protein-review-status protein-review-status--isoform-reviewed" data-icon="q" />
      </Tool>
    case 'Swiss-Prot':
      return <Tool tip="UniProt reviewed">
        <span className="icon icon-generic protein-review-status protein-review-status--reviewed" data-icon="q" />
      </Tool>
    case 'TrEMBL':
      return <Tool tip="TrEMBL unreviewed">
        <span className="icon icon-generic protein-review-status protein-review-status--unreviewd" data-icon="Q" />
      </Tool>
    default:
      return EmptyElement;
  }
};

export default ProteinReviewStatus;
