import { useRef } from "react";
import { PvStructureViewer } from "./viewer/PvStructureViewer";
import { MolstarAdapter } from "./viewer/molstar/MolstarAdapter";

/**
 * The structure viewer for this component's lifetime. `viewerRef` goes on the
 * rendered viewer element (PdbeMolstar); everything else uses `viewer`.
 * Stable across renders, so it can sit in hook dependency lists.
 */
export function useStructureViewer() {
  const viewerRef = useRef<any>(null);
  const viewer = useRef<PvStructureViewer | null>(null);
  if (!viewer.current) viewer.current = new MolstarAdapter(viewerRef);
  return { viewer: viewer.current, viewerRef };
}
