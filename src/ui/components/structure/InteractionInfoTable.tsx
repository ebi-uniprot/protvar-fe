import {baseSettings} from './StructuralDetail';
import {formatRange} from "../../../utills/Util";
import {API_URL} from "../../../constants/const";
import PdbeRef from "./PdbeRef";
import {P2PInteraction} from "../../../types/FunctionalResponse";
import {ReactComponent as ExternalLinkIcon} from "../../../images/external-link.svg";

const customSettings = (customUrl: string) => {
    return {...baseSettings,
        ...{customData: {
                url: customUrl,
                format: "pdb"
            }
        },
        alphafoldView: false
    }
}

interface InteractionInfoTableProps {
  isoFormAccession: string,
  interactionData: Array<P2PInteraction>
  selectedInteraction: string
  setSelected: any
  aaPos: number
  pdbeRef: PdbeRef
}

function InteractionInfoTable(props: InteractionInfoTableProps) {
  const rows: Array<JSX.Element> = [];
  let options = <></>

  props.interactionData.sort((a, b) => b.pdockq - a.pdockq).forEach((i) => {
    const rowId = i.a+"_"+i.b
    const isRowSelected = props.selectedInteraction === rowId
    const rowClass = isRowSelected ? 'clickable-row active' : 'clickable-row';
    const protChain = i.a === props.isoFormAccession ? 'A' : 'B';

    const aResids = 'Residues: ' + formatRange(i.aresidues);
    const bResids = 'Residues: ' + formatRange(i.bresidues);
    const modelUrl = API_URL + '/interaction/'+i.a+'/'+i.b+'/model';

    const clicked = () => {
      props.setSelected(i)
      props.pdbeRef.update(customSettings(modelUrl)).then(() =>
        props.pdbeRef.subscribeOnload(props.aaPos, protChain)
      );
    }

    const row = <tr className={rowClass} onClick={clicked} key={(i.a+"_"+i.b)}>
      <td className="small" title={aResids}>{i.a}</td>
      <td className="small" title={bResids}>{i.b}</td>
      <td className="small">{i.pdockq.toFixed(3)}</td>
    </tr>

    if (isRowSelected) {
      const highlightInterface = async () => {
        await props.pdbeRef.highlightInterface(i.aresidues, i.bresidues, props.aaPos, protChain)
      }

      options = <div className="small">
        <button className="button-new" onClick={() => props.pdbeRef.zoomToVariant(props.aaPos, protChain)}>Zoom to variant</button>
        <button className="button-new" onClick={highlightInterface}>Highlight Interface</button>
        <button className="button-new" onClick={() => props.pdbeRef.resetDefault(props.aaPos, protChain)}>Reset</button>
      </div>
    }

    rows.push(row);
  })

  return <div>
    <div className="tableFixHead">
      <table>
        <thead>
          <tr>
            <th colSpan={3}>Predicted Interacting Structure <a href="https://pubmed.ncbi.nlm.nih.gov/36690744" target="_blank" rel="noreferrer"><ExternalLinkIcon width={12.5}/></a></th>
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