import React, {useEffect, useState, useRef, useCallback} from 'react';
import {TOTAL_COLS} from '../../../constants/SearchResultTable';
import PdbeStructureTable from './tables/PdbeStructureTable';
import PredictedStructureTable from './tables/PredictedStructureTable';
import PdbeMolstar from "./viewer/PdbeMolstar";
import InteractingStructureTable from "./tables/InteractingStructureTable";
import LoaderRow from "../../pages/result/LoaderRow";
import {getPredictedStructure} from "../../../services/AlphafoldService";
import {getFunctionalData, getStructureData} from "../../../services/ProtVarService";
import {PdbeStructure} from "../../../types/PdbeStructure";
import {AlphafoldResponseElement} from "../../../types/AlphafoldResponse";
import StructureIcon from "../../../images/structures-3d.svg";
import {HelpContent} from "../help/HelpContent";
import {HelpButton} from "../help/HelpButton";
import {ShareAnnotationIcon} from "../common/ShareLink";
import {ALPHAFILL_URL, hasAlphafillStructure} from "../../../services/AlphafillService";
import {Interaction, Pocket} from "../../../types/Prediction";
import {useMolstarController} from "./useMolstarController";
import {useStructureUrl} from "./useStructureUrl";
import {PAEPanel} from "./viewer/PAEPanel";
import "../../../styles/new/annotation.css";
import "../../../styles/new/structure.css";

interface StructureDataProps {
  annotation: string;
  isoFormAccession: string;
  aaPosition: number;
  variantAA: string; // 3-letter variant AA code
  proteinStructureUri: string;
}

export interface AlphaFillStructure {
  modelEntityId: string;
  cifUrl: string;
}

export type PredictedStructure = AlphafoldResponseElement | AlphaFillStructure;

function StructureData(props: StructureDataProps) {
  const { isoFormAccession, aaPosition, variantAA, proteinStructureUri } = props;
  const molstar = useMolstarController();
  const urlParams = useStructureUrl();

  const [pdbeData, setPdbeData] = useState<PdbeStructure[]>([]);
  const [predictedData, setPredictedData] = useState<PredictedStructure[]>([]);
  const [interactionData, setInteractionData] = useState<Interaction[]>([]);
  const [pocketData, setPocketData] = useState<Pocket[]>([]);
  const [selected, setSelected] = useState<PdbeStructure | PredictedStructure | Interaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaeOpen, setIsPaeOpen] = useState(false);
  const [paeUrl, setPaeUrl] = useState<string>("");
  const hasLoadedFromUrl = useRef(false);

  const addPredictedStructures = (newItems: PredictedStructure[]) =>
    setPredictedData((prev) => [...prev, ...newItems]);

  // Calculate data richness
  const calculateDataRichness = (): number => {

    let score = 0;
    if (pdbeData && pdbeData.length > 0) score += 0.4;
    if (predictedData && predictedData.length > 0) score += 0.3;
    if (interactionData && interactionData.length > 0) score += 0.3;

    return Math.min(score, 1.0);
  };

  const dataRichness = calculateDataRichness();

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
            await molstar.highlightVariant(aaPosition);
          }
        } else if ("a" in selected && "b" in selected) {
          const protChain = selected.a === isoFormAccession ? "A" : "B";
          if (params.zoom) {
            await molstar.zoomToVariant(aaPosition, protChain);
          } else if (params.interface) {
            await molstar.highlightInterface(selected.aresidues, selected.bresidues, aaPosition, protChain);
          } else {
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
            structureToLoad = predictedData.find((p) => "modelEntityId" in p && p.modelEntityId.startsWith("AlphaFill-")) || null;
          } else {
            // Use AlphaFold as default (or first available prediction)
            structureToLoad = predictedData.find((p) => "uniprotAccession" in p) || predictedData[0] || null;
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
      } else if (predictedData.length > 0) {
        structureToLoad = predictedData[0];
        urlParams.clearIncompatibleActions("prediction");
      }
    }

    if (structureToLoad) {
      hasLoadedFromUrl.current = true;
      setSelected(structureToLoad);

      // Open PAE if AlphaFold structure with PAE
      if ("paeImageUrl" in structureToLoad) {
        setPaeUrl(structureToLoad.paeImageUrl);
        setIsPaeOpen(true);
      }
    }
  }, [pdbeData, predictedData, interactionData, isLoading, urlParams]);

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

  // Generate viewer control actions based on selected structure
  const getViewerActions = () => {
    if (!selected) return [];

    const actions: Array<{ label: string; onClick: () => void; variant?: 'primary' | 'reset' }> = [];

    // Zoom action (always available)
    actions.push({
      label: "Zoom to variant",
      onClick: () => {
        if ("pdbId" in selected) {
          urlParams.updateActions({ zoom: true, chain: null });
          molstar.zoomToVariant(selected.start, selected.chainId);
        } else if ("cifUrl" in selected) {
          urlParams.updateActions({ zoom: true, pocket: null });
          molstar.zoomToVariant(aaPosition);
        } else if ("a" in selected && "b" in selected) {
          const protChain = selected.a === isoFormAccession ? "A" : "B";
          urlParams.updateActions({ zoom: true, interface: null });
          molstar.zoomToVariant(aaPosition, protChain);
        }
      },
      variant: 'primary' as const
    });

    // Type-specific actions
    if ("pdbId" in selected) {
      // Chain highlighting for PDB
      const chains = pdbeData.filter(d => d.pdbId === selected.pdbId);
      chains.forEach((chain, idx) => {
        const label = idx === 0 ? `Chain ${chain.chainId}` : chain.chainId;
        actions.push({
          label,
          onClick: () => {
            urlParams.updateActions({ chain: chain.chainId, zoom: null });
            molstar.highlightChain(chain.start, chain.chainId);
          }
        });
      });
    } else if ("cifUrl" in selected) {
      // Pocket highlighting for AlphaFold
      pocketData.forEach((pocket, idx) => {
        const label = idx === 0 ? `Pocket P${pocket.pocketId}` : `P${pocket.pocketId}`;
        actions.push({
          label,
          onClick: () => {
            urlParams.updateActions({ pocket: `p${pocket.pocketId}`, zoom: null });
            molstar.highlightPocket(aaPosition, pocket.resid);
          }
        });
      });
    } else if ("a" in selected && "b" in selected) {
      // Interface highlighting for interactions
      actions.push({
        label: "Interface",
        onClick: () => {
          const protChain = selected.a === isoFormAccession ? "A" : "B";
          urlParams.updateActions({ interface: true, zoom: null });
          molstar.highlightInterface(selected.aresidues, selected.bresidues, aaPosition, protChain);
        }
      });
    }

    // Reset action
    actions.push({
      label: "Reset",
      onClick: () => {
        if ("pdbId" in selected) {
          urlParams.updateActions({ chain: null, zoom: null });
          molstar.resetDefault(selected.start, selected.chainId);
        } else if ("cifUrl" in selected) {
          urlParams.updateActions({ pocket: null, zoom: null });
          molstar.resetDefault(aaPosition);
        } else if ("a" in selected && "b" in selected) {
          const protChain = selected.a === isoFormAccession ? "A" : "B";
          urlParams.updateActions({ interface: null, zoom: null });
          molstar.resetDefault(aaPosition, protChain);
        }
      },
      variant: 'reset' as const
    });

    return actions;
  };

  if (isLoading) return <LoaderRow />;
  if (!selected) return <NoStructureDataRow />;

  return (
    <tr>
      <td colSpan={TOTAL_COLS} className="expanded-row">
        <div className="annotation-data-container">
          <div className="annotation-header">
            <div className="annotation-title">
              <img
                src={StructureIcon}
                className="annotation-icon"
                data-fill={dataRichness.toFixed(1)}
                alt="3D structure"
                title={`Data richness: ${(dataRichness * 100).toFixed(0)}%`}
              />
              <h5>3D Structures</h5>
              {dataRichness > 0.7 && (
                <span className="data-richness-badge">
                  <i className="bi bi-check-circle-fill"></i>
                  Rich data
                </span>
              )}
            </div>
            <div className="annotation-actions">
              <HelpButton title="" content={<HelpContent name="structure-annotations"/>}/>
              <ShareAnnotationIcon annotation={props.annotation}/>
            </div>
          </div>
          {/* Content - Tables Left, Viewer Right */}
          <div className="annotation-content structure-layout">
            <div className="annotation-tables-column">
              {pdbeData.length > 0 && (
                <PdbeStructureTable
                  isoFormAccession={isoFormAccession}
                  pdbeData={pdbeData}
                  selectedPdbId={"pdbId" in selected ? selected.pdbId : ""}
                  setSelected={setSelected}
                  molstar={molstar}
                  urlParams={urlParams}
                />
              )}
              {predictedData.length > 0 && (
                <PredictedStructureTable
                  isoFormAccession={isoFormAccession}
                  predictedStructureData={predictedData}
                  selectedPredictedStructure={"modelEntityId" in selected ? selected.modelEntityId : ""}
                  setSelected={(structure) => {
                    setSelected(structure);
                    if ("paeImageUrl" in structure) {
                      setPaeUrl(structure.paeImageUrl);
                      setIsPaeOpen(true);
                    } else {
                      setIsPaeOpen(false);
                    }
                  }}
                  aaPos={aaPosition}
                  pocketData={pocketData}
                  molstar={molstar}
                  urlParams={urlParams}
                />
              )}
              {interactionData.length > 0 && (
                <InteractingStructureTable
                  isoFormAccession={isoFormAccession}
                  interactionData={interactionData}
                  selectedInteraction={"a" in selected && "b" in selected ? (selected.a + "_" + selected.b) : ""}
                  setSelected={(interaction) => {
                    setSelected(interaction);
                    setIsPaeOpen(false);
                  }}
                  aaPos={aaPosition}
                  molstar={molstar}
                  urlParams={urlParams}
                />
              )}
            </div>

            <div className="annotation-viewer-column">
              <PdbeMolstar
                selected={selected}
                pdbeRef={molstar.ref}
                controlActions={getViewerActions()}
              />
              <PAEPanel
                isOpen={isPaeOpen}
                paeImageUrl={paeUrl}
                onClose={() => setIsPaeOpen(false)}
              />
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

function NoStructureDataRow() {
  return (
    <tr>
      <td colSpan={TOTAL_COLS} className="expanded-row">
        <div className="annotation-data-container">
          <div className="annotation-header">
            <div className="annotation-title">
              <img
                src={StructureIcon}
                className="annotation-icon"
                data-fill="0.0"
                alt="3D structure"
              />
              <h5>3D Structures</h5>
            </div>
          </div>
          <div className="no-data-message">
            No structural data available for this protein
          </div>
        </div>
      </td>
    </tr>
  );
}

export default StructureData;