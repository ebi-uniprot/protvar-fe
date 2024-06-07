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
  let options = <></>

  const clicked = () => {
    props.setSelected(props.alphaFoldData[0])
    props.pdbeRef.update(afSettings(alphaFoldUrl)).then(() =>
        props.pdbeRef.subscribeOnload(props.aaPos)
    );
  }

  let pocketsList: Array<JSX.Element> = [];
  let pocketsBtn: Array<JSX.Element> = [];

  props.pocketData.forEach((pocket, idx, array) => {
    const p = 'P' + pocket.pocketId
    const formattedPockets = 'Residues: ' + formatRange(pocket.resid)
    const highlightText = idx === 0 ? 'Highlight ' + p : p
    pocketsList.push(<span key={'pocketsList-'+pocket.pocketId} title={formattedPockets}>{p}{idx === array.length - 1 ? '' : ', '}</span>);
    pocketsBtn.push(<button key={'pocketsBtn-'+pocket.pocketId} title={formattedPockets} className="button-new" onClick={() => props.pdbeRef.highlightPocket(props.aaPos, pocket.resid)}>{highlightText}</button>)
  });

  if (isRowSelected) {
    options = <div className="small">
            <button className="button-new" onClick={() => props.pdbeRef.zoomToVariant(props.aaPos)}>Zoom to variant</button>
            {pocketsBtn}
            <button className="button-new" onClick={() => props.pdbeRef.resetDefault(props.aaPos)}>Reset</button>
          </div>
  }

  return <div>
    <div className="tableFixHead">
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
        </tbody>
      </table>
    </div>
    {options}
    {isRowSelected && <><br/><ModelConfidence /></>}
  </div>
}

export function ModelConfidence() {
    return (
        <div className="search-results-legends" style={{ float: "unset" }}>
            <strong>Model Confidence</strong>
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
          <br/>
          AlphaFold produces a per-residue confidence score (pLDDT) between 0 and 100. Some regions with
          low pLDDT may be unstructured in isolation.
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
                  The colour at position (x, y) indicates AlphaFold's expected position error at residue x, when the
                  predicted and true structures are aligned on residue y. This is useful for assessing inter-domain
                  accuracy.
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