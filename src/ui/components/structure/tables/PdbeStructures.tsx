import { PDB_URL_INTERFACE_BY_PROTEIN } from '../../../../constants/ExternalUrls';
import {PdbeStructure} from "../../../../types/PdbeStructure";
import { groupBy } from "../../../../utills/Util";
import React from "react";
import {useMolstarController} from "../useMolstarController";
import {useStructureUrl} from "../useStructureUrl";
import {ExtLink} from "../../common/Link";

interface PdbeStructureTableProps {
  isoFormAccession: string;
  pdbeData: PdbeStructure[];
  selectedPdbId: string;
  setSelected: any;
  molstar: ReturnType<typeof useMolstarController>;
  urlParams: ReturnType<typeof useStructureUrl>;
}

function PdbeStructureTable({ isoFormAccession, pdbeData, selectedPdbId, setSelected, molstar, urlParams }: PdbeStructureTableProps) {
  const grouped = groupBy(pdbeData, "pdbId");
  const count = Object.keys(grouped).length;
  const cards: Array<React.JSX.Element> = [];

  if (!pdbeData || pdbeData.length === 0) {
    return (
      <>
        <div className="structure-section-header">
          PDBe Experimental Structure
        </div>
        <div className="no-structures-msg">No experimental structures available</div>
      </>
    );
  }

  for (let id in grouped) {
    const chains = grouped[id].sort((a, b) => a.chainId.localeCompare(b.chainId));
    const first = chains[0];
    const isSelected = selectedPdbId === id;
    const tooltip = chains.map(c => `${c.pdbId}  Chain ${c.chainId}  Pos ${c.start}  ${c.resolution} Å  ${c.experimentalMethod}`).join('\n');

    cards.push(
      <div
        key={id}
        className={`pdb-structure-card${isSelected ? ' active' : ''}`}
        title={tooltip}
        onClick={() => {
          setSelected(first);
          urlParams.setStructure("pdb", first.pdbId);
          urlParams.clearIncompatibleActions("pdb");
          molstar.loadPdb(first.pdbId, first.start, first.chainId);
        }}
      >
        <span className="pdb-card-id">{id}</span>
        <span className="pdb-card-chain">{chains.map(c => c.chainId).join(', ')}</span>
        <span className="pdb-card-pos">{first.start}</span>
        <span className="pdb-card-resolution">{first.resolution ? `${first.resolution}` : '–'}</span>
        <span className="pdb-card-method">{first.experimentalMethod}</span>
      </div>
    );
  }

  return (
    <>
      <div className="structure-section-header">
        PDBe Experimental Structure <ExtLink url={PDB_URL_INTERFACE_BY_PROTEIN + isoFormAccession} />
        <span className="count-badge">{count}</span>
      </div>
      <div className="structure-col-header pdb-col-header">
        <span>ID</span>
        <span>Chain</span>
        <span>Pos</span>
        <span>Res (Å)</span>
        <span>Method</span>
      </div>
      <div className="structure-rows-scroll">
        {cards}
      </div>
    </>
  );
}

export default PdbeStructureTable;
