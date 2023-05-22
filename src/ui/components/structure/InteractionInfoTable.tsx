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
  interactionData: Array<P2PInteraction>,
  selectedInteraction: string,
  setSelected: any
  pdbeRef: PdbeRef
}

function InteractionInfoTable(props: InteractionInfoTableProps) {

  return <>
    <table>
        <thead>
          <tr>
            <th colSpan={5}>Predicted Interacting Structure <a href="https://pubmed.ncbi.nlm.nih.gov/36690744" target="_blank" rel="noreferrer"><ExternalLinkIcon width={12.5}/></a></th>
          </tr>
          <tr>
              <th>A</th>
              <th>Residues</th>
              <th>B</th>
              <th>Residues</th>
              <th>pDockQ</th>
          </tr>
        </thead>
        <tbody>{getInteractionInfoRows(props)}</tbody>
      </table>
  </>
}

function getInteractionInfoRows(props: InteractionInfoTableProps) {
  const rows: Array<JSX.Element> = [];
  props.interactionData.sort((a, b) => b.pdockq - a.pdockq).forEach((i) => {
    rows.push(getInteractionInfoRow(i, props));
  })
  return rows;
}


function getInteractionInfoRow(i: P2PInteraction, props: InteractionInfoTableProps) {
  const isRowSelected = props.selectedInteraction === (i.a+"_"+i.b)
  const rowClass = isRowSelected ? 'clickable-row active' : 'clickable-row';

  const ia = isRowSelected ? <u onMouseOut={(_) => props.pdbeRef.clearSelect()} onMouseOver={(_) => props.pdbeRef.selectChain('A')}>{i.a}</u> : <>{i.a}</>
  const ib = isRowSelected ? <u onMouseOut={(_) => props.pdbeRef.clearSelect()} onMouseOver={(_) => props.pdbeRef.selectChain('B')}>{i.b}</u> : <>{i.b}</>
  const formattedAResids = formatRange(i.aresidues);
  const formattedBResids = formatRange(i.bresidues);
  const trimmedAResids = formattedAResids.substring(0, 12) + '...';
  const trimmedBResids = formattedBResids.substring(0, 12) + '...';
  const aResids = isRowSelected ? <u onMouseOver={(_) => props.pdbeRef.highlightResids(i.aresidues, 'A')}>{trimmedAResids}</u> : <>{trimmedAResids}</>
  const bResids = isRowSelected ? <u onMouseOver={(_) => props.pdbeRef.highlightResids(i.bresidues, 'B')}>{trimmedBResids}</u> : <>{trimmedBResids}</>
  const modelUrl = API_URL + '/interaction/'+i.a+'/'+i.b+'/model';

  const clicked = () => {
    props.pdbeRef.update(customSettings(modelUrl));
    props.setSelected(i)
  }

  return (
    <tr className={rowClass} onClick={clicked} key={(i.a+"_"+i.b)}>
        <td className="small">{ia}</td>
        <td className="small" title={formattedAResids}>{aResids}</td>
        <td className="small">{ib}</td>
        <td className="small" title={formattedBResids}>{bResids}</td>
        <td className="small">{i.pdockq.toFixed(3)}</td>
    </tr>
  );
}
export default InteractionInfoTable;