import React from "react";
import {ALPHAFOLD_URL_INTERFACE_BY_PROTEIN} from '../../../../constants/ExternalUrls';
import {formatRange} from "../../../../utills/Util";
import {PredictedStructure} from "../StructureData";
import {Pocket} from "../../../../types/Prediction";
import {PvStructureViewer} from "../viewer/PvStructureViewer";
import {useStructureUrl} from "../useStructureUrl";
import {ExtLink} from "../../common/Link";


interface PredictedStructureTableProps {
  isoFormAccession: string;
  predictedStructureData: PredictedStructure[];
  selectedPredictedStructure: string;
  setSelected: (item: PredictedStructure) => void;
  aaPos: number;
  pocketData: Pocket[];
  viewer: PvStructureViewer;
  urlParams: ReturnType<typeof useStructureUrl>;
}

function PredictedStructures({
  isoFormAccession,
  predictedStructureData,
  selectedPredictedStructure,
  setSelected,
  aaPos,
  pocketData,
  viewer,
  urlParams,
}: PredictedStructureTableProps) {
  const cards: Array<React.JSX.Element> = [];

  predictedStructureData.forEach(predStruc => {
    const rowId = predStruc.modelEntityId;
    const isSelected = selectedPredictedStructure === rowId;
    const isAlphaFill = predStruc.modelEntityId.startsWith("AlphaFill-");

    const displayId = predStruc.modelEntityId.replace("AlphaFill-", "");

    const pocketSpans = pocketData.length > 0
      ? pocketData.map((p, i) => (
          <React.Fragment key={p.pocketId}>
            {i > 0 && ', '}
            <span title={`Residues: ${formatRange(p.resid)}`}>P{p.pocketId}</span>
          </React.Fragment>
        ))
      : '–';

    cards.push(
      <div
        key={rowId}
        className={`predicted-structure-card${isSelected ? ' active' : ''}`}
        onClick={() => {
          setSelected(predStruc);
          urlParams.setStructure(isAlphaFill ? "alphafill" : "alphafold");
          urlParams.clearIncompatibleActions(isAlphaFill ? "alphafill" : "alphafold");
          viewer.loadAf(predStruc.cifUrl, aaPos);
        }}
      >
        <span className="predicted-card-name">
          <span className="predicted-card-type">{isAlphaFill ? 'AlphaFill' : 'AlphaFold'}</span>
          {' '}
          <span className="predicted-card-id">{displayId}</span>
          {isAlphaFill && <span className="predicted-card-note"> · ligands</span>}
        </span>
        <span className="predicted-card-pos">{aaPos}</span>
        <span className="predicted-card-pockets">{pocketSpans}</span>
      </div>
    );
  });

  return (
    <>
      <div className="structure-section-header">
        Predicted Structure based on AlphaFold{' '}
        <ExtLink url={ALPHAFOLD_URL_INTERFACE_BY_PROTEIN + isoFormAccession} />
      </div>
      <div className="structure-col-header predicted-col-header">
        <span></span>
        <span>Pos</span>
        <span>Pockets</span>
      </div>
      <div className="structure-rows-noscroll">
        {cards}
      </div>
    </>
  );
}

export default PredictedStructures;
