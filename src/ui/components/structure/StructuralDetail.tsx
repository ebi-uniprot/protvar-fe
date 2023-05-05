import {useEffect, useRef, useState} from 'react';
import PdbInfoTable from './PdbInfoTable';
import AlphafoldInfoTable from './AlphafoldInfoTable';
import PdbeMolstar from "./PdbeMolstar";
import InteractionInfoTable from "./InteractionInfoTable";
import LoaderRow from "../search/LoaderRow";
import PdbeRef from "./PdbeRef";
import {getPredictedStructure} from "../../../services/AlphafoldService";
import {getFunctionalData, getStructureData} from "../../../services/ProtVarService";
import {P2PInteraction, Pocket} from "../../../types/FunctionalResponse";
import {ProteinStructureElement} from "../../../types/ProteinStructureResponse";
import {AlphafoldResponseElement} from "../../../types/AlphafoldResponse";


interface StructuralDetailProps {
  isoFormAccession: string,
  aaPosition: number,
  proteinStructureUri: string
}

export enum StructType {
  PDB,
  AF,
  CUSTOM
}

export const baseSettings = {
  bgColor: {
    r: 255, g: 255, b: 255
  },
  hideControls: true,
  hideWater: true
}

function StructuralDetail(props: StructuralDetailProps) {
  const { isoFormAccession, aaPosition, proteinStructureUri } = props;
  const [pdbData, setPdbData] = useState(new Array<ProteinStructureElement>());
  const [alphaFoldData, setAlphaFoldData] = useState(new Array<AlphafoldResponseElement>());
  const [selected, setSelected] = useState<ProteinStructureElement|AlphafoldResponseElement|P2PInteraction>();
  const [interactionData, setInteractionData] = useState(new Array<P2PInteraction>());
  const [pocketData, setPocketData] = useState(new Array<Pocket>());
  const [pdbeRef] = useState(new PdbeRef(useRef(null)))

  useEffect(() => {
    let id = ''
    getStructureData(proteinStructureUri).then(
        response => {
          setPdbData(response.data);
          if (response.data.length > 0) {
            id = response.data[0].pdb_id
            setSelected(response.data[0]);
          }
          return getPredictedStructure(isoFormAccession);
        }).then(response => {
          setAlphaFoldData(response.data);
          if (response.data.length > 0 && !id) {
            // if id already set (pdb id), use that, otherwise, use alphaFold id
            setSelected(response.data[0])
          }
          return getFunctionalData('/function/' + isoFormAccession + '/' + aaPosition)
        }).then(response => {
          const funcData = response.data
          setInteractionData(funcData.interactions)
          setPocketData(funcData.pockets)
        }).catch(err => {
          console.log(err);
        });
  }, [proteinStructureUri, isoFormAccession, aaPosition]);

  if (!selected) {
    return <LoaderRow />
  }

  if (pdbeRef.ref && pdbeRef.ref.current) {
      (pdbeRef.ref.current as any).viewerInstance.events.loadComplete.subscribe(() => {
          if ("pdb_id" in selected) {
              pdbeRef.onloadSelect(selected.start)
          } else if ("entryId" in selected) {
              pdbeRef.onloadSelect(aaPosition)
          }
      });
  }

  return (
    <tr key={isoFormAccession}>
      <PdbeMolstar selected={selected} pdbeRef={pdbeRef.ref} />
      <td colSpan={5} className="expanded-row">
        {pdbData.length > 0 && <>
          <br />
          <PdbInfoTable isoFormAccession={isoFormAccession} pdbApiData={pdbData}
                        selectedPdbId={"pdb_id" in selected ? selected.pdb_id : ""}
                        setSelected={setSelected} pdbeRef={pdbeRef} />
        </>}
        {alphaFoldData.length > 0 && <>
          <br />
          <AlphafoldInfoTable isoFormAccession={isoFormAccession} alphaFoldData={alphaFoldData}
                              selectedAlphaFoldId={"entryId" in selected ? selected.entryId : ""}
                              setSelected={setSelected} aaPos={aaPosition} pocketData={pocketData} pdbeRef={pdbeRef} />
        </>}
        {interactionData.length > 0 && <>
        <br />
        <InteractionInfoTable isoFormAccession={isoFormAccession} interactionData={interactionData}
                            selectedInteraction={"a" in selected && "b" in selected ? (selected.a+"_"+selected.b) : ""}
                            setSelected={setSelected} pdbeRef={pdbeRef} />
      </>}
      </td>
    </tr>
  );
}

export default StructuralDetail;