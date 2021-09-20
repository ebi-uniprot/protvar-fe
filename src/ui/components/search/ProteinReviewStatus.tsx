const ProteinReviewStatus = (props: { type: string }) => {
  switch (props.type) {
    case 'Swiss-Prot isoform':
      return <span className="icon icon-generic protein-review-status protein-review-status--isoform-reviewed" data-icon="q" title="UniProt isoform reviewed" />;
    case 'Swiss-Prot':
      return <span className="icon icon-generic protein-review-status protein-review-status--reviewed" data-icon="q" title="UniProt reviewed" />;
    case 'TrEMBL':
      return <span className="icon icon-generic protein-review-status protein-review-status--unreviewd" data-icon="Q" title="TrEMBL unreviewed" />;
    default:
      return <></>;
  }
};

export default ProteinReviewStatus;
