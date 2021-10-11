import { EmptyElement } from "../../../constants/Const";
import { tip } from "../../../utills/Util";

const ProteinReviewStatus = (props: { type: string }) => {
  switch (props.type) {
    case 'Swiss-Prot isoform':
      return <span {...tip("UniProt isoform reviewed")}>
        <span className="icon icon-generic protein-review-status protein-review-status--isoform-reviewed" data-icon="q" />
      </span>
    case 'Swiss-Prot':
      return <span {...tip("UniProt reviewed")}>
        <span className="icon icon-generic protein-review-status protein-review-status--reviewed" data-icon="q" />
      </span>
    case 'TrEMBL':
      return <span {...tip("TrEMBL unreviewed")}>
        <span className="icon icon-generic protein-review-status protein-review-status--unreviewd" data-icon="Q" />
      </span>
    default:
      return EmptyElement;
  }
};

export default ProteinReviewStatus;
