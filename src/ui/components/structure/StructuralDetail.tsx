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
  modelEntityId: string
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStructureData(proteinStructureUri)
      .then(response => {
        console.log('PDB structures found:', response.data.length);
        setPdbData(response.data);
        return getPredictedStructure(isoFormAccession);
      })
      .then(response => {
        // Filter to only include structures matching the queried accession
        const dataArray = Array.isArray(response.data) ? response.data : [];
        const filteredData = dataArray.filter(item => item.uniprotAccession === isoFormAccession);
        console.log('AlphaFold structures found:', filteredData.length);
        addPredictedStructures(filteredData);
        return filteredData.length > 0;
      })
      .catch(error => {
        if (error.response?.status === 404) {
          console.log('No AlphaFold structure (404)');
          return false;
        }
        throw error;
      })
      .then((hasAlphaFold) => {
        console.log('Has AlphaFold:', hasAlphaFold);
        return hasAlphafillStructure(isoFormAccession)
          .then(hasAlphaFill => {
            console.log('Has AlphaFill:', hasAlphaFill);
            if (hasAlphaFill) {
              const alphaFillStruc = {
                modelEntityId: 'AlphaFill-' + isoFormAccession,
                cifUrl: ALPHAFILL_URL + isoFormAccession
              };
              addPredictedStructures([alphaFillStruc]);
            }
            return hasAlphaFold || hasAlphaFill;
          });
      })
      .then((hasPredictedStructures) => {
        console.log('Has any predicted structures:', hasPredictedStructures);
        // Only fetch functional data if we have predicted structures
        if (hasPredictedStructures) {
          let functionUrl = '/function/' + isoFormAccession + '/' + aaPosition +
            (variantAA == null ? '' : ('?variantAA=' + variantAA));
          return getFunctionalData(functionUrl);
        } else {
          console.log('No predicted structures - skipping functional data');
          return null;
        }
      })
      .then(response => {
        if (response) {
          const funcData = response.data;
          console.log('Functional data - interactions:', funcData.interactions.length, 'pockets:', funcData.pockets.length);
          setInteractionData(funcData.interactions);
          setPocketData(funcData.pockets);
        }
      })
      .catch(err => {
        console.error('Error fetching structure data:', err);
      })
      .finally(() => {
        setIsLoading(false); // Always stop loading
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

// Then update your render logic:
  if (isLoading) {
    return <LoaderRow/>
  }

  if (!selected) {
    return <NoStructureDataRow/>;
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
                                   selectedPredictedStructure={"modelEntityId" in selected ? selected.modelEntityId : ""}
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

function NoStructureDataRow() {
  return <tr>
    <td colSpan={15} className="expanded-row">
      {' '}
      <div className="significances-groups">
        <div className="column">
          <b>No structural data available for this protein</b>
        </div>
      </div>
    </td>
  </tr>
}

export default StructuralDetail;