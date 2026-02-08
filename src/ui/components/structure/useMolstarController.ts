import { useRef } from "react";
import { pdbSettings, afSettings, interactionSettings } from "./molstarSettings";
import {CYAN, MAGENTA, WHITE, YELLOW} from "../../../types/Colors";

const VARIANT_HIGHLIGHT_COLOR = YELLOW;
const CHAIN_HIGHLIGHT_COLOR = MAGENTA;
const POCKET_HIGHLIGHT_COLOR = MAGENTA;
const INTERFACE_A_HIGHLIGHT_COLOR = MAGENTA;
const INTERFACE_B_HIGHLIGHT_COLOR = CYAN;

export function useMolstarController() {
  const ref = useRef<any>(null);
  const loadCompleteSubscription = useRef<any>(null);

  // Safe wrapper for clearSelection - handles case where viewer isn't ready
  const safeClearSelection = async () => {
    try {
      await ref.current?.viewerInstance.visual.clearSelection();
    } catch (err) {
      // Viewer not fully ready - skip clearSelection
      // Selection will be overwritten by next select() call anyway
      console.debug('clearSelection skipped - viewer not ready');
    }
  };

  const update = async (opts: any) => {
    await safeClearSelection();
    await ref.current?.viewerInstance.visual.update(opts, true);
  };

  const executeWhenLoaded = async (action: () => Promise<void>) => {
    // Unsubscribe only OUR previous subscription, not all observers
    if (loadCompleteSubscription.current) {
      loadCompleteSubscription.current.unsubscribe();
      loadCompleteSubscription.current = null;
    }

    // Subscribe to loadComplete event and store the subscription
    loadCompleteSubscription.current = await ref.current?.viewerInstance.events.loadComplete.subscribe(async () => {
      try {
        await action();
      } catch (err) {
        console.error('Error executing action after load:', err);
      }
    });
  };

  const loadPdb = async (pdbId: string, pos: number, chain?: string) => {
    await update(pdbSettings(pdbId));
    await executeWhenLoaded(() => highlightVariant(pos, chain));
  };

  const loadAf = async (url: string, pos: number) => {
    await update(afSettings(url));
    await executeWhenLoaded(() => highlightVariant(pos));
  };

  const loadInteraction = async (url: string, pos: number, chain: string) => {
    await update(interactionSettings(url));
    await executeWhenLoaded(() => highlightVariant(pos, chain));
  };

  const highlightVariant = async (pos: number, chain?: string) => {
    await safeClearSelection();
    await ref.current?.viewerInstance.visual.select({
      data: [{
          start_residue_number: pos,
          end_residue_number: pos,
          color: VARIANT_HIGHLIGHT_COLOR,
          sideChain: true,
          ...(chain && { struct_asym_id: chain }),
        },
      ],
    });
  };

  // Includes variant highlight
  const highlightChain = async (pos: number, chain: string) => {
    await safeClearSelection();
    await ref.current?.viewerInstance.visual.select({
      data: [{
          struct_asym_id: chain,
          color: CHAIN_HIGHLIGHT_COLOR
        },{
          start_residue_number: pos,
          end_residue_number: pos,
          color: VARIANT_HIGHLIGHT_COLOR,
          sideChain: true,
          ...chain && {struct_asym_id: chain}
        }
      ],
      nonSelectedColor: WHITE
    })
  }

  // Includes variant highlight (spacefill)
  const highlightPocket = async (aaPos: number, pocketResids: number[]) => {
    await safeClearSelection();
    let d = pocketResids.filter((val) => val !== aaPos).map((p) => {
      return {
        start_residue_number: p,
        end_residue_number: p,
        sideChain: false,
        representation: 'spacefill',
        representationColor: POCKET_HIGHLIGHT_COLOR
      };
    }).concat({
        start_residue_number: aaPos,
        end_residue_number: aaPos,
        sideChain: true,
        representation: 'spacefill',
        representationColor: VARIANT_HIGHLIGHT_COLOR
      }
    )
    await ref.current?.viewerInstance.visual.select({
      data: d,
      nonSelectedColor: WHITE
    })
  }

  // Includes variant highlight (spacefill)
  const highlightInterface = async (aresids: number[], bresids: number[], pos: number, protChain: string) => {
    await safeClearSelection();
    await ref.current?.viewerInstance.visual.select({
      data: aresids.filter((val) => val !== pos).map((p) => {
        return {
          struct_asym_id: 'A',
          start_residue_number: p,
          end_residue_number: p,
          color: INTERFACE_A_HIGHLIGHT_COLOR,
          sideChain: false,
          representation: 'spacefill',
          representationColor: INTERFACE_A_HIGHLIGHT_COLOR
        };
      }).concat(bresids.filter((val) => val !== pos).map((p) => {
        return {
          struct_asym_id: 'B',
          start_residue_number: p,
          end_residue_number: p,
          color: INTERFACE_B_HIGHLIGHT_COLOR,
          sideChain: false,
          representation: 'spacefill',
          representationColor: INTERFACE_B_HIGHLIGHT_COLOR
        };
      })).concat(
        {
          struct_asym_id: protChain,
          start_residue_number: pos,
          end_residue_number: pos,
          color: VARIANT_HIGHLIGHT_COLOR,
          sideChain: true,
          representation: 'spacefill',
          representationColor: VARIANT_HIGHLIGHT_COLOR
        }
      ),
      nonSelectedColor: WHITE
    })
  }

  // Zooms to variant and highlights it (variant highlight is included)
  const zoomToVariant = async (pos: number, chain?: string) => {
    await safeClearSelection();
    await ref.current?.viewerInstance.visual.focus([{
      start_residue_number: pos,
      end_residue_number: pos,
      ...chain && {struct_asym_id: chain}
    }])
    await ref.current?.viewerInstance.visual.select({
      data: [{
        start_residue_number: pos,
        end_residue_number: pos,
        color: VARIANT_HIGHLIGHT_COLOR,
        sideChain: true,
        ...chain && {struct_asym_id: chain}
      }]
    })
  }

  const resetDefault = async (pos: number, chain?: string) => {
    await safeClearSelection();
    await ref.current?.viewerInstance.visual.reset({camera: true});
    await highlightVariant(pos, chain);
  }

  const reset = async () => {
    await ref.current?.viewerInstance.visual.reset({ camera: true });
  };

  return {
    ref,
    update,
    executeWhenLoaded,
    loadPdb,
    loadAf,
    loadInteraction,
    highlightVariant,
    highlightChain,
    highlightPocket,
    highlightInterface,
    zoomToVariant,
    resetDefault,
    reset
  };
}