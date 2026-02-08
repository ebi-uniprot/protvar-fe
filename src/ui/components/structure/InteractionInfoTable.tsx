import {formatRange} from "../../../utills/Util";
import {API_URL} from "../../../constants/const";
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import React from "react";
import {Interaction} from "../../../types/Prediction";
import {useMolstarController} from "./useMolstarController";
import {useStructureUrl} from "./useStructureUrl";


interface InteractionInfoTableProps {
  isoFormAccession: string;
  interactionData: Interaction[];
  selectedInteraction: string;
  setSelected: (item: Interaction) => void;
  aaPos: number;
  molstar: ReturnType<typeof useMolstarController>;
  urlParams: ReturnType<typeof useStructureUrl>;
}

function InteractionInfoTable({
                                isoFormAccession,
                                interactionData,
                                selectedInteraction,
                                setSelected,
                                aaPos,
                                molstar,
                                urlParams,
                              }: InteractionInfoTableProps) {
  const rows: Array<React.JSX.Element> = [];
  let options = <></>

  interactionData.sort((a, b) => b.pdockq - a.pdockq).forEach((i) => {
    const rowId = `${i.a}_${i.b}`;
    const isSelected = selectedInteraction === rowId
    const protChain = i.a === isoFormAccession ? "A" : "B";
    const modelUrl = `${API_URL}/prediction/interaction/${i.a}/${i.b}/model`;

    const row = <tr key={rowId} className={isSelected ? "clickable-row active" : "clickable-row"}
                    onClick={() => {
                      setSelected(i);
                      urlParams.setStructure("int", rowId);
                      urlParams.clearIncompatibleActions("int");
                      molstar.loadInteraction(modelUrl, aaPos, protChain);
                    }}>
      <td className="small" title={`Residues: ${formatRange(i.aresidues)}`}>{i.a}</td>
      <td className="small" title={`Residues: ${formatRange(i.bresidues)}`}>{i.b}</td>
      <td className="small">{i.pdockq.toFixed(3)}</td>
    </tr>

    if (isSelected) {
      options = <div className="small">
        <button className="button-new" onClick={() => {
          urlParams.updateActions({ zoom: true, interface: null });
          molstar.zoomToVariant(aaPos, protChain);
        }}>Zoom to variant</button>
        <button className="button-new" onClick={() => {
          urlParams.updateActions({ interface: true, zoom: null });
          molstar.highlightInterface(i.aresidues, i.bresidues, aaPos, protChain);
        }}>Highlight Interface</button>
        <button className="button-new" onClick={() => {
          urlParams.updateActions({ interface: null, zoom: null });
          molstar.resetDefault(aaPos, protChain);
        }}>Reset</button>
      </div>
    }

    rows.push(row);
  })

  return <div>
    <div className="tableFixHead">
      <table>
        <thead>
        <tr>
          <th colSpan={3}>Predicted Interacting Structure <HelpButton title="" content={<HelpContent name="predictions" />} /></th>
        </tr>
        <tr>
          <th>Chain A</th>
          <th>Chain B</th>
          <th>pDockQ</th>
        </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
    {options}
  </div>
}

export default InteractionInfoTable;