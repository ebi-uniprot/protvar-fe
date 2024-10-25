import React from "react";
import {ALPHAFOLD_URL_INTERFACE_BY_PROTEIN} from '../../../constants/ExternalUrls';
import {formatRange} from "../../../utills/Util";
import PdbeRef from "./PdbeRef";
import {baseSettings, PredictedStructure} from "./StructuralDetail";
import {Pocket} from "../../../types/FunctionalResponse";
import {HelpButton} from "../help/HelpButton";
import {AFLegendShortText, AlphaFoldHelp} from "../help/content/AlphaFoldHelp";
import {PAEImg} from "./PAEImg";
import {HelpContent} from "../help/HelpContent";

const afSettings = (url: string) => {
  return {
    ...baseSettings,
    ...{
      customData: {
        url: url,
        format: "cif"
      },
      alphafoldView: true
    }
  }
}

interface PredictedStructureTableProps {
  isoFormAccession: string,
  predictedStructureData: Array<PredictedStructure>
  selectedPredictedStructure: string,
  setSelected: any,
  aaPos: number
  pocketData: Array<Pocket>
  pdbeRef: PdbeRef
}

function PredictedStructureTable(props: PredictedStructureTableProps) {
  const rows: Array<JSX.Element> = [];
  let options = <></>
  let modelConfAndPAE: JSX.Element | null = null

  props.predictedStructureData.forEach(predStruc => {

    const rowId = predStruc.entryId
    const isRowSelected = props.selectedPredictedStructure === rowId;
    const rowClass = isRowSelected ? 'clickable-row active' : 'clickable-row';

    const clicked = () => {
      props.setSelected(predStruc)
      props.pdbeRef.update(afSettings(predStruc.cifUrl)).then(() =>
        props.pdbeRef.subscribeOnload(props.aaPos)
      );
    }

    let pocketsList: Array<JSX.Element> = [];
    let pocketsBtn: Array<JSX.Element> = [];

    props.pocketData.forEach((pocket, idx, array) => {
      const p = 'P' + pocket.pocketId
      const formattedPockets = 'Residues: ' + formatRange(pocket.resid)
      const highlightText = idx === 0 ? 'Highlight ' + p : p
      pocketsList.push(<span key={'pocketsList-' + pocket.pocketId}
                             title={formattedPockets}>{p}{idx === array.length - 1 ? '' : ', '}</span>);
      pocketsBtn.push(<button key={'pocketsBtn-' + pocket.pocketId} title={formattedPockets} className="button-new"
                              onClick={() => props.pdbeRef.highlightPocket(props.aaPos, pocket.resid)}>{highlightText}</button>)
    });

    const row = <tr className={rowClass} onClick={clicked} key={predStruc.entryId}>
      <td className="small">{predStruc.entryId}</td>
      <td className="small">{props.aaPos}</td>
      <td className="small">{props.pocketData.length === 0 ? '-' : pocketsList}</td>
    </tr>

    // set PAE to first AF model in array
    if (!modelConfAndPAE && "paeImageUrl" in predStruc) {
      modelConfAndPAE = <ModelConfAndPAE paeImg={predStruc.paeImageUrl}/>
    }

    if (isRowSelected) {
      options = <>
        <div className="small">
          <button className="button-new" onClick={() => props.pdbeRef.zoomToVariant(props.aaPos)}>Zoom to variant
          </button>
          {pocketsBtn}
          <button className="button-new" onClick={() => props.pdbeRef.resetDefault(props.aaPos)}>Reset</button>
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
            href={ALPHAFOLD_URL_INTERFACE_BY_PROTEIN + props.isoFormAccession} target="_blank" rel="noreferrer"
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