import { PDB_URL_INTERFACE_BY_PROTEIN } from '../../../constants/ExternalUrls';
import {baseSettings} from './StructuralDetail';
import { ReactComponent as ExternalLinkIcon } from "../../../images/external-link.svg"
import PdbeRef from "./PdbeRef";
import {ProteinStructureElement} from "../../../types/ProteinStructureResponse";

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
  return <>
    <div className="tableFixHead">
      <a href={PDB_URL_INTERFACE_BY_PROTEIN + props.isoFormAccession}>Further information from PDBeKB <ExternalLinkIcon width={12.5}/></a>
      <table>
        <thead>
          <tr>
            <th colSpan={5}>Experimental Structure - PDBe</th>
          </tr>
          <tr>
            <th>PDB ID</th>
            <th>Chain</th>
            <th>PDB pos.</th>
            <th>Resolution (Å)</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>{getPdbInfoRows(props)}</tbody>
      </table>
    </div>
  </>
}

function getPdbInfoRows(props: PdbInfoTableProps) {
  const rows: Array<JSX.Element> = [];
  const pdbMap = combineChainsByPdbId(props.pdbApiData)
  pdbMap.forEach((value) => {
    const copyPdbEntry = {...value.pdbEntry}
    copyPdbEntry.chain_id = value.chains.sort().join(',')
    rows.push(getPdbInfoRow(copyPdbEntry, props));
  })
  return rows;
}

function combineChainsByPdbId(pdbApiData: Array<ProteinStructureElement>) {
  const chainsMap = new Map<string, { chains: Array<string>, pdbEntry: ProteinStructureElement }>();

  pdbApiData.forEach((pdbEntry) => {
    let pdbId = pdbEntry.pdb_id;
    if (chainsMap.get(pdbId)) {
      chainsMap.get(pdbId)?.chains.push(pdbEntry.chain_id)
    }
    else {
      const chains = new Array<string>(pdbEntry.chain_id)
      chainsMap.set(pdbId, { chains, pdbEntry })
    }
  });

  return chainsMap;
}


function getPdbInfoRow(str: ProteinStructureElement, props: PdbInfoTableProps) {
  const isRowSelected = props.selectedPdbId === str.pdb_id
  const rowClass = isRowSelected ? 'clickable-row active' : 'clickable-row';
  const id = isRowSelected ? <u onMouseOver={(_) => props.pdbeRef.clearSelect()}>{str.pdb_id}</u> : <>{str.pdb_id}</>
  const pos = isRowSelected ? <u onMouseOver={(_) => props.pdbeRef.selectPos(str.start)}>{str.start}</u> : <>{str.start}</>

  const chain = str.chain_id.split(',').map(c => {
    const k = id+'chain-'+c
    return isRowSelected ? <u key={k} onMouseOut={(_) => props.pdbeRef.clearSelect()} onMouseOver={(_) => props.pdbeRef.selectChain(c)}>{c}</u> : <span key={k}>{c}</span>
  })

  const clicked = () => {
    props.pdbeRef.update(pdbSettings(str.pdb_id));
    props.setSelected(str)
  }

  return (
    <tr className={rowClass} onClick={clicked} key={str.pdb_id}>
      <td className="small">{id}</td>
      <td className="small">{chain}</td>
      <td className="small">{pos}</td>
      <td className="small">{str.resolution}</td>
      <td className="small">{str.experimental_method}</td>
    </tr>
  );
}
export default PdbInfoTable;