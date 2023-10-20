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
import {WHITE} from "../../../types/Colors";


interface StructuralDetailProps {
  isoFormAccession: string,
  aaPosition: number,
  variantAA: string, // 3 letter
  proteinStructureUri: string
}

export enum StructType {
  PDB,
  AF,
  CUSTOM
}

export const baseSettings = {
  bgColor: WHITE,
  hideControls: true,
  hideWater: true
}

function StructuralDetail(props: StructuralDetailProps) {
  const { isoFormAccession, aaPosition, variantAA, proteinStructureUri } = props;
  const [pdbData, setPdbData] = useState(new Array<ProteinStructureElement>());
  const [alphaFoldData, setAlphaFoldData] = useState(new Array<AlphafoldResponseElement>());
  const [selected, setSelected] = useState<ProteinStructureElement|AlphafoldResponseElement|P2PInteraction>();
  const [interactionData, setInteractionData] = useState(new Array<P2PInteraction>());
  const [pocketData, setPocketData] = useState(new Array<Pocket>());
  const ref = useRef(null);
  const [pdbeRef] = useState(new PdbeRef(ref))

  useEffect(() => {
    let id = ''
    getStructureData(proteinStructureUri).then(
        response => {
          setPdbData(response.data);
          if (response.data.length > 0) {
            id = response.data[0].pdb_id
            setSelected(response.data[0]);
            //pdbeRef.subscribeOnload(response.data[0].start)
          }
          return getPredictedStructure(isoFormAccession);
        }).then(response => {
          setAlphaFoldData(response.data);
          if (response.data.length > 0 && !id) {
            // if id already set (pdb id), use that, otherwise, use alphaFold id
            setSelected(response.data[0])
            //pdbeRef.subscribeOnload(aaPosition)
          }
          let functionUrl = '/function/' + isoFormAccession + '/' + aaPosition + (variantAA == null ? '' : ('?variantAA=' + variantAA))
        return getFunctionalData(functionUrl)
        }).then(response => {
          const funcData = response.data
          setInteractionData(funcData.interactions)
          setPocketData(funcData.pockets)
        }).catch(err => {
          console.log(err);
        });
  }, [proteinStructureUri, isoFormAccession, aaPosition, variantAA]);

  if (!selected) {
    return <LoaderRow />
  }

  return (
    <tr key={isoFormAccession}>
      <PdbeMolstar selected={selected} pdbeRef={ref} />
      <td colSpan={5} className="expanded-row structure-data-cell">
        {pdbData.length > 0 && <><br/>
            <PdbInfoTable isoFormAccession={isoFormAccession} pdbApiData={pdbData}
                        selectedPdbId={"pdb_id" in selected ? selected.pdb_id : ""}
                        setSelected={setSelected} pdbeRef={pdbeRef} /></>}
        {alphaFoldData.length > 0 && <><br/>
            <AlphafoldInfoTable isoFormAccession={isoFormAccession} alphaFoldData={alphaFoldData}
                              selectedAlphaFoldId={"entryId" in selected ? selected.entryId : ""}
                              setSelected={setSelected} aaPos={aaPosition} pocketData={pocketData} pdbeRef={pdbeRef} /></>}
        {interactionData.length > 0 && <><br/>
            <InteractionInfoTable isoFormAccession={isoFormAccession} interactionData={interactionData}
                            selectedInteraction={"a" in selected && "b" in selected ? (selected.a+"_"+selected.b) : ""}
                            setSelected={setSelected} aaPos={aaPosition} pdbeRef={pdbeRef} /></>}
      </td>
    </tr>
  );
}

export default StructuralDetail;