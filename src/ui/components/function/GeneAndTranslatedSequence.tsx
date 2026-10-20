import {TranslatedSequence} from "../../../types/MappingResponse";
import React from "react";
import {ExtLink} from "../common/Link";
import {getEnsemblIdUrl} from "../../pages/result/PrimaryRow";

interface GeneAndTranslatedSequenceProps {
  ensg: string;
  ensp: Array<TranslatedSequence>;
}

function GeneAndTranslatedSequence(props: GeneAndTranslatedSequenceProps) {
  const {ensg, ensp} = props;
  const ensgUrl = getEnsemblIdUrl(ensg);

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
              return (
                <div key={index} className="transcript-item">
                  <ExtLink url={getEnsemblIdUrl(ensps.ensp)} text={ensps.ensp} />
                  <span className="transcript-id">
                    {ensps.ensts.split(',').map((enst, i) => (
                      <span key={enst}>{i > 0 && ','}<ExtLink url={getEnsemblIdUrl(enst)} text={enst} /></span>
                    ))}
                  </span>
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