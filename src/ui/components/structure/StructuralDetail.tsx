import React, {useEffect, useState, useRef, useCallback} from 'react';
import PdbeStructureTable from './PdbeStructureTable';
import PredictedStructureTable from './PredictedStructureTable';
import PdbeMolstar from "./PdbeMolstar";
import InteractionInfoTable from "./InteractionInfoTable";
import LoaderRow from "../../pages/result/LoaderRow";
import {getPredictedStructure} from "../../../services/AlphafoldService";
import {getFunctionalData, getStructureData} from "../../../services/ProtVarService";
import {PdbeStructure} from "../../../types/PdbeStructure";
import {AlphafoldResponseElement} from "../../../types/AlphafoldResponse";
import StructureIcon from "../../../images/structures-3d.svg";
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import Spaces from "../../elements/Spaces";
import {ShareAnnotationIcon} from "../common/ShareLink";
import {ALPHAFILL_URL, hasAlphafillStructure} from "../../../services/AlphafillService";
import {Interaction, Pocket} from "../../../types/Prediction";
import {useMolstarController} from "./useMolstarController";
import {useStructureUrl} from "./useStructureUrl";


interface StructuralDetailProps {
  annotation: string
  isoFormAccession: string,
  aaPosition: number,
  variantAA: string, // 3 letter
  proteinStructureUri: string
}

export interface AlphaFillStructure {
  modelEntityId: string
  cifUrl: string
}

export type PredictedStructure = AlphafoldResponseElement | AlphaFillStructure

function StructuralDetail(props: StructuralDetailProps) {
  const { isoFormAccession, aaPosition, variantAA, proteinStructureUri } = props;
  const molstar = useMolstarController();
  const urlParams = useStructureUrl();

  const [pdbeData, setPdbeData] = useState<PdbeStructure[]>([]);
  const [predictedStructureData, setPredictedStructureData] = useState<PredictedStructure[]>([]);
  const [interactionData, setInteractionData] = useState<Interaction[]>([]);
  const [pocketData, setPocketData] = useState<Pocket[]>([]);
  const [selected, setSelected] = useState<PdbeStructure | PredictedStructure | Interaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedFromUrl = useRef(false);

  const addPredictedStructures = (newItems: PredictedStructure[]) =>
    setPredictedStructureData((prev) => [...prev, ...newItems]);

  // Fetch structures and functional data
  useEffect(() => {
    let isCancelled = false;

    getStructureData(proteinStructureUri)
      .then((res) => {
        if (!isCancelled) setPdbeData(res.data);
        return getPredictedStructure(isoFormAccession);
      })
      .then((res) => {
        const filtered = Array.isArray(res.data) ? res.data.filter((i) => i.uniprotAccession === isoFormAccession) : [];
        if (!isCancelled) addPredictedStructures(filtered);
        return filtered.length > 0;
      })
      .catch(error => {
        if (error.response?.status === 404) {
          console.log('No AlphaFold structure (404)');
          return false;
        }
        throw error;
      })
      .then((hasAFold) => {
        return hasAlphafillStructure(isoFormAccession)
          .then((hasAFill) => {
            if (hasAFill && !isCancelled) {
              addPredictedStructures([{ modelEntityId: "AlphaFill-" + isoFormAccession, cifUrl: ALPHAFILL_URL + isoFormAccession }]);
            }
            return hasAFold || hasAFill;
          })
      })
      .then((hasPredicted) => {
        if (hasPredicted) {
          const url = `/function/${isoFormAccession}/${aaPosition}${variantAA ? `?variantAA=${variantAA}` : ""}`;
          return getFunctionalData(url);
        }
        return null;
      })
      .then((res) => {
        if (res && !isCancelled) {
          setInteractionData(res.data.interactions);
          setPocketData(res.data.pockets);
        }
      })
      .catch((err) => console.error("Error fetching structure data:", err))
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [proteinStructureUri, isoFormAccession, aaPosition, variantAA]);

  // Apply URL actions when structure loads (for initial URL loading only)
  const applyUrlActionsWhenLoaded = useCallback(async () => {
    if (!selected) return;

    const params = urlParams.getParams();

    // Don't call update() - component is rendering with structure for the first time
    // Just subscribe to loadComplete and apply actions when ready
    await molstar.executeWhenLoaded(async () => {
      try {
        if ("pdbId" in selected) {
          if (params.zoom) {
            await molstar.zoomToVariant(selected.start, selected.chainId);
          } else if (params.chain) {
            const chainData = pdbeData.filter(d => d.pdbId === selected.pdbId);
            const targetChain = chainData.find(c => c.chainId.toUpperCase() === params.chain!.toUpperCase());
            if (targetChain) {
              await molstar.highlightChain(targetChain.start, targetChain.chainId);
            }
          } else {
            // apply default highlight
            await molstar.highlightVariant(selected.start, selected.chainId);
          }
        } else if ("cifUrl" in selected) {
          if (params.zoom) {
            await molstar.zoomToVariant(aaPosition);
          } else if (params.pocket) {
            const pocketMatch = params.pocket.match(/^p(\d+)$/i);
            if (pocketMatch) {
              const pocketId = parseInt(pocketMatch[1]);
              const pocket = pocketData.find(p => p.pocketId === pocketId);
              if (pocket) {
                await molstar.highlightPocket(aaPosition, pocket.resid);
              }
            }
          } else {
            // apply default highlight
            await molstar.highlightVariant(aaPosition);
          }
        } else if ("a" in selected && "b" in selected) {
          const protChain = selected.a === isoFormAccession ? "A" : "B";
          if (params.zoom) {
            await molstar.zoomToVariant(aaPosition, protChain);
          } else if (params.interface) {
            await molstar.highlightInterface(selected.aresidues, selected.bresidues, aaPosition, protChain);
          } else {
            // apply default highlight
            await molstar.highlightVariant(aaPosition, protChain);
          }
        }
      } catch (err) {
        console.error("Error applying URL actions:", err);
      }
    });
  }, [selected, urlParams, molstar, pdbeData, pocketData, aaPosition, isoFormAccession]);

  // Select structure from URL or default (don't wait for viewer)
  useEffect(() => {
    if (isLoading || hasLoadedFromUrl.current) return;

    const params = urlParams.getParams();
    let structureToLoad: PdbeStructure | PredictedStructure | Interaction | null = null;

    if (params.structureId) {
      // Parse new format: pdb:1ABC, prediction:AlphaFold, interaction:P12345_P67890
      const parts = params.structureId.split(":");
      const type = parts[0];
      const id = parts[1]; // May be undefined for default

      switch (type) {
        case "pdb":
          if (id && id !== "default") {
            structureToLoad = pdbeData.find((d) => d.pdbId === id) || null;
          } else {
            // Use first PDB structure as default
            structureToLoad = pdbeData[0] || null;
          }
          if (structureToLoad) urlParams.clearIncompatibleActions("pdb");
          break;

        case "prediction":
          if (id && id.toLowerCase() === "alphafill") {
            structureToLoad = predictedStructureData.find((p) => "modelEntityId" in p && p.modelEntityId.startsWith("AlphaFill-")) || null;
          } else {
            // Use AlphaFold as default (or first available prediction)
            structureToLoad = predictedStructureData.find((p) => "uniprotAccession" in p) || predictedStructureData[0] || null;
          }
          if (structureToLoad) urlParams.clearIncompatibleActions("prediction");
          break;

        case "interaction":
          if (id && id !== "default") {
            const [a, b] = id.split("_");
            structureToLoad = interactionData.find((i) => i.a === a && i.b === b) || null;
          } else {
            // Use first interaction as default
            structureToLoad = interactionData[0] || null;
          }
          if (structureToLoad) urlParams.clearIncompatibleActions("interaction");
          break;
      }
    } else {
      // Default selection when no structure parameter
      if (pdbeData.length > 0) {
        structureToLoad = pdbeData[0];
        urlParams.clearIncompatibleActions("pdb");
      } else if (predictedStructureData.length > 0) {
        structureToLoad = predictedStructureData[0];
        urlParams.clearIncompatibleActions("prediction");
      }
    }

    if (structureToLoad) {
      hasLoadedFromUrl.current = true;
      setSelected(structureToLoad);
    }
  }, [pdbeData, predictedStructureData, interactionData, isLoading, urlParams]);

  // Apply URL actions when selected (only on initial load from URL)
  const hasAppliedUrlActions = useRef(false);

  useEffect(() => {
    if (!selected || hasAppliedUrlActions.current) return;

    hasAppliedUrlActions.current = true;
    applyUrlActionsWhenLoaded();
  }, [selected, applyUrlActionsWhenLoaded]);

  // Reset flags when data refetches (if user navigates to different variant)
  useEffect(() => {
    return () => {
      hasLoadedFromUrl.current = false;
      hasAppliedUrlActions.current = false;
    };
  }, [proteinStructureUri, isoFormAccession, aaPosition]);

  if (isLoading) return <LoaderRow />;
  if (!selected) return <NoStructureDataRow />;

  return (
    <tr key={isoFormAccession}>
      <td colSpan={10} className="expanded-row structure-data-cell">
        <div className="">
          <div className="column">
            <h5 style={{display: "inline"}}>
              <img src={StructureIcon} className="click-icon" alt="structure icon"
                   title="3D structure"/> Structures
            </h5>
            <HelpButton title="" content={<HelpContent name="structure-annotations"/>}/>
            <Spaces count={2}/>
            <ShareAnnotationIcon annotation={props.annotation}/>
            <PdbeMolstar selected={selected} pdbeRef={molstar.ref}/>
          </div>
        </div>
      </td>
      <td colSpan={5} className="expanded-row structure-data-cell">
        {pdbeData?.length > 0 && (
          <PdbeStructureTable
            isoFormAccession={isoFormAccession}
            pdbeData={pdbeData}
            selectedPdbId={"pdbId" in selected ? selected.pdbId : ""}
            setSelected={setSelected}
            molstar={molstar}
            urlParams={urlParams}
          />
        )}
        {predictedStructureData?.length > 0 && (
          <PredictedStructureTable
            isoFormAccession={isoFormAccession}
            predictedStructureData={predictedStructureData}
            selectedPredictedStructure={"modelEntityId" in selected ? selected.modelEntityId : ""}
            setSelected={setSelected}
            aaPos={aaPosition}
            pocketData={pocketData}
            molstar={molstar}
            urlParams={urlParams}
          />
        )}
        {interactionData?.length > 0 && (
          <InteractionInfoTable
            isoFormAccession={isoFormAccession}
            interactionData={interactionData}
            selectedInteraction={"a" in selected && "b" in selected ? (selected.a + "_" + selected.b) : ""}
            setSelected={setSelected}
            aaPos={aaPosition}
            molstar={molstar}
            urlParams={urlParams}
          />
        )}
      </td>
    </tr>
  );
}

function NoStructureDataRow() {
  return <tr>
    <td colSpan={15} className="expanded-row">
      {' '}
      <div className="">
        <div className="column">
          <b>No structural data available for this protein</b>
        </div>
      </div>
    </td>
  </tr>
}

export default StructuralDetail;