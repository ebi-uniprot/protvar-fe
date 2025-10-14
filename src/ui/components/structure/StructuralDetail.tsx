import React, {useEffect, useRef, useState} from 'react';
import PdbeStructureTable from './PdbeStructureTable';
import PredictedStructureTable from './PredictedStructureTable';
import PdbeMolstar from "./PdbeMolstar";
import InteractionInfoTable from "./InteractionInfoTable";
import LoaderRow from "../../pages/result/LoaderRow";
import PdbeRef from "./PdbeRef";
import {getPredictedStructure} from "../../../services/AlphafoldService";
import {getFunctionalData, getStructureData} from "../../../services/ProtVarService";
import {PdbeStructure} from "../../../types/PdbeStructure";
import {AlphafoldResponseElement} from "../../../types/AlphafoldResponse";
import {WHITE} from "../../../types/Colors";
import StructureIcon from "../../../images/structures-3d.svg";
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import Spaces from "../../elements/Spaces";
import {ShareAnnotationIcon} from "../common/ShareLink";
import {ALPHAFILL_URL, hasAlphafillStructure} from "../../../services/AlphafillService";
import {Interaction, Pocket} from "../../../types/Prediction";


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
  modelEntityId: string
  cifUrl: string
}

export type PredictedStructure = AlphafoldResponseElement | AlphaFillStructure

function StructuralDetail(props: StructuralDetailProps) {
  const {isoFormAccession, aaPosition, variantAA, proteinStructureUri} = props;
  const [pdbeData, setPdbeData] = useState(new Array<PdbeStructure>());
  const [predictedStructureData, setPredictedStructureData] = useState(new Array<PredictedStructure>());
  const [selected, setSelected] = useState<PdbeStructure | PredictedStructure | Interaction>();
  const [interactionData, setInteractionData] = useState(new Array<Interaction>());
  const [pocketData, setPocketData] = useState(new Array<Pocket>());
  const ref = useRef(null);
  const [pdbeRef] = useState(new PdbeRef(ref))

  const addPredictedStructures = (newPredictedStructures: PredictedStructure[]) => {
    setPredictedStructureData(prevItems => [...prevItems, ...newPredictedStructures]);
  };

  useEffect(() => {
    getStructureData(proteinStructureUri).then(
      response => {
        setPdbeData(response.data);
        return getPredictedStructure(isoFormAccession);
      }).then(response => {
      // Filter to only include structures matching the queried accession
      const filteredData = response.data.filter(item => item.uniprotAccession === isoFormAccession);
      addPredictedStructures(filteredData)
      return hasAlphafillStructure(isoFormAccession)
    }).then(response => {
      if (response) {
        const alphaFillStruc = {
          modelEntityId: 'AlphaFill-' + isoFormAccession,
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
      if (pdbeData.length > 0) {
        setSelected(pdbeData[0]);
        //pdbeRef.subscribeOnload(response.data[0].start)
      } else if (predictedStructureData.length > 0) {
        setSelected(predictedStructureData[0])
      }
    }
  }, [pdbeData, predictedStructureData, selected]);

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
        {pdbeData?.length > 0 && <><br/>
          <PdbeStructureTable isoFormAccession={isoFormAccession} pdbeData={pdbeData}
                              selectedPdbId={"pdbId" in selected ? selected.pdbId : ""}
                              setSelected={setSelected} pdbeRef={pdbeRef}/></>}
        {predictedStructureData?.length > 0 && <><br/>
          <PredictedStructureTable isoFormAccession={isoFormAccession} predictedStructureData={predictedStructureData}
                                   selectedPredictedStructure={"modelEntityId" in selected ? selected.modelEntityId : ""}
                                   setSelected={setSelected} aaPos={aaPosition} pocketData={pocketData}
                                   pdbeRef={pdbeRef}/></>}
        {interactionData?.length > 0 && <><br/>
          <InteractionInfoTable isoFormAccession={isoFormAccession} interactionData={interactionData}
                                selectedInteraction={"a" in selected && "b" in selected ? (selected.a + "_" + selected.b) : ""}
                                setSelected={setSelected} aaPos={aaPosition} pdbeRef={pdbeRef}/></>}
      </td>
    </tr>
  );
}

export default StructuralDetail;