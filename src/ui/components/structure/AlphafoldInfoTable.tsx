import { ALPHAFOLD_URL_INTERFACE_BY_PROTEIN } from '../../../constants/ExternalUrls';
import {formatRange} from "../../../utills/Util";
import PdbeRef from "./PdbeRef";
import {AlphafoldResponseElement } from "../../../types/AlphafoldResponse";
import {baseSettings} from "./StructuralDetail";
import {Pocket} from "../../../types/FunctionalResponse";

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
  const paeImg = props.alphaFoldData[0].paeImageUrl;

  const id = isRowSelected ? <u onMouseOver={(_) => props.pdbeRef.clearSelect()}>{alphaFoldId}</u> : <>{alphaFoldId}</>
  const pos = isRowSelected ? <u onMouseOver={(_) => props.pdbeRef.selectPos(props.aaPos)}>{props.aaPos}</u> : <>{props.aaPos}</>
  const clicked = () => {
    props.pdbeRef.update(afSettings(alphaFoldUrl));
    props.setSelected(props.alphaFoldData[0])
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th colSpan={4}>Predicted Structure</th>
          </tr>
          <tr>
            <th>Source</th>
            <th>Identifier</th>
            <th>Position</th>
            <th>Pockets</th>
          </tr>
          <tr className={rowClass} onClick={clicked}>
            <td className="small">
              <a href={ALPHAFOLD_URL_INTERFACE_BY_PROTEIN + props.isoFormAccession} target="_blank" rel="noreferrer">
                <u>AlphaFold</u>
              </a>
            </td>
            <td className="small">{id}</td>
            <td className="small">{pos}</td>
            <td className="small"><Pockets {...props} /></td>
          </tr>
        </tbody>
      </table>
      {isRowSelected && <ModelConfidenceAndPAE paeImg={paeImg} />}
    </div>
  );
}


const Pockets = (props: AlphafoldInfoTableProps) => {
  if (props.pocketData.length === 0) return <>N/A</>;

  let pocketsList: Array<JSX.Element> = [];
  let counter = 0;
  const isRowSelected = props.selectedAlphaFoldId === props.alphaFoldData[0].entryId;

  props.pocketData.forEach((pocket) => {
    counter = counter + 1;
    const formattedPockets = formatRange(pocket.residList)
    const trimmedPockets = formattedPockets.substring(0, 12) + '...'
    const p = isRowSelected ? <u title={formattedPockets} onMouseOver={(e) => props.pdbeRef.selectPocket(pocket.residList)}>{trimmedPockets}</u> : <span title={formattedPockets}>{trimmedPockets}</span>
    pocketsList.push(<span key={'pocket-'+counter}>{p}</span>);
  });

  return <>{pocketsList}</>
}


function ModelConfidenceAndPAE(props: { paeImg: any; }) {
  return (
      <div className="search-results-legends small">
        <div>
          <strong>Model Confidence</strong>
          <br />
          <ul>
            <li>
              <span className="legend-icon button--legends button--legends--high" /> Very high (pLDDT &gt; 90)
            </li>
            <li>
              <span className="legend-icon button--legends button--legends--confident" /> Confident (90 &gt; pLDDT &gt; 70)
            </li>
            <li>
              <span className="legend-icon button--legends button--legends--low" /> Low (70 &gt; pLDDT &gt; 50)
            </li>
            <li>
              <span className="legend-icon button--legends button--legends--verylow" /> Very low (pLDDT &lt; 50)
            </li>
          </ul>
        </div>
        <div>
          <strong>Predicted Align Error</strong>
          <br />
          <div>
            <div className="pae-axis pae-y-axis">
              Aligned residue
            </div>
            <div className="pae-img">
              <img src={props.paeImg} alt="AlphaFold PAE" className={"pae-img-box-border "}/>
            </div>
          </div>
          <div className="pae-axis pae-x-axis">
            Scored residue
          </div>
        </div>

        <p>
          AlphaFold produces a per-residue confidence score (pLDDT) between 0 and 100. Some regions with
          low pLDDT may be unstructured in isolation.
        </p>

        <p>
          The colour at position (x, y) indicates AlphaFold's expected position error at residue x, when the predicted and true structures are aligned on residue y.
          <br/>
          This is useful for assessing inter-domain accuracy.
        </p>
      </div>
  );
}

export default AlphafoldInfoTable;