import { ENSEMBL_GENE_RUL } from "../../../constants/ExternalUrls";
import {TranslatedSequence} from "../../../types/MappingResponse";
import React from "react";

interface GeneAndTranslatedSequenceProps {
  ensg: string;
  ensp: Array<TranslatedSequence>;
}

function GeneAndTranslatedSequence(props: GeneAndTranslatedSequenceProps) {
  const {ensg, ensp} = props;
  const ensgUrl = ENSEMBL_GENE_RUL + ensg;

  return (
    <div className="gene-sequence-panel">
      <div className="section-title">Ensembl Gene and Transcript Information</div>

      <div className="gene-sequence-grid">
        <div className="gene-info">
          <h4>Ensembl Gene</h4>
          <a href={ensgUrl} target="_blank" rel="noreferrer" className="ext-link gene-link">
            {ensg}
          </a>
        </div>

        <div className="transcript-info">
          <h4>Canonical Isoform Transcripts</h4>
          <div className="transcript-list">
            {ensp.map((ensps, index) => {
              const enspsUrl = ENSEMBL_GENE_RUL + ensps.ensp;
              return (
                <div key={index} className="transcript-item">
                  <a href={enspsUrl} target="_blank" rel="noreferrer" className="ext-link">
                    {ensps.ensp}
                  </a>
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