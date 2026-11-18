import React, {useEffect, useState, useRef, useCallback} from 'react';
import PdbeStructures from './tables/PdbeStructures';
import PredictedStructures from './tables/PredictedStructures';
import PdbeMolstar from "./viewer/molstar/PdbeMolstar";
import InteractingStructures from "./tables/InteractingStructures";
import Loader from "../../elements/Loader";
import {getPredictedStructure} from "../../../services/AlphafoldService";
import {getPredictionData, getStructureData} from "../../../services/ProtVarService";
import {PdbeStructure} from "../../../types/PdbeStructure";
import {AlphafoldResponseElement} from "../../../types/AlphafoldResponse";
import {NoAnnotationData} from "../common/NoAnnotationData";
import {hasAlphafillStructure} from "../../../services/AlphafillService";
import {Interaction, Pocket} from "../../../types/Prediction";
import {useStructureViewer} from "./useStructureViewer";
import {PocketColouring} from "./viewer/PvStructureViewer";
import {useStructureUrl} from "./useStructureUrl";
import {PaeOverlay} from "./viewer/PaeOverlay";
import {ConfidenceKey, LegendItem, ViewerLegend} from "./viewer/ViewerLegend";
import {ViewerControls, ViewerOption, ViewerSegment, ViewerToggle} from "./viewer/ViewerControls";
import {
  css, DIM_CHAIN_COLOR, PDB_CHAIN_PALE, INTERFACE_PARTNER_COLOR, INTERFACE_PROTEIN_COLOR, PDB_CHAIN_DARK, PDB_CHAIN_LIGHT,
  HYDROPHILIC_COLOR, HYDROPHOBIC_COLOR, NEGATIVE_COLOR, NEUTRAL_COLOR, POSITIVE_COLOR, PROTEIN_CHAIN_COLOR, VARIANT_COLOR,
} from "./viewer/viewerColors";
import {ALPHAFILL_URL} from "../../../constants/ExternalUrls";
import { Icon } from '../../elements/Icon';



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
  const {viewer, viewerRef} = useStructureViewer();
  const urlParams = useStructureUrl();

  const [pdbeData, setPdbeData] = useState<PdbeStructure[]>([]);
  const [predictedData, setPredictedData] = useState<PredictedStructure[]>([]);
  const [interactionData, setInteractionData] = useState<Interaction[]>([]);
  const [pocketData, setPocketData] = useState<Pocket[]>([]);
  const [selected, setSelected] = useState<PdbeStructure | PredictedStructure | Interaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaeOpen, setIsPaeOpen] = useState(false);
  const [paeUrl, setPaeUrl] = useState<string>("");
  // Interaction models: AlphaFold pLDDT colouring instead of protein/partner.
  const [confidenceColouring, setConfidenceColouring] = useState(false);
  // What the viewer currently shows: "variant", "chain:B", "pocket:3" or "interface".
  const [viewerMode, setViewerMode] = useState("variant");
  // Pocket surface colouring (kept across pockets and structures).
  const [pocketColouring, setPocketColouring] = useState<PocketColouring>("hydrophobicity");
  const [urlStructureWarning, setUrlStructureWarning] = useState<string | null>(null);
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
        // Sort PDB entries by resolution ascending (best quality first); entries
        // without one (NMR comes back as 0.0, sometimes null) go to the end. This
        // single source of ordering covers both the table display and the
        // default-selected structure (pdbeData[0]).
        const sorted = (res.data ?? []).slice().sort((a, b) => {
          if (!a.resolution && !b.resolution) return 0;
          if (!a.resolution) return 1;
          if (!b.resolution) return -1;
          return a.resolution - b.resolution;
        });
        if (!isCancelled) setPdbeData(sorted);
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
          return getPredictionData(isoFormAccession, aaPosition, ['pocket', 'interface']);
        }
        return null;
      })
      .then((res) => {
        if (res && !isCancelled) {
          setInteractionData(res.data.interface ?? []);
          setPocketData(res.data.pocket ?? []);
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
    await viewer.executeWhenLoaded(async () => {
      try {
        if ("pdbId" in selected) {
          if (params.zoom) {
            await viewer.zoomToVariant(selected.start, selected.chainId);
          } else if (params.chain) {
            const chainData = pdbeData.filter(d => d.pdbId === selected.pdbId);
            const targetChain = chainData.find(c => c.chainId.toUpperCase() === params.chain!.toUpperCase());
            if (targetChain) {
              await viewer.highlightChain(targetChain.start, targetChain.chainId);
              setViewerMode(`chain:${targetChain.chainId}`);
            }
          } else {
            // apply default highlight
            await viewer.highlightVariant(selected.start, selected.chainId);
          }
        } else if ("cifUrl" in selected) {
          if (params.zoom) {
            await viewer.zoomToVariant(aaPosition);
          } else if (params.pocket) {
            const pocketMatch = params.pocket.match(/^p(\d+)$/i);
            if (pocketMatch) {
              const pocketId = parseInt(pocketMatch[1]);
              const pocket = pocketData.find(p => p.pocketId === pocketId);
              if (pocket) {
                await viewer.highlightPocket(aaPosition, pocket.resid, pocketColouring);
                setViewerMode(`pocket:${pocket.pocketId}`);
              }
            }
          } else {
            await viewer.highlightVariant(aaPosition);
          }
        } else if ("a" in selected && "b" in selected) {
          const protChain = selected.a === isoFormAccession ? "A" : "B";
          if (params.zoom) {
            await viewer.zoomToVariant(aaPosition, protChain);
          } else if (params.interface) {
            await viewer.highlightInterface(selected.aresidues, selected.bresidues, aaPosition, protChain);
            setViewerMode("interface");
          } else {
            await viewer.highlightVariant(aaPosition, protChain);
          }
        }
      } catch (err) {
        console.error("Error applying URL actions:", err);
      }
    });
  }, [selected, urlParams, viewer, pdbeData, pocketData, pocketColouring, aaPosition, isoFormAccession]);

  // Select structure from URL or default (don't wait for viewer)
  useEffect(() => {
    if (isLoading || hasLoadedFromUrl.current) return;

    const params = urlParams.getParams();
    let structureToLoad: PdbeStructure | PredictedStructure | Interaction | null = null;
    let notFoundLabel: string | null = null; // set when a specific requested structure isn't in the data

    if (params.structureId) {
      const parts = params.structureId.split(":");
      const type = parts[0];
      const id = parts[1];

      switch (type) {
        case "pdb":
          if (id && id !== "default") {
            structureToLoad = pdbeData.find((d) => d.pdbId === id) || null;
            if (!structureToLoad) notFoundLabel = `PDB entry "${id.toUpperCase()}"`;
          } else {
            structureToLoad = pdbeData[0] || null;
          }
          if (structureToLoad) urlParams.clearIncompatibleActions("pdb");
          break;

        case "alphafill":
          structureToLoad = predictedData.find((p) => "modelEntityId" in p && p.modelEntityId.startsWith("AlphaFill-")) || null;
          if (!structureToLoad) notFoundLabel = `AlphaFill structure`;
          if (structureToLoad) urlParams.clearIncompatibleActions("alphafill");
          break;

        case "alphafold":
        case "prediction": // backward compat: old prediction/prediction:AlphaFill values
          structureToLoad = predictedData.find((p) => "uniprotAccession" in p) || predictedData[0] || null;
          if (structureToLoad) urlParams.clearIncompatibleActions("alphafold");
          break;

        case "interaction":
          if (id && id !== "default") {
            const [a, b] = id.split("_");
            structureToLoad = interactionData.find((i) => i.a === a && i.b === b) || null;
            if (!structureToLoad) notFoundLabel = `interaction "${id}"`;
          } else {
            structureToLoad = interactionData[0] || null;
          }
          if (structureToLoad) urlParams.clearIncompatibleActions("interaction");
          break;
      }

      if (notFoundLabel) {
        // Requested structure not in data — clear stale URL params and fall back to default
        urlParams.clearStructureParams();
        structureToLoad = pdbeData[0] || predictedData[0] || interactionData[0] || null;
        if (structureToLoad) {
          setUrlStructureWarning(`${notFoundLabel} was not found for this protein. Showing available structures instead.`);
          if ("pdbId" in structureToLoad) urlParams.clearIncompatibleActions("pdb");
          else if ("modelEntityId" in structureToLoad && (structureToLoad as any).modelEntityId?.startsWith("AlphaFill-"))
            urlParams.clearIncompatibleActions("alphafill");
          else if ("cifUrl" in structureToLoad) urlParams.clearIncompatibleActions("alphafold");
        } else {
          // Requested AND no fallback exists
          setUrlStructureWarning(`${notFoundLabel} was not found and no other structural data is available for this protein.`);
        }
      }
    } else {
      // Default selection when no structure parameter
      if (pdbeData.length > 0) {
        structureToLoad = pdbeData[0];
        urlParams.clearIncompatibleActions("pdb");
      } else if (predictedData.length > 0) {
        structureToLoad = predictedData[0];
        urlParams.clearIncompatibleActions("alphafold");
      }
    }

    if (structureToLoad) {
      hasLoadedFromUrl.current = true;
      setSelected(structureToLoad);
      if ("paeImageUrl" in structureToLoad) {
        setPaeUrl(structureToLoad.paeImageUrl);
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

  // PDB entry: tell the viewer every chain of its table row, so the variant
  // highlight colours them all. Also: a new structure starts without
  // confidence colouring (the adapter resets it on load too).
  useEffect(() => {
    setConfidenceColouring(false);
    setViewerMode("variant");
    setIsPaeOpen(false);
    if (selected && "pdbId" in selected) {
      viewer.setPdbChains(pdbeData
        .filter(d => d.pdbId === selected.pdbId)
        .sort((a, b) => a.chainId.localeCompare(b.chainId))
        .map(d => ({ chain: d.chainId, pos: d.start })));
    }
  }, [selected, pdbeData, viewer]);

  // Reset flags when data refetches (if user navigates to different variant)
  useEffect(() => {
    return () => {
      hasLoadedFromUrl.current = false;
      hasAppliedUrlActions.current = false;
    };
  }, [proteinStructureUri, isoFormAccession, aaPosition]);

  // Viewer controls for the selected structure: what to show (variant, a
  // chain, a pocket, the interface), interaction colouring, zoom and reset.
  const getViewerControls = () => {
    if (!selected) return null;
    const show = (id: string, label: string, apply: () => void): ViewerOption =>
      ({ id, label, onSelect: () => { setViewerMode(id); apply(); } });
    const segments: ViewerSegment[] = [];
    const toggles: ViewerToggle[] = [];
    let onZoom = () => {};
    let onReset = () => {};

    if ("pdbId" in selected) {
      const variant = () => viewer.highlightVariant(selected.start, selected.chainId);
      const chains = pdbeData.filter(d => d.pdbId === selected.pdbId);
      segments.push({ label: "Show", active: viewerMode, options: [
        show("variant", "Variant", () => { urlParams.updateActions({ chain: null, zoom: null }); variant(); }),
        ...chains.map(c => show(`chain:${c.chainId}`, `Chain ${c.chainId}`, () => {
          urlParams.updateActions({ chain: c.chainId, zoom: null });
          viewer.highlightChain(c.start, c.chainId);
        })),
      ]});
      onZoom = () => {
        if (viewerMode.startsWith("chain:")) {
          viewer.focus([{ chain: viewerMode.slice("chain:".length) }]);
        } else {
          urlParams.updateActions({ zoom: true, chain: null });
          viewer.zoomToVariant(selected.start, selected.chainId);
        }
      };
      onReset = () => { urlParams.updateActions({ chain: null, zoom: null }); viewer.resetDefault(selected.start, selected.chainId); };
    } else if ("cifUrl" in selected) {
      segments.push({ label: "Show", active: viewerMode, options: [
        show("variant", "Variant", () => { urlParams.updateActions({ pocket: null, zoom: null }); viewer.highlightVariant(aaPosition); }),
        ...pocketData.map(p => show(`pocket:${p.pocketId}`, `Pocket P${p.pocketId}`, () => {
          urlParams.updateActions({ pocket: `p${p.pocketId}`, zoom: null });
          viewer.highlightPocket(aaPosition, p.resid, pocketColouring);
        })),
      ]});
      // While a pocket is shown: colour its surface by hydrophobicity or charge
      const shownPocket = pocketData.find(p => viewerMode === `pocket:${p.pocketId}`);
      if (shownPocket) {
        const colourBy = (c: PocketColouring) => () => {
          setPocketColouring(c);
          viewer.highlightPocket(aaPosition, shownPocket.resid, c);
        };
        segments.push({ label: "Colour", active: pocketColouring, options: [
          { id: "hydrophobicity", label: "Hydro", title: "Pocket surface by hydrophobicity", onSelect: colourBy("hydrophobicity") },
          { id: "charge", label: "Charge", title: "Pocket surface by residue charge", onSelect: colourBy("charge") },
        ]});
      }
      if ("paeImageUrl" in selected && paeUrl) {
        toggles.push({ label: "PAE", icon: "grid-3x3", title: "Predicted Aligned Error",
          active: isPaeOpen, onToggle: () => setIsPaeOpen(open => !open) });
      }
      onZoom = () => {
        const pocket = pocketData.find(p => viewerMode === `pocket:${p.pocketId}`);
        if (pocket) {
          viewer.focus([{ residues: pocket.resid }]);
        } else {
          urlParams.updateActions({ zoom: true, pocket: null });
          viewer.zoomToVariant(aaPosition);
        }
      };
      onReset = () => { urlParams.updateActions({ pocket: null, zoom: null }); viewer.resetDefault(aaPosition); };
    } else if ("a" in selected && "b" in selected) {
      const protChain = selected.a === isoFormAccession ? "A" : "B";
      segments.push({ label: "Show", active: viewerMode, options: [
        show("variant", "Variant", () => { urlParams.updateActions({ interface: null, zoom: null }); viewer.highlightVariant(aaPosition, protChain); }),
        show("interface", "Interface", () => {
          urlParams.updateActions({ interface: true, zoom: null });
          viewer.highlightInterface(selected.aresidues, selected.bresidues, aaPosition, protChain);
        }),
      ]});
      // Protein/partner colouring or the model's AlphaFold pLDDT confidence
      const colour = (on: boolean) => async () => {
        if (on === confidenceColouring) return;
        setConfidenceColouring(on);
        setViewerMode("variant");
        urlParams.updateActions({ interface: null, zoom: null });
        await viewer.setConfidenceColouring(on);
        await viewer.highlightVariant(aaPosition, protChain);
      };
      segments.push({ label: "Colour", active: confidenceColouring ? "plddt" : "chains", options: [
        { id: "chains", label: "Chains", onSelect: colour(false) },
        { id: "plddt", label: "pLDDT", onSelect: colour(true) },
      ]});
      onZoom = () => {
        if (viewerMode === "interface") {
          viewer.focus([{ chain: "A", residues: selected.aresidues }, { chain: "B", residues: selected.bresidues }]);
        } else {
          urlParams.updateActions({ zoom: true, interface: null });
          viewer.zoomToVariant(aaPosition, protChain);
        }
      };
      onReset = () => { urlParams.updateActions({ interface: null, zoom: null }); viewer.resetDefault(aaPosition, protChain); };
    }

    const zoom = onZoom, reset = onReset;
    return (
      <ViewerControls
        segments={segments}
        toggles={toggles}
        onZoom={zoom}
        onReset={() => { setViewerMode("variant"); reset(); }}
      />
    );
  };

  // Colour key for what is on screen now (structure type + current view).
  const getLegendItems = (): LegendItem[] => {
    if (!selected) return [];
    const variant = { label: "Variant", swatch: css(VARIANT_COLOR) };
    const dim = (label: string) => ({ label, swatch: css(DIM_CHAIN_COLOR) });
    if ("pdbId" in selected) {
      const faded = { label: "Other chains (faded)", swatch: css(DIM_CHAIN_COLOR) };
      if (viewerMode.startsWith("chain:")) {
        const rowChains = pdbeData.filter(d => d.pdbId === selected.pdbId).length;
        return [
          variant,
          { label: `Chain ${viewerMode.slice("chain:".length)}`, swatch: css(PROTEIN_CHAIN_COLOR) },
          ...(rowChains > 1 ? [{ label: "Other protein chains", swatch: css(PDB_CHAIN_PALE) }] : []),
          faded,
        ];
      }
      return [
        variant,
        { label: "Protein chains", swatch: `linear-gradient(90deg, ${css(PDB_CHAIN_DARK)}, ${css(PDB_CHAIN_LIGHT)})` },
        faded,
      ];
    }
    if ("cifUrl" in selected) {
      if (!viewerMode.startsWith("pocket:")) return [variant];
      return pocketColouring === "charge"
        ? [variant,
           { label: "Positive", swatch: css(POSITIVE_COLOR) },
           { label: "Negative", swatch: css(NEGATIVE_COLOR) },
           { label: "Neutral", swatch: css(NEUTRAL_COLOR) }]
        : [variant,
           { label: "Hydrophilic → hydrophobic", swatch: `linear-gradient(90deg, ${css(HYDROPHILIC_COLOR)}, #ffffff, ${css(HYDROPHOBIC_COLOR)})` }];
    }
    if ("a" in selected && "b" in selected) {
      const partner = selected.a === isoFormAccession ? selected.b : selected.a;
      // Only what is on screen: the Interface view always uses protein/partner colours.
      if (viewerMode === "interface") {
        return [
          variant,
          { label: `${isoFormAccession} (protein)`, swatch: css(PROTEIN_CHAIN_COLOR) },
          dim(`${partner} (partner)`),
          { label: "Interface (protein)", swatch: css(INTERFACE_PROTEIN_COLOR) },
          { label: "Interface (partner)", swatch: css(INTERFACE_PARTNER_COLOR) },
        ];
      }
      return confidenceColouring ? [variant] : [
        variant,
        { label: `${isoFormAccession} (protein)`, swatch: css(PROTEIN_CHAIN_COLOR) },
        dim(`${partner} (partner)`),
      ];
    }
    return [variant];
  };

  if (isLoading) return <div className="annotation-loader"><Loader /></div>;
  if (!selected) return <NoAnnotationData message={urlStructureWarning ?? "No structural data available for this protein"} />;

  return (
    <div className="annotation-data-container">
          {/* Rich data: kept for now (the panel's heading is gone; the tab names the panel) */}
          <div className="annotation-intro">
            <span className="annotation-desc">Experimental and predicted structures</span>
            {dataRichness > 0.7 && (
              <span className="data-richness-badge" title={`Data richness: ${(dataRichness * 100).toFixed(0)}%`}><Icon name="check-circle-fill" /> Rich data</span>
            )}
          </div>
          {urlStructureWarning && (
            <div className="structure-url-notice">
              <Icon name="exclamation-triangle-fill" />
              {urlStructureWarning}
              <button className="structure-url-notice-close" onClick={() => setUrlStructureWarning(null)}>×</button>
            </div>
          )}
          {/* Content - Tables Left, Viewer Right */}
          <div className="annotation-content structure-layout">
            <div className="annotation-tables-column">
              <div className="structure-tables-stack">
                <div className="structure-type-section">
                  <PdbeStructures
                    isoFormAccession={isoFormAccession}
                    pdbeData={pdbeData}
                    selectedPdbId={"pdbId" in selected ? selected.pdbId : ""}
                    setSelected={setSelected}
                    viewer={viewer}
                    urlParams={urlParams}
                  />
                </div>
                {predictedData?.length > 0 && (
                  <div className="structure-type-section">
                    <PredictedStructures
                      isoFormAccession={isoFormAccession}
                      predictedStructureData={predictedData}
                      selectedPredictedStructure={"modelEntityId" in selected ? selected.modelEntityId : ""}
                      setSelected={(structure) => {
                        setSelected(structure);
                        if ("paeImageUrl" in structure) {
                          setPaeUrl(structure.paeImageUrl);
                        }
                      }}
                      aaPos={aaPosition}
                      pocketData={pocketData}
                      viewer={viewer}
                      urlParams={urlParams}
                    />
                  </div>
                )}
                {interactionData?.length > 0 && (
                  <div className="structure-type-section">
                    <InteractingStructures
                      isoFormAccession={isoFormAccession}
                      interactionData={interactionData}
                      selectedInteraction={"a" in selected && "b" in selected ? (selected.a + "_" + selected.b) : ""}
                      setSelected={(interaction) => {
                        setSelected(interaction);
                      }}
                      aaPos={aaPosition}
                      viewer={viewer}
                      urlParams={urlParams}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="annotation-viewer-column">
              <PdbeMolstar
                selected={selected}
                pdbeRef={viewerRef}
                legend={<ViewerLegend items={getLegendItems()} />}
                controls={getViewerControls()}
                overlay={<>
                  {isPaeOpen && paeUrl && "paeImageUrl" in selected &&
                    <PaeOverlay paeImageUrl={paeUrl} onClose={() => setIsPaeOpen(false)} />}
                  {("cifUrl" in selected
                    || ("a" in selected && "b" in selected && confidenceColouring && viewerMode !== "interface")) &&
                    <ConfidenceKey />}
                </>}
              />
            </div>
          </div>
    </div>
  );
}


export default StructureData;