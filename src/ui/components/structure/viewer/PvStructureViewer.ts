/**
 * Library-neutral contract for the structure viewer. Tables and StructureData
 * talk to this, never to the underlying 3D library, so the implementation
 * (currently pdbe-molstar, see molstar/MolstarAdapter) can be swapped.
 *
 * Residue positions and chains are in the numbering of the loaded model:
 * label_seq_id / label_asym_id (struct_asym_id) for PDB entries, UniProt
 * position for AlphaFold models, chains "A"/"B" for interaction models.
 */
/** How a pocket's surface is coloured: residue hydrophobicity or residue charge. */
export type PocketColouring = 'hydrophobicity' | 'charge';

/** A chain and the variant's residue number in it. */
export interface ChainPosition {
  chain: string;
  pos: number;
}

export interface PvStructureViewer {
  /**
   * The chains of the selected PDB entry that map to the protein (the table
   * row's chains); the variant highlight colours all of them.
   */
  setPdbChains(chains: ChainPosition[]): void;
  /** Interaction models: switch between protein/partner and AlphaFold pLDDT colouring. */
  setConfidenceColouring(on: boolean): Promise<void>;

  /** Load a PDB entry, then highlight the variant residue. */
  loadPdb(pdbId: string, pos: number, chain?: string): Promise<void>;
  /** Load an AlphaFold (mmCIF) model by URL, then highlight the variant residue. */
  loadAf(url: string, pos: number): Promise<void>;
  /** Load a predicted interaction (PDB) model by URL, then highlight the variant residue. */
  loadInteraction(url: string, pos: number, chain: string): Promise<void>;
  /** Run an action once the current structure has finished loading (replaces any pending one). */
  executeWhenLoaded(action: () => Promise<void>): Promise<void>;

  highlightVariant(pos: number, chain?: string): Promise<void>;
  /** Highlights the chain and the variant residue. */
  highlightChain(pos: number, chain: string): Promise<void>;
  /** Highlights the pocket residues and the variant residue (spacefill). */
  highlightPocket(aaPos: number, pocketResids: number[], colouring?: PocketColouring): Promise<void>;
  /** Highlights both sides of the interface and the variant residue (spacefill). */
  highlightInterface(aresids: number[], bresids: number[], pos: number, protChain: string): Promise<void>;
  /** Focuses the camera on the variant residue and highlights it. */
  zoomToVariant(pos: number, chain?: string): Promise<void>;
  /**
   * Focuses the camera on parts of the structure, without changing the
   * highlight: a whole chain (no residues) or the given residues of a chain.
   */
  focus(targets: { chain?: string; residues?: number[] }[]): Promise<void>;
  /** Resets the camera and re-applies the default variant highlight. */
  resetDefault(pos: number, chain?: string): Promise<void>;
}
