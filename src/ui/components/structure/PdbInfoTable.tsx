import { PDB_URL_INTERFACE_BY_PROTEIN } from '../../../constants/ExternalUrls';
import {baseSettings} from './StructuralDetail';
import { ReactComponent as ExternalLinkIcon } from "../../../images/external-link.svg"
import PdbeRef from "./PdbeRef";
import {ProteinStructureElement} from "../../../types/ProteinStructureResponse";
import { groupBy } from "../../../utills/Util";

const pdbSettings = (molId: string) => {
  return {...baseSettings,
    ...{
      moleculeId: molId
    },
    alphafoldView: false
  }
}

interface PdbInfoTableProps {
  isoFormAccession: string,
  pdbApiData: Array<ProteinStructureElement>,
  selectedPdbId: string,
  setSelected: any,
  pdbeRef: PdbeRef
}

function PdbInfoTable(props: PdbInfoTableProps) {
  return <div className="tableFixHead">
      <table>
        <thead>
          <tr>
            <th colSpan={5}>PDBe Experimental Structure <a href={PDB_URL_INTERFACE_BY_PROTEIN + props.isoFormAccession} target="_blank" rel="noreferrer" title="Click for further information from PDBeKB"><ExternalLinkIcon width={12.5}/></a></th>
          </tr>
          <tr>
            <th>PDB ID</th>
            <th>Chain</th>
            <th>PDB pos.</th>
            <th>Resolution (Å)</th>
            <th>Method</th>
          </tr>
        </thead>
        {getPdbInfoRows(props)}
      </table>
    </div>
}

function getPdbInfoRows(props: PdbInfoTableProps) {
  const rows: Array<JSX.Element> = [];
  const pdbeGroups = groupBy(props.pdbApiData, "pdb_id")

  for (let groupId in pdbeGroups) {
    let chainGroup = pdbeGroups[groupId];
    chainGroup.sort((a,b) => a.chain_id.localeCompare(b.chain_id))
   rows.push(getPdbInfoRow(groupId, chainGroup, props));
  }
  return rows;
}

const getPdbInfoRow = (id: string, chainGroup:ProteinStructureElement[], props: PdbInfoTableProps) => {
  const isRowSelected = props.selectedPdbId === id
  const rowClass = isRowSelected ? 'clickable-row active' : 'clickable-row';
  const chains = chainGroup.map(c => c.chain_id).join(", ")
  const firstChain = chainGroup[0]

  const tooltip = chainGroup.map(c => c.pdb_id + '\t' + c.chain_id + '\t' + c.start + '\t' + c.resolution + '\t' + c.experimental_method).join('\n')

  let chainNum = 0;
  const highlightChainBtn = chainGroup.map(c => {
    const k = 'highlightBtn-'+id+'-'+c.chain_id
    chainNum++
    let highlightText = chainNum === 1 ? 'Highlight chain ' + c.chain_id : c.chain_id
    return <button key={k} className="button-new" onClick={() => props.pdbeRef.highlightChain(c.start, c.chain_id)}>{highlightText}</button>
  })

  const clicked = () => {
    props.setSelected(firstChain)
    props.pdbeRef.update(pdbSettings(id)).then(() =>
        props.pdbeRef.subscribeOnload(firstChain.start, firstChain.chain_id)
    );
  }

  const options = isRowSelected ?
      <tr className="active" key={'options-'+id}>
        <td className="small" colSpan={5}>
          <button className="button-new" onClick={() => props.pdbeRef.zoomToVariant(firstChain.start, firstChain.chain_id)}>Zoom to variant</button>
          {highlightChainBtn}
          <button className="button-new" onClick={() => props.pdbeRef.resetDefault(firstChain.start, firstChain.chain_id)}>Reset</button>
        </td>
      </tr>
      : <></>

  return (
      <tbody key={id} >
      <tr className={rowClass} title={tooltip} onClick={clicked}>
        <td className="small">{id}</td>
        <td className="small">{chains}</td>
        <td className="small">{firstChain.start}</td>
        <td className="small">{firstChain.resolution}</td>
        <td className="small">{firstChain.experimental_method}</td>
      </tr>
      {options}
      </tbody>
  );
}

export default PdbInfoTable;