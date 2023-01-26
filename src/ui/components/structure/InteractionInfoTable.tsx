import {StructType} from './StructuralDetail';
import {P2PInteraction} from "../function/FunctionalDetail";
import {formatRange} from "../../../utills/Util";
import {API_URL} from "../../../constants/const";

interface InteractionInfoTableProps {
  isoFormAccession: string,
  interactionData: Array<P2PInteraction>,
  selectedInteraction: string,
  setSelected: any
}

function InteractionInfoTable(props: InteractionInfoTableProps) {

  return <>
    <table>
        <thead>
          <tr>
            <th colSpan={4}>Predicted Interacting Structure</th>
          </tr>
          <tr>
              <th>Pair</th>
              <th>Chain</th>
              <th>Residues</th>
          </tr>
        </thead>
        <tbody>{getInteractionInfoRows(props)}</tbody>
      </table>
  </>
}

function getInteractionInfoRows(props: InteractionInfoTableProps) {
  const rows: Array<JSX.Element> = [];
  props.interactionData.forEach((i) => {
    rows.push(getInteractionInfoRow(i, props.setSelected, props.selectedInteraction, props.isoFormAccession));
  })
  return rows;
}


function getInteractionInfoRow(i: P2PInteraction, tableRowClicked: any, clickedPdbId: string, accession: string) {
  const rowClass = clickedPdbId === (i.a+"_"+i.b) ? 'clickable-row active' : 'clickable-row';
  let chain = 'A'
  let pair = i.a
  let resids = i.aresidues

  if (accession === i.a) {
    chain = 'B';
    pair = i.b;
    resids = i.bresidues;
  }
  let formattedResids = formatRange(resids);
  let trimmedFormattedResids = formattedResids.substring(0, 12) + '...';
  let modelUrl = API_URL + '/interaction/'+i.a+'/'+i.b+'/model';

  return (
    <tr className={rowClass} onClick={(e) => tableRowClicked({type:StructType.CUSTOM, id: (i.a+"_"+i.b), url: modelUrl})} key={(i.a+"_"+i.b)}>
        <td className="small">{pair}</td>
        <td className="small">{chain}</td>
        <td className="small"><i title={formattedResids}>{trimmedFormattedResids}</i></td>
    </tr>
  );
}
export default InteractionInfoTable;