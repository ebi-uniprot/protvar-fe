/**
 * Library-neutral contract for the structure viewer. Tables and StructureData
 * talk to this, never to the underlying 3D library, so the implementation
 * (currently pdbe-molstar, see molstar/MolstarAdapter) can be swapped.
 *
 * Residue positions and chains are in the numbering of the loaded model:
 * label_seq_id / label_asym_id (struct_asym_id) for PDB entries, UniProt
 * position for AlphaFold models, chains "A"/"B" for interaction models.
 */
export interface PvStructureViewer {
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
  highlightPocket(aaPos: number, pocketResids: number[]): Promise<void>;
  /** Highlights both sides of the interface and the variant residue (spacefill). */
  highlightInterface(aresids: number[], bresids: number[], pos: number, protChain: string): Promise<void>;
  /** Focuses the camera on the variant residue and highlights it. */
  zoomToVariant(pos: number, chain?: string): Promise<void>;
  /** Resets the camera and re-applies the default variant highlight. */
  resetDefault(pos: number, chain?: string): Promise<void>;
  reset(): Promise<void>;
}
