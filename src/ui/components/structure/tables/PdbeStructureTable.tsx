import { PDB_URL_INTERFACE_BY_PROTEIN } from '../../../../constants/ExternalUrls';
import {PdbeStructure} from "../../../../types/PdbeStructure";
import { groupBy } from "../../../../utills/Util";
import React from "react";
import {useMolstarController} from "../useMolstarController";
import {useStructureUrl} from "../useStructureUrl";

interface PdbeStructureTableProps {
  isoFormAccession: string;
  pdbeData: PdbeStructure[];
  selectedPdbId: string;
  setSelected: any;
  molstar: ReturnType<typeof useMolstarController>;
  urlParams: ReturnType<typeof useStructureUrl>;
}

function PdbeStructureTable({ isoFormAccession, pdbeData, selectedPdbId, setSelected, molstar, urlParams }: PdbeStructureTableProps) {
  const rows: Array<React.JSX.Element> = [];
  const grouped = groupBy(pdbeData, "pdbId")
  let options = <></>

  for (let id in grouped) {
    let chains = grouped[id].sort((a,b) => a.chainId.localeCompare(b.chainId));
    const first = chains[0]
    const isSelected = selectedPdbId === id

    const tooltip = chains.map(c => c.pdbId + '\t' + c.chainId + '\t' + c.start + '\t' + c.resolution + '\t' + c.experimentalMethod).join('\n')

    const row = <tr key={id} className={isSelected ? "clickable-row active" : "clickable-row"}
                    title={tooltip}
                    onClick={() => {
                      setSelected(first);
                      urlParams.setStructure("pdb", first.pdbId);
                      urlParams.clearIncompatibleActions("pdb");
                      molstar.loadPdb(first.pdbId, first.start, first.chainId);
                    }}>
      <td className="small">{id}</td>
      <td className="small">{chains.map(c => c.chainId).join(", ")}</td>
      <td className="small">{first.start}</td>
      <td className="small">{first.resolution}</td>
      <td className="small">{first.experimentalMethod}</td>
    </tr>

    if (isSelected) {
      let chainNum = 0;
      const highlightChainBtn = chains.map(c => {
        const k = 'highlightBtn-'+id+'-'+c.chainId
        chainNum++
        let highlightText = chainNum === 1 ? 'Highlight chain ' + c.chainId : c.chainId
        return <button key={k} className="button-new" onClick={() => {
          urlParams.updateActions({ chain: c.chainId, zoom: null });
          molstar.highlightChain(c.start, c.chainId);
        }}>{highlightText}</button>
      })

      options = <div className="small">
        <button className="button-new" onClick={() => {
          urlParams.updateActions({ zoom: true, chain: null });
          molstar.zoomToVariant(first.start, first.chainId);
        }}>Zoom to variant</button>
        {highlightChainBtn}
        <button className="button-new" onClick={() => {
          urlParams.updateActions({ chain: null, zoom: null });
          molstar.resetDefault(first.start, first.chainId);
        }}>Reset</button>
      </div>
    }

    rows.push(row);
  }

  return <div>
    <div className="tableFixHead">
      <table>
        <thead>
        <tr>
          <th colSpan={5}>PDBe Experimental Structure <a href={PDB_URL_INTERFACE_BY_PROTEIN + isoFormAccession} target="_blank" rel="noreferrer" title="Click for further information from PDBeKB" className="ext-link"></a></th>
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