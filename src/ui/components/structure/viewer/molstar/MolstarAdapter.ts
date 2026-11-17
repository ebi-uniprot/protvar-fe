import { MutableRefObject } from "react";
import { pdbSettings, afSettings, interactionSettings } from "./molstarSettings";
import {ChainPosition, PocketColouring, PvStructureViewer} from "../PvStructureViewer";
import {
  chainShades, DIM_CHAIN_COLOR, HYDROPHILIC_COLOR, HYDROPHOBIC_COLOR, INTERFACE_PARTNER_COLOR,
  INTERFACE_PROTEIN_COLOR, INTERFACE_SPHERE_SIZE, OTHER_CHAIN_OPACITY, PDB_CHAIN_PALE, POCKET_SURFACE_ALPHA, PROTEIN_CHAIN_COLOR,
  toHex, VARIANT_COLOR,
} from "../viewerColors";

type StructureKind = 'pdb' | 'alphafold' | 'interaction';

const variantResidue = (pos: number, chain?: string) => ({
  start_residue_number: pos,
  end_residue_number: pos,
  color: VARIANT_COLOR,
  sideChain: true,
  ...(chain && { struct_asym_id: chain }),
});

/** PvStructureViewer backed by the <pdbe-molstar> web component held in `ref`. */
export class MolstarAdapter implements PvStructureViewer {
  private loadCompleteSubscription: any = null;
  private pdbChains: ChainPosition[] = [];
  private confidenceColouring = false;

  constructor(private readonly ref: MutableRefObject<any>) {}

  private get viewer() {
    return this.ref.current?.viewerInstance;
  }

  /** What is loaded, from the settings it was loaded with. */
  private kind(): StructureKind | undefined {
    const p = this.viewer?.initParams;
    if (p?.moleculeId) return 'pdb';
    if (p?.customData?.format === 'cif') return 'alphafold';
    if (p?.customData?.format === 'pdb') return 'interaction';
    return undefined;
  }

  setPdbChains(chains: ChainPosition[]) {
    this.pdbChains = chains;
  }

  async setConfidenceColouring(on: boolean) {
    this.confidenceColouring = on;
    await this.applyBaseColouring();
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
        await this.applyBaseColouring();
        await action();
      } catch (err) {
        console.error('Error executing action after load:', err);
      }
    });
  }

  /**
   * Base colour of the protein chains, under the highlights. PDB entries and
   * interaction models: dimmed grey, so the highlights (row chains, protein
   * chain, variant) stand out; ligands keep their element colours. AlphaFold
   * models, and interaction models with confidence colouring on: pLDDT.
   */
  private async applyBaseColouring() {
    const v = this.viewer;
    const kind = this.kind();
    if (!v || !kind || kind === 'alphafold') return;
    const theme = kind === 'interaction' && this.confidenceColouring
      ? { color: 'plddt-confidence' }
      : { color: 'uniform', colorParams: { value: toHex(DIM_CHAIN_COLOR) } };
    const groups: any[][] = v.plugin.managers.structure.hierarchy.currentComponentGroups;
    for (const g of groups) {
      if (g[0]?.key?.includes('polymer')) {
        await v.plugin.managers.structure.component.updateRepresentationsTheme(g, theme);
      }
    }
  }

  /**
   * The variant highlight for what is loaded. PDB entry: every chain of the
   * table row in shades of blue, the variant on each. Interaction model: the
   * protein's chain (A or B, the one the variant is on) in blue, unless
   * confidence colouring is on. AlphaFold: just the variant.
   */
  private variantSelection(pos: number, chain?: string) {
    const kind = this.kind();
    if (kind === 'pdb' && this.pdbChains.length > 0) {
      const shades = chainShades(this.pdbChains.length);
      return [
        ...this.pdbChains.map((c, i) => ({ struct_asym_id: c.chain, color: shades[i], opacity: 1 })),
        ...this.pdbChains.map((c) => variantResidue(c.pos, c.chain)),
      ];
    }
    if (kind === 'interaction' && chain && !this.confidenceColouring) {
      return [{ struct_asym_id: chain, color: PROTEIN_CHAIN_COLOR }, variantResidue(pos, chain)];
    }
    return [variantResidue(pos, chain)];
  }

  // Subscribe BEFORE update(): visual.update resolves only after the load, so
  // loadComplete has already fired by then (to the previous structure's
  // action, e.g. the last row's chain).
  async loadPdb(pdbId: string, pos: number, chain?: string) {
    await this.executeWhenLoaded(() => this.highlightVariant(pos, chain));
    await this.update(pdbSettings(pdbId));
  }

  async loadAf(url: string, pos: number) {
    await this.executeWhenLoaded(() => this.highlightVariant(pos));
    await this.update(afSettings(url));
  }

  async loadInteraction(url: string, pos: number, chain: string) {
    this.confidenceColouring = false;
    await this.executeWhenLoaded(() => this.highlightVariant(pos, chain));
    await this.update(interactionSettings(url));
  }

  /**
   * select(), plus for PDB entries: chains not in the table row (other
   * proteins) faded, ligands kept solid. Row chains in `data` carry opacity 1.
   */
  private async select(data: any[]) {
    if (this.kind() !== 'pdb') {
      await this.viewer?.visual.select({ data });
      return;
    }
    const ligands = this.ligandAsymIds().map((id) => ({ struct_asym_id: id, color: null, opacity: 1 }));
    await this.viewer?.visual.select({ data: [...ligands, ...data], nonSelectedOpacity: OTHER_CHAIN_OPACITY });
  }

  /** label_asym_ids of the non-polymer entities (ligands, sugars) in the loaded structure. */
  private ligandAsymIds(): string[] {
    const structure = this.viewer?.plugin.managers.structure.hierarchy.current.structures[0]?.cell.obj?.data;
    const model = structure?.models?.[0];
    if (!model) return [];
    const { chains } = model.atomicHierarchy;
    const ids = new Set<string>();
    for (let i = 0; i < chains._rowCount; i++) {
      const entityIdx = model.entities.getEntityIndex(chains.label_entity_id.value(i));
      const type = model.entities.data.type.value(entityIdx);
      if (type === 'non-polymer' || type === 'branched') ids.add(chains.label_asym_id.value(i));
    }
    return Array.from(ids);
  }

  async highlightVariant(pos: number, chain?: string) {
    await this.safeClearSelection();
    await this.select(this.variantSelection(pos, chain));
  }

  // One chain of the PDB entry in focus (blue) with the variant; the row's
  // other chains pale blue (still the protein); other proteins faded.
  async highlightChain(pos: number, chain: string) {
    await this.safeClearSelection();
    await this.select([
      ...this.pdbChains.filter((c) => c.chain !== chain)
        .map((c) => ({ struct_asym_id: c.chain, color: PDB_CHAIN_PALE, opacity: 1 })),
      { struct_asym_id: chain, color: PROTEIN_CHAIN_COLOR, opacity: 1 },
      variantResidue(pos, chain),
    ]);
  }

  async focus(targets: { chain?: string; residues?: number[] }[]) {
    const params = targets.flatMap((t) => t.residues
      ? t.residues.map((r) => ({ start_residue_number: r, end_residue_number: r, ...(t.chain && { struct_asym_id: t.chain }) }))
      : [{ ...(t.chain && { struct_asym_id: t.chain }) }]);
    if (params.length > 0) await this.viewer?.visual.focus(params);
  }

  /**
   * The pocket as a translucent molecular surface coloured by residue
   * hydrophobicity or charge (the variant's own patch magenta, its side chain
   * inside), over the model's pLDDT-coloured cartoon.
   */
  async highlightPocket(aaPos: number, pocketResids: number[], colouring: PocketColouring = 'hydrophobicity') {
    await this.safeClearSelection();
    await this.viewer?.visual.select({
      data: [
        // no representationColor: the surface takes the colour theme set below
        ...pocketResids.filter((p) => p !== aaPos).map((p) => ({
          start_residue_number: p, end_residue_number: p, color: null, representation: 'molecular-surface',
        })),
        ...(pocketResids.includes(aaPos) ? [{
          start_residue_number: aaPos, end_residue_number: aaPos, color: null,
          representation: 'molecular-surface', representationColor: VARIANT_COLOR,
        }] : []),
        variantResidue(aaPos),
      ],
    });
    await this.updateAddedRepresentations('molecular-surface', { alpha: POCKET_SURFACE_ALPHA }, colouring === 'charge'
      ? { name: 'residue-charge' }
      : { name: 'hydrophobicity', params: { list: { kind: 'interpolate', colors: [toHex(HYDROPHILIC_COLOR), 0xffffff, toHex(HYDROPHOBIC_COLOR)] } } });
  }

  /**
   * select() can't set opacity, size or a colour theme on the representations
   * it adds; set them afterwards on every representation of `reprType`. The
   * theme's other params come from its defaults.
   */
  private async updateAddedRepresentations(reprType: string, typeParams: object, colorTheme?: { name: string, params?: object }) {
    const plugin = this.viewer?.plugin;
    if (!plugin) return;
    let theme: any;
    if (colorTheme) {
      const provider = plugin.representation.structure.themes.colorThemeRegistry.get(colorTheme.name);
      const defs = provider.getParams({});
      const defaults = Object.fromEntries(Object.entries(defs).map(([k, d]: [string, any]) => [k, d.defaultValue]));
      theme = { name: colorTheme.name, params: { ...defaults, ...colorTheme.params } };
    }
    const update = plugin.build();
    plugin.state.data.cells.forEach((cell: any) => {
      const t = cell.transform;
      if (t.transformer.id.endsWith('structure-representation-3d') && t.params?.type?.name === reprType) {
        update.to(t.ref).update((old: any) => ({
          ...old,
          type: { ...old.type, params: { ...old.type.params, ...typeParams } },
          ...(theme && { colorTheme: theme }),
        }));
      }
    });
    await update.commit();
  }

  /**
   * Protein chain blue, partner grey, and the interface residues on each as
   * spheres (75% size) in a darker shade of that chain's colour, the variant
   * in magenta; the protein can be chain A or B.
   */
  async highlightInterface(aresids: number[], bresids: number[], pos: number, protChain: string) {
    await this.safeClearSelection();
    const partnerChain = protChain === 'A' ? 'B' : 'A';
    const side = (chain: string, resids: number[]) => {
      const isProtein = chain === protChain;
      const color = isProtein ? INTERFACE_PROTEIN_COLOR : INTERFACE_PARTNER_COLOR;
      return resids
        .filter((p) => !(isProtein && p === pos))   // the variant residue is drawn separately
        .map((p) => ({
          struct_asym_id: chain, start_residue_number: p, end_residue_number: p, color,
          representation: 'spacefill', representationColor: color,
        }));
    };
    await this.viewer?.visual.select({
      data: [
        { struct_asym_id: protChain, color: PROTEIN_CHAIN_COLOR },
        { struct_asym_id: partnerChain, color: DIM_CHAIN_COLOR },
        ...side('A', aresids),
        ...side('B', bresids),
        { ...variantResidue(pos, protChain), representation: 'spacefill', representationColor: VARIANT_COLOR },
      ],
    })
    await this.updateAddedRepresentations('spacefill', { sizeFactor: INTERFACE_SPHERE_SIZE });
  }

  // Zooms to variant and highlights it (variant highlight is included)
  async zoomToVariant(pos: number, chain?: string) {
    await this.safeClearSelection();
    await this.viewer?.visual.focus([{
      start_residue_number: pos,
      end_residue_number: pos,
      ...chain && {struct_asym_id: chain}
    }])
    await this.select(this.variantSelection(pos, chain))
  }

  async resetDefault(pos: number, chain?: string) {
    await this.safeClearSelection();
    await this.viewer?.visual.reset({camera: true});
    await this.highlightVariant(pos, chain);
  }
}
