import React, {useEffect, useRef, useState} from 'react';
import PdbInfoTable from './PdbInfoTable';
import PredictedStructureTable from './PredictedStructureTable';
import PdbeMolstar from "./PdbeMolstar";
import InteractionInfoTable from "./InteractionInfoTable";
import LoaderRow from "../../pages/result/LoaderRow";
import PdbeRef from "./PdbeRef";
import {getPredictedStructure} from "../../../services/AlphafoldService";
import {getFunctionalData, getStructureData} from "../../../services/ProtVarService";
import {P2PInteraction, Pocket} from "../../../types/FunctionalResponse";
import {ProteinStructureElement} from "../../../types/ProteinStructureResponse";
import {AlphafoldResponseElement} from "../../../types/AlphafoldResponse";
import {WHITE} from "../../../types/Colors";
import StructureIcon from "../../../images/structures-3d.svg";
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import Spaces from "../../elements/Spaces";
import {ShareAnnotationIcon} from "../common/ShareLink";
import {ALPHAFILL_URL, hasAlphafillStructure} from "../../../services/AlphafillService";


interface StructuralDetailProps {
  annotation: string
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

export interface AlphaFillStructure {
  entryId: string
  cifUrl: string
}

export type PredictedStructure = AlphafoldResponseElement | AlphaFillStructure

function StructuralDetail(props: StructuralDetailProps) {
  const {isoFormAccession, aaPosition, variantAA, proteinStructureUri} = props;
  const [pdbData, setPdbData] = useState(new Array<ProteinStructureElement>());
  const [predictedStructureData, setPredictedStructureData] = useState(new Array<PredictedStructure>());
  const [selected, setSelected] = useState<ProteinStructureElement | PredictedStructure | P2PInteraction>();
  const [interactionData, setInteractionData] = useState(new Array<P2PInteraction>());
  const [pocketData, setPocketData] = useState(new Array<Pocket>());
  const ref = useRef(null);
  const [pdbeRef] = useState(new PdbeRef(ref))

  const addPredictedStructures = (newPredictedStructures: PredictedStructure[]) => {
    setPredictedStructureData(prevItems => [...prevItems, ...newPredictedStructures]);
  };

  useEffect(() => {
    getStructureData(proteinStructureUri).then(
      response => {
        setPdbData(response.data);
        return getPredictedStructure(isoFormAccession);
      }).then(response => {
      addPredictedStructures(response.data)
      return hasAlphafillStructure(isoFormAccession)
    }).then(response => {
      if (response) {
        const alphaFillStruc = {
          entryId: 'AlphaFill-' + isoFormAccession,
          cifUrl: ALPHAFILL_URL + isoFormAccession
        }
        addPredictedStructures([alphaFillStruc])
      }
      let functionUrl = '/function/' + isoFormAccession + '/' + aaPosition + (variantAA == null ? '' : ('?variantAA=' + variantAA))
      return getFunctionalData(functionUrl)
    }).then(response => {
      const funcData = response.data
      setInteractionData(funcData.interactions)
      setPocketData(funcData.pockets)
    }).catch(err => {
      console.log(err);
    })
  }, [proteinStructureUri, isoFormAccession, aaPosition, variantAA]);

  useEffect(() => {
    if (!selected) {
      if (pdbData.length > 0) {
        setSelected(pdbData[0]);
        //pdbeRef.subscribeOnload(response.data[0].start)
      } else if (predictedStructureData.length > 0) {
        setSelected(predictedStructureData[0])
      }
    }
  }, [pdbData, predictedStructureData, selected]);

  if (!selected) {
    return <LoaderRow/>
  }

  return (
    <tr key={isoFormAccession}>

      <td colSpan={10} className="expanded-row structure-data-cell">
        <div className="significances-groups">
          <div className="column">
            <h5 style={{display: "inline"}}>
              <img src={StructureIcon} className="click-icon" alt="structure icon"
                   title="3D structure"/> Structures
            </h5>
            <HelpButton title="" content={<HelpContent name="structure-annotations"/>}/>
            <Spaces count={2}/>
            <ShareAnnotationIcon annotation={props.annotation}/>
            <PdbeMolstar selected={selected} pdbeRef={ref}/>
          </div>
        </div>
      </td>
      <td colSpan={5} className="expanded-row structure-data-cell">
        {pdbData.length > 0 && <><br/>
          <PdbInfoTable isoFormAccession={isoFormAccession} pdbApiData={pdbData}
                        selectedPdbId={"pdb_id" in selected ? selected.pdb_id : ""}
                        setSelected={setSelected} pdbeRef={pdbeRef}/></>}
        {predictedStructureData.length > 0 && <><br/>
          <PredictedStructureTable isoFormAccession={isoFormAccession} predictedStructureData={predictedStructureData}
                                   selectedPredictedStructure={"entryId" in selected ? selected.entryId : ""}
                                   setSelected={setSelected} aaPos={aaPosition} pocketData={pocketData}
                                   pdbeRef={pdbeRef}/></>}
        {interactionData.length > 0 && <><br/>
          <InteractionInfoTable isoFormAccession={isoFormAccession} interactionData={interactionData}
                                selectedInteraction={"a" in selected && "b" in selected ? (selected.a + "_" + selected.b) : ""}
                                setSelected={setSelected} aaPos={aaPosition} pdbeRef={pdbeRef}/></>}
      </td>
    </tr>
  );
}

export default StructuralDetail;