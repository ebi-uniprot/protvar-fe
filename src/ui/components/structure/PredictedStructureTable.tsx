import React from "react";
import {ALPHAFOLD_URL_INTERFACE_BY_PROTEIN} from '../../../constants/ExternalUrls';
import {formatRange} from "../../../utills/Util";
import {PredictedStructure} from "./StructuralDetail";
import {HelpButton} from "../help/HelpButton";
import {AFLegendShortText, AlphaFoldHelp} from "../help/content/AlphaFoldHelp";
import {PAEImg} from "./PAEImg";
import {HelpContent} from "../help/HelpContent";
import {Pocket} from "../../../types/Prediction";
import {useMolstarController} from "./useMolstarController";
import {useStructureUrl} from "./useStructureUrl";


interface PredictedStructureTableProps {
  isoFormAccession: string;
  predictedStructureData: PredictedStructure[];
  selectedPredictedStructure: string;
  setSelected: (item: PredictedStructure) => void;
  aaPos: number;
  pocketData: Pocket[];
  molstar: ReturnType<typeof useMolstarController>;
  urlParams: ReturnType<typeof useStructureUrl>;
}

function PredictedStructureTable({
                                   isoFormAccession,
                                   predictedStructureData,
                                   selectedPredictedStructure,
                                   setSelected,
                                   aaPos,
                                   pocketData,
                                   molstar,
                                   urlParams,
                                 }: PredictedStructureTableProps) {
  const rows: Array<React.JSX.Element> = [];
  let options = <></>
  let modelConfAndPAE: React.JSX.Element | null = null

  predictedStructureData.forEach(predStruc => {

    const rowId = predStruc.modelEntityId
    const isSelected = selectedPredictedStructure === rowId;

    const clicked = () => {
      setSelected(predStruc);
      const isAlphaFill = predStruc.modelEntityId.startsWith("AlphaFill-");
      urlParams.setStructure("prediction", isAlphaFill ? "AlphaFill" : "AlphaFold");
      urlParams.clearIncompatibleActions("prediction");
      molstar.loadAf(predStruc.cifUrl, aaPos);
    }

    let pocketsList: Array<React.JSX.Element> = [];
    let pocketsBtn: Array<React.JSX.Element> = [];

    pocketData.forEach((pocket, idx, array) => {
      const p = 'P' + pocket.pocketId
      const formattedPockets = 'Residues: ' + formatRange(pocket.resid)
      const highlightText = idx === 0 ? 'Highlight ' + p : p
      pocketsList.push(<span key={`pocketsList-${pocket.pocketId}`}
                             title={formattedPockets}>{p}{idx === array.length - 1 ? '' : ', '}</span>);
      pocketsBtn.push(<button key={`pocketsBtn-${pocket.pocketId}`}
                              title={formattedPockets} className="button-new"
                              onClick={() => {
                                urlParams.updateActions({ pocket: `p${pocket.pocketId}`, zoom: null });
                                molstar.highlightPocket(aaPos, pocket.resid);
                              }}>{highlightText}</button>)
    });

    const row = <tr key={rowId} className={isSelected ? "clickable-row active" : "clickable-row"} onClick={clicked}>
      <td className="small">{rowId}</td>
      <td className="small">{aaPos}</td>
      <td className="small">{pocketData.length === 0 ? "-" : pocketsList}</td>
    </tr>

    // set PAE to first AF model in array
    if (!modelConfAndPAE && "paeImageUrl" in predStruc) {
      modelConfAndPAE = <ModelConfAndPAE paeImg={predStruc.paeImageUrl}/>
    }

    if (isSelected) {
      options = <>
        <div className="small">
          <button className="button-new" onClick={() => {
            urlParams.updateActions({ zoom: true, pocket: null });
            molstar.zoomToVariant(aaPos);
          }}>Zoom to variant</button>
          {pocketsBtn}
          <button className="button-new" onClick={() => {
            urlParams.updateActions({ pocket: null, zoom: null });
            molstar.resetDefault(aaPos);
          }}>Reset</button>
        </div>
        {modelConfAndPAE}
      </>
    }
    rows.push(row);
  })

  return <div>
    <div className="tableFixHead">
      <table>
        <thead>
        <tr>
          <th colSpan={3}>Predicted Structure based on AlphaFold <a
            href={ALPHAFOLD_URL_INTERFACE_BY_PROTEIN + isoFormAccession} target="_blank" rel="noreferrer"
            title="Click for further information from AlphaFold" className="ext-link"></a>
          </th>
        </tr>
        <tr>
          <th>ID</th>
          <th>Position</th>
          <th>Pockets <HelpButton title="" content={<HelpContent name="predictions" />} /></th>
        </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
    {options}
  </div>
}

const ModelConfAndPAE = (props: { paeImg: string }) => {
  return <div style={{marginTop: '15px'}}>

    <div style={{display: 'grid', gridTemplateColumns: 'auto auto', padding: '5px', fontSize: '0.9em'}}>
      <div><strong>Model Confidence</strong>
        <AFLegendShortText/>
      </div>
      <div style={{marginBottom: '20px'}}><strong>Predicted Align Error</strong><HelpButton title=""
                                                                                            content={<AlphaFoldHelp/>}/>
        <PAEImg imageSrc={props.paeImg}/>
      </div>
    </div>
  </div>
}

export default PredictedStructureTable;