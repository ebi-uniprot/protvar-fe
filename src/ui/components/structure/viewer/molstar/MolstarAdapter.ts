import { MutableRefObject } from "react";
import { pdbSettings, afSettings, interactionSettings } from "./molstarSettings";
import {CYAN, MAGENTA, WHITE, YELLOW} from "../../../../../types/Colors";
import {PvStructureViewer} from "../PvStructureViewer";

const VARIANT_HIGHLIGHT_COLOR = YELLOW;
const CHAIN_HIGHLIGHT_COLOR = MAGENTA;
const POCKET_HIGHLIGHT_COLOR = MAGENTA;
const INTERFACE_A_HIGHLIGHT_COLOR = MAGENTA;
const INTERFACE_B_HIGHLIGHT_COLOR = CYAN;

/** PvStructureViewer backed by the <pdbe-molstar> web component held in `ref`. */
export class MolstarAdapter implements PvStructureViewer {
  private loadCompleteSubscription: any = null;

  constructor(private readonly ref: MutableRefObject<any>) {}

  private get viewer() {
    return this.ref.current?.viewerInstance;
  }

  // Safe wrapper for clearSelection - handles case where viewer isn't ready
  private async safeClearSelection() {
    try {
      await this.viewer?.visual.clearSelection();
    } catch (err) {
      // Viewer not fully ready - skip clearSelection
      // Selection will be overwritten by next select() call anyway
      console.debug('clearSelection skipped - viewer not ready');
    }
  }

  private async update(opts: any) {
    await this.safeClearSelection();
    await this.viewer?.visual.update(opts, true);
  }

  async executeWhenLoaded(action: () => Promise<void>) {
    // Unsubscribe only OUR previous subscription, not all observers
    if (this.loadCompleteSubscription) {
      this.loadCompleteSubscription.unsubscribe();
      this.loadCompleteSubscription = null;
    }

    // Subscribe to loadComplete event and store the subscription
    this.loadCompleteSubscription = await this.viewer?.events.loadComplete.subscribe(async () => {
      try {
        await action();
      } catch (err) {
        console.error('Error executing action after load:', err);
      }
    });
  }

  async loadPdb(pdbId: string, pos: number, chain?: string) {
    await this.update(pdbSettings(pdbId));
    await this.executeWhenLoaded(() => this.highlightVariant(pos, chain));
  }

  async loadAf(url: string, pos: number) {
    await this.update(afSettings(url));
    await this.executeWhenLoaded(() => this.highlightVariant(pos));
  }

  async loadInteraction(url: string, pos: number, chain: string) {
    await this.update(interactionSettings(url));
    await this.executeWhenLoaded(() => this.highlightVariant(pos, chain));
  }

  async highlightVariant(pos: number, chain?: string) {
    await this.safeClearSelection();
    await this.viewer?.visual.select({
      data: [{
          start_residue_number: pos,
          end_residue_number: pos,
          color: VARIANT_HIGHLIGHT_COLOR,
          sideChain: true,
          ...(chain && { struct_asym_id: chain }),
        },
      ],
    });
  }

  // Includes variant highlight
  async highlightChain(pos: number, chain: string) {
    await this.safeClearSelection();
    await this.viewer?.visual.select({
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
  async highlightPocket(aaPos: number, pocketResids: number[]) {
    await this.safeClearSelection();
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
    await this.viewer?.visual.select({
      data: d,
      nonSelectedColor: WHITE
    })
  }

  // Includes variant highlight (spacefill)
  async highlightInterface(aresids: number[], bresids: number[], pos: number, protChain: string) {
    await this.safeClearSelection();
    await this.viewer?.visual.select({
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
  async zoomToVariant(pos: number, chain?: string) {
    await this.safeClearSelection();
    await this.viewer?.visual.focus([{
      start_residue_number: pos,
      end_residue_number: pos,
      ...chain && {struct_asym_id: chain}
    }])
    await this.viewer?.visual.select({
      data: [{
        start_residue_number: pos,
        end_residue_number: pos,
        color: VARIANT_HIGHLIGHT_COLOR,
        sideChain: true,
        ...chain && {struct_asym_id: chain}
      }]
    })
  }

  async resetDefault(pos: number, chain?: string) {
    await this.safeClearSelection();
    await this.viewer?.visual.reset({camera: true});
    await this.highlightVariant(pos, chain);
  }

  async reset() {
    await this.viewer?.visual.reset({ camera: true });
  }
}
