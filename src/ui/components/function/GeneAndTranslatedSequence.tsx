import { ENSEMBL_GENE_RUL } from "../../../constants/ExternalUrls";
import {TranslatedSequence} from "../../../types/MappingResponse";
import React from "react";
import {ExtLink} from "../common/Link";

interface GeneAndTranslatedSequenceProps {
  ensg: string;
  ensp: Array<TranslatedSequence>;
}

function GeneAndTranslatedSequence(props: GeneAndTranslatedSequenceProps) {
  const {ensg, ensp} = props;
  const ensgUrl = ENSEMBL_GENE_RUL + ensg;

  return (
    <div className="gene-sequence-panel">
      <div className="column-header">Ensembl Gene and Transcript Information</div>

      <div className="gene-sequence-grid">
        <div className="gene-info">
          <div className="section-title">Ensembl Gene</div>
          <ExtLink url={ensgUrl} text={ensg} />
        </div>

        <div className="transcript-info">
          <div className="section-title">Canonical Isoform Transcripts</div>
          <div className="transcript-list">
            {ensp.map((ensps, index) => {
              const enspsUrl = ENSEMBL_GENE_RUL + ensps.ensp;
              return (
                <div key={index} className="transcript-item">
                  <ExtLink url={enspsUrl} text={ensps.ensp} />
                  <span className="transcript-id">{ensps.ensts}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneAndTranslatedSequence;