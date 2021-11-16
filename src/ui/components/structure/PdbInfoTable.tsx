import { StringVoidFun } from '../../../constants/CommonTypes';
import { PDB_URL_INTERFACE_BY_ID, PDB_URL_INTERFACE_BY_PROTEIN } from '../../../constants/ExternalUrls';
import { ProteinStructureElement } from './StructuralDetail';
import { ReactComponent as ExternalLinkIcon } from "../../../images/external-link.svg"

interface PdbInfoTableProps {
  isoFormAccession: string,
  change3dDiagram: StringVoidFun,
  pdbApiData: Array<ProteinStructureElement>,
  selectedPdbId: string
}

function PdbInfoTable(props: PdbInfoTableProps) {

  return <>
    <div className="tableFixHead">
      <a href={PDB_URL_INTERFACE_BY_PROTEIN + props.isoFormAccession}>More information <ExternalLinkIcon width={12.5}/></a>
      <table>
        <thead>
          <tr>
            <th colSpan={6}>Experimental Structure</th>
          </tr>
          <tr>
            <th>pdb id</th>
            <th>chain</th>
            <th>PDB Pos</th>
            <th>resolution</th>
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
    copyPdbEntry.chain_id = value.chains.sort().join()
    rows.push(getPdbInfoRow(copyPdbEntry, props.change3dDiagram, props.selectedPdbId));
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

function getPdbInfoRow(str: ProteinStructureElement, tableRowClicked: StringVoidFun, clickedPdbId: string) {
  const rowClass = clickedPdbId === str.pdb_id ? 'clickable-row active' : 'clickable-row';
  return (
    <tr className={rowClass} onClick={(e) => tableRowClicked(str.pdb_id)} key={str.pdb_id}>
      <td className="small">
        <a href={PDB_URL_INTERFACE_BY_ID + str.pdb_id} target="_blank" rel="noreferrer">
          <u>{str.pdb_id}</u>
        </a>
      </td>
      <td className="small">{str.chain_id}</td>
      <td className="small">
        {str.start}
      </td>
      <td className="small">{str.resolution}</td>
      <td className="small">{str.experimental_method}</td>
    </tr>
  );
}
export default PdbInfoTable;