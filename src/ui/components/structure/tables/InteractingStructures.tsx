import {formatRange} from "../../../../utills/Util";
import {API_URL} from "../../../../constants/const";
import {HelpContent} from "../../help/HelpContent";
import {HelpButton} from "../../help/HelpButton";
import React from "react";
import {Interaction} from "../../../../types/Prediction";
import {useMolstarController} from "../useMolstarController";
import {useStructureUrl} from "../useStructureUrl";


interface InteractingStructureTableProps {
  isoFormAccession: string;
  interactionData: Interaction[];
  selectedInteraction: string;
  setSelected: (item: Interaction) => void;
  aaPos: number;
  molstar: ReturnType<typeof useMolstarController>;
  urlParams: ReturnType<typeof useStructureUrl>;
}

function InteractingStructureTable({
  isoFormAccession,
  interactionData,
  selectedInteraction,
  setSelected,
  aaPos,
  molstar,
  urlParams,
}: InteractingStructureTableProps) {
  const rows: Array<React.JSX.Element> = [];
  const count = interactionData.length;

  interactionData.sort((a, b) => b.pdockq - a.pdockq).forEach((i) => {
    const rowId = `${i.a}_${i.b}`;
    const isSelected = selectedInteraction === rowId;
    const protChain = i.a === isoFormAccession ? "A" : "B";
    const modelUrl = `${API_URL}/prediction/interaction/${i.a}/${i.b}/model`;

    rows.push(
      <div
        key={rowId}
        className={`predicted-interaction-card${isSelected ? ' active' : ''}`}
        onClick={() => {
          setSelected(i);
          urlParams.setStructure("interaction", rowId);
          urlParams.clearIncompatibleActions("interaction");
          molstar.loadInteraction(modelUrl, aaPos, protChain);
        }}
      >
        <span className="interaction-protein" title={`Residues: ${formatRange(i.aresidues)}`}>{i.a}</span>
        <span className="interaction-protein" title={`Residues: ${formatRange(i.bresidues)}`}>{i.b}</span>
        <span className="interaction-pdockq">{i.pdockq.toFixed(3)}</span>
      </div>
    );
  });

  return (
    <>
      <div className="structure-section-header">
        Predicted Interacting Structure
        <span className="count-badge">{count}</span>
        <HelpButton variant="inline" title="" content={<HelpContent name="predictions" />} />
      </div>
      <div className="structure-col-header interaction-col-header">
        <span>Chain A</span>
        <span>Chain B</span>
        <span>pDockQ</span>
      </div>
      <div className="structure-rows-scroll">
        {rows}
      </div>
    </>
  );
}

export default InteractingStructureTable;
