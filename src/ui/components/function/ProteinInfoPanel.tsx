import Evidences from "../common/Evidences";
import ProteinInformationRegions from "./region/ProteinInformationRegions";
import {FunctionalInfo, Gene} from "../../../types/FunctionalInfo";
import {Comment, CommentType} from "../../../types/Comment";
import {Evidence} from "../../../types/Common";
import {ExpandableText} from "../common/ExpandableText";
import React from "react";

interface ProteinInfoPanelProps {
  functionalData: FunctionalInfo;
  groupedComments: Map<string, Array<Comment>>;
}

function ProteinInfoPanel(props: ProteinInfoPanelProps) {
  const { functionalData, groupedComments } = props;
  const functionComments = groupedComments.get(CommentType.FUNCTION) ?? [];
  const hasFunction = functionComments && functionComments.length > 0;

  return (
    <div className="protein-info-panel">
      <div className="section-title">Protein Information from UniProt</div>

      {/* Protein Function */}
      <div className="protein-function-section">
        <h4>General Function</h4>
        {!hasFunction ? (
          <p className="no-data">No protein function information available</p>
        ) : (
          functionComments.map((comment, index) => {
            let functionText = '';
            let evidences: Evidence[] = [];
            if ('text' in comment && Array.isArray(comment.text)) {
              functionText = comment.text[0].value;
              evidences = comment.text[0].evidences ?? [];
            }
            return (
              <div key={index} className="function-entry">
                <ExpandableText text={functionText} />
                {evidences.length > 0 && (
                  <Evidences evidences={evidences} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Protein Details Grid */}
      <div className="protein-details-grid">
        <div className="protein-basic-info">
          <h4>Basic Information</h4>
          <div className="info-list">
            {functionalData.name && (
              <div className="info-row">
                <span className="info-label">Recommended name</span>
                <span className="info-value">{functionalData.name}</span>
              </div>
            )}
            {functionalData.alternativeNames && (
              <div className="info-row">
                <span className="info-label">Alternative name</span>
                <span className="info-value">{functionalData.alternativeNames}</span>
              </div>
            )}
            {displayGeneInfo(functionalData.gene)}
            {functionalData.entryId && (
              <div className="info-row">
                <span className="info-label">UniProtKB entry</span>
                <span className="info-value">{functionalData.entryId}</span>
              </div>
            )}
            {functionalData.proteinExistence && (
              <div className="info-row">
                <span className="info-label">Protein evidence</span>
                <span className="info-value">{functionalData.proteinExistence}</span>
              </div>
            )}
            {functionalData.lastUpdated && (
              <div className="info-row">
                <span className="info-label">Last updated</span>
                <span className="info-value">{functionalData.lastUpdated}</span>
              </div>
            )}
            {functionalData.sequence.modified && (
              <div className="info-row">
                <span className="info-label">Sequence modified</span>
                <span className="info-value">{functionalData.sequence.modified}</span>
              </div>
            )}
            {functionalData.sequence.length && (
              <div className="info-row">
                <span className="info-label">Sequence length</span>
                <span className="info-value">{functionalData.sequence.length} aa</span>
              </div>
            )}
          </div>
        </div>

        <div className="protein-detailed-info">
          <h4>Detailed Information</h4>
          <ProteinInformationRegions
            groupedComments={groupedComments}
            accession={functionalData.accession}
          />
        </div>
      </div>
    </div>
  );
}

function displayGeneInfo(genes: Array<Gene>) {
  if (!genes || genes.length === 0) {
    return null;
  }

  return genes.map((gene, index) => (
    <React.Fragment key={index}>
      <div className="info-row">
        <span className="info-label">Gene name</span>
        <span className="info-value">{gene.name.value}</span>
      </div>
      {gene.synonyms && gene.synonyms.length > 0 && (
        <div className="info-row">
          <span className="info-label">Synonyms</span>
          <span className="info-value">{gene.synonyms.map(s => s.value).join(', ')}</span>
        </div>
      )}
    </React.Fragment>
  ));
}

export default ProteinInfoPanel;