import { PDB_URL_INTERFACE_BY_PROTEIN } from '../../../constants/ExternalUrls';
import {baseSettings} from './StructuralDetail';
import PdbeRef from "./PdbeRef";
import {PdbeStructure} from "../../../types/PdbeStructure";
import { groupBy } from "../../../utills/Util";

const pdbSettings = (molId: string) => {
  return {...baseSettings,
    ...{
      moleculeId: molId
    },
    //alphafoldView: false
  }
}

interface PdbeStructureTableProps {
  isoFormAccession: string,
  pdbeData: Array<PdbeStructure>,
  selectedPdbId: string,
  setSelected: any,
  pdbeRef: PdbeRef
}

function PdbeStructureTable(props: PdbeStructureTableProps) {
  const rows: Array<JSX.Element> = [];
  const pdbeGroups = groupBy(props.pdbeData, "pdbId")
  let options = <></>

  for (let id in pdbeGroups) {
    let chainGroup = pdbeGroups[id].sort((a,b) => a.chainId.localeCompare(b.chainId));
    const isRowSelected = props.selectedPdbId === id
    const rowClass = isRowSelected ? 'clickable-row active' : 'clickable-row';
    const chains = chainGroup.map(c => c.chainId).join(", ")
    const firstChain = chainGroup[0]

    const tooltip = chainGroup.map(c => c.pdbId + '\t' + c.chainId + '\t' + c.start + '\t' + c.resolution + '\t' + c.experimentalMethod).join('\n')

    const clicked = () => {
      props.setSelected(firstChain)
      props.pdbeRef.update(pdbSettings(id)).then(() =>
          props.pdbeRef.subscribeOnload(firstChain.start, firstChain.chainId)
      );
    }

    const row = <tr key={id} className={rowClass} title={tooltip} onClick={clicked}>
      <td className="small">{id}</td>
      <td className="small">{chains}</td>
      <td className="small">{firstChain.start}</td>
      <td className="small">{firstChain.resolution}</td>
      <td className="small">{firstChain.experimentalMethod}</td>
    </tr>

    if (isRowSelected) {
      let chainNum = 0;
      const highlightChainBtn = chainGroup.map(c => {
        const k = 'highlightBtn-'+id+'-'+c.chainId
        chainNum++
        let highlightText = chainNum === 1 ? 'Highlight chain ' + c.chainId : c.chainId
        return <button key={k} className="button-new" onClick={() => props.pdbeRef.highlightChain(c.start, c.chainId)}>{highlightText}</button>
      })

      options = <div className="small">
          <button className="button-new" onClick={() => props.pdbeRef.zoomToVariant(firstChain.start, firstChain.chainId)}>Zoom to variant</button>
          {highlightChainBtn}
          <button className="button-new" onClick={() => props.pdbeRef.resetDefault(firstChain.start, firstChain.chainId)}>Reset</button>
      </div>
    }

    rows.push(row);
  }

  return <div>
    <div className="tableFixHead">
      <table>
        <thead>
          <tr>
            <th colSpan={5}>PDBe Experimental Structure <a href={PDB_URL_INTERFACE_BY_PROTEIN + props.isoFormAccession} target="_blank" rel="noreferrer" title="Click for further information from PDBeKB" className="ext-link"></a></th>
          </tr>
          <tr>
            <th>PDB ID</th>
            <th>Chain</th>
            <th>PDB pos.</th>
            <th>Resolution (Å)</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
    {options}
  </div>
}

export default PdbeStructureTable;