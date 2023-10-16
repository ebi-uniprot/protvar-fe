import {ALPHAFOLD_URL_INTERFACE_BY_PROTEIN} from '../../../constants/ExternalUrls';
import {formatRange} from "../../../utills/Util";
import PdbeRef from "./PdbeRef";
import {AlphafoldResponseElement } from "../../../types/AlphafoldResponse";
import {baseSettings} from "./StructuralDetail";
import {Pocket} from "../../../types/FunctionalResponse";
import {ReactComponent as ExternalLinkIcon} from "../../../images/external-link.svg";

const afSettings = (alphaFoldUrl: string) => {
  return {...baseSettings,
    ...{customData: {
        url: alphaFoldUrl,
        format: "cif"
      },
      alphafoldView: true
    }}
}

interface AlphafoldInfoTableProps {
  isoFormAccession: string,
  alphaFoldData: Array<AlphafoldResponseElement>
  selectedAlphaFoldId: string,
  setSelected: any,
  aaPos: number
  pocketData: Array<Pocket>
  pdbeRef: PdbeRef
}
function AlphafoldInfoTable(props: AlphafoldInfoTableProps) {
  const alphaFoldId = props.alphaFoldData[0].entryId
  const alphaFoldUrl = props.alphaFoldData[0].cifUrl
  const isRowSelected = props.selectedAlphaFoldId === alphaFoldId;
  const rowClass = isRowSelected ? 'clickable-row active' : 'clickable-row';

  let pocketsList: Array<JSX.Element> = [];
  let pocketsBtn: Array<JSX.Element> = [];
  let pnum = 0;

  props.pocketData.forEach((pocket) => {
    pnum++
    const p = 'P' + pnum
    const formattedPockets = 'Residues: ' + formatRange(pocket.residList)
    const highlightText = pnum === 1 ? 'Highlight ' + p : p
    pocketsList.push(<span key={'pocketsList-'+pnum} title={formattedPockets}>{p}</span>);
    pocketsBtn.push(<button key={'pocketsBtn-'+pnum} title={formattedPockets} className="button-new" onClick={() => props.pdbeRef.highlightPocket(props.aaPos, pocket.residList)}>{highlightText}</button>)
  });

  const clicked = () => {
    props.setSelected(props.alphaFoldData[0])
    props.pdbeRef.update(afSettings(alphaFoldUrl)).then(() =>
        props.pdbeRef.subscribeOnload(props.aaPos)
    );
  }

  const options = isRowSelected ?
      <tr className="active" key={'options-'+alphaFoldId}>
        <td className="small" colSpan={3}>
          <button className="button-new" onClick={() => props.pdbeRef.zoomToVariant(props.aaPos)}>Zoom to variant</button>
          {pocketsBtn}
          <button className="button-new" onClick={() => props.pdbeRef.resetDefault(props.aaPos)}>Reset</button>
        </td>
      </tr>
      : <></>

  return <div>
    <table>
          <thead>
          <tr>
            <th colSpan={3}>AlphaFold Predicted Structure <a href={ALPHAFOLD_URL_INTERFACE_BY_PROTEIN + props.isoFormAccession} target="_blank" rel="noreferrer" title="Click for further information from AlphaFold"><ExternalLinkIcon width={12.5}/></a></th>
          </tr>
          <tr>
            <th>ID</th>
            <th>Position</th>
            <th>Pockets</th>
          </tr>
          </thead>
        <tbody key={alphaFoldId}>
          <tr className={rowClass} onClick={clicked}>
            <td className="small">{alphaFoldId}</td>
            <td className="small">{props.aaPos}</td>
            <td className="small"><>{props.pocketData.length === 0 ? '-' : pocketsList}</></td>
          </tr>
          {options}
        </tbody>
      </table>
    {isRowSelected && <ModelConfidence />}
  </div>
}

export function ModelConfidence() {
    return (
        <div className="search-results-legends" style={{ float: "unset" }}>
            <strong>Model Confidence</strong>
            <br/>
            <br/>
            <div className="flex-column">
                <div className="flex">
                    <div className="legend-icon button--legends button--legends--high"></div>
                    <div className="flex1">Very high (pLDDT &gt; 90)</div>
                </div>
                <div className="flex">
                    <div className="legend-icon button--legends button--legends--confident"></div>
                    <div className="flex1">Confident (90 &gt; pLDDT &gt; 70)</div>
                </div>
                <div className="flex">
                    <div className="legend-icon button--legends button--legends--low"></div>
                    <div className="flex1">Low (70 &gt; pLDDT &gt; 50)</div>
                </div>
                <div className="flex">
                    <div className="legend-icon button--legends button--legends--verylow"></div>
                    <div className="flex1">Very low (pLDDT &lt; 50)</div>
                </div>
            </div>
        </div>
    );
}

export function PAE(props: { paeImg: any; }) {
    return (
        <div style={{marginTop: '10px'}}>
            <strong>Predicted Align Error</strong>
            <br/>
            <br/>
            <div className="pae">
                <span className="pae-axis pae-y-axis">
                    Aligned residue
                </span>
                <img width="150px" height="150px" src={props.paeImg} alt="AlphaFold PAE"/>
                <div style={{paddingLeft: '15px'}}>
                    AlphaFold produces a per-residue confidence score (pLDDT) between 0 and 100. Some regions with
                    low pLDDT may be unstructured in isolation.
                    <br/>
                    The colour at position (x, y) indicates AlphaFold's expected position error at residue x, when
                    the predicted and true structures are aligned on residue y.
                    <br/>
                    This is useful for assessing inter-domain accuracy.
                </div>
                <div></div>
                <div className="pae-axis pae-x-axis">
                    Scored residue
                </div>
            </div>
        </div>
    );
}

export default AlphafoldInfoTable;