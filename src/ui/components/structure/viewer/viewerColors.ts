/**
 * ProtVar's structure-viewer palette: what the viewer paints and what the
 * legend shows. Library-neutral ({r,g,b}); the adapter maps it onto the 3D lib.
 */
export type RGB = {r: number, g: number, b: number};

/** The variant residue. Magenta: unused by every other colouring (chains, pLDDT, hydrophobicity, charge). */
export const VARIANT_COLOR: RGB = {r: 214, g: 36, b: 159};
/** Mol*'s hover highlight: green, used by no other colouring, so it isn't mistaken for the variant. */
export const HOVER_COLOR: RGB = {r: 34, g: 197, b: 94};
/** Interaction interface residues: a darker shade of each chain's own colour (protein blue, partner grey). */
export const INTERFACE_PROTEIN_COLOR: RGB = {r: 44, g: 82, b: 145};
export const INTERFACE_PARTNER_COLOR: RGB = {r: 138, g: 144, b: 155};
/** Interface residues are drawn as spheres at this fraction of full size (the fold shows between them). */
export const INTERFACE_SPHERE_SIZE = 0.75;
/** Pocket surface opacity (the cartoon and variant show through). */
export const POCKET_SURFACE_ALPHA = 0.75;
/** Pocket surface by hydrophobicity: hydrophilic -> neutral -> hydrophobic. */
export const HYDROPHILIC_COLOR: RGB = {r: 30, g: 144, b: 255};
export const HYDROPHOBIC_COLOR: RGB = {r: 208, g: 140, b: 0};
/** Pocket surface by charge (Mol*'s residue-charge colours). */
export const POSITIVE_COLOR: RGB = {r: 0, g: 0, b: 255};
export const NEGATIVE_COLOR: RGB = {r: 255, g: 0, b: 0};
export const NEUTRAL_COLOR: RGB = {r: 255, g: 255, b: 255};
/** The variant's protein chain (interaction models, one chain picked in a PDB entry). */
export const PROTEIN_CHAIN_COLOR: RGB = {r: 74, g: 127, b: 193};
/** PDB entries: the row's chains as shades of the same blue, darkest first. */
export const PDB_CHAIN_DARK: RGB = {r: 47, g: 74, b: 128};
export const PDB_CHAIN_LIGHT: RGB = {r: 143, g: 176, b: 224};
/** PDB entries, one chain picked: the row's other chains, still the protein but not the focus. */
export const PDB_CHAIN_PALE: RGB = {r: 196, g: 213, b: 238};
/** PDB entries: chains not in the table row (other proteins) are faded to this opacity; ligands stay solid. */
export const OTHER_CHAIN_OPACITY = 0.3;
/** Everything else (other chains, the interacting partner): dimmed. */
export const DIM_CHAIN_COLOR: RGB = {r: 200, g: 204, b: 212};

export const css = (c: RGB) => `rgb(${c.r}, ${c.g}, ${c.b})`;
export const toHex = (c: RGB) => (c.r << 16) | (c.g << 8) | c.b;

/** n shades between PDB_CHAIN_DARK and PDB_CHAIN_LIGHT (one chain: PROTEIN_CHAIN_COLOR). */
export function chainShades(n: number): RGB[] {
  if (n <= 1) return [PROTEIN_CHAIN_COLOR];
  const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  return Array.from({length: n}, (_, i) => {
    const t = i / (n - 1);
    return {
      r: mix(PDB_CHAIN_DARK.r, PDB_CHAIN_LIGHT.r, t),
      g: mix(PDB_CHAIN_DARK.g, PDB_CHAIN_LIGHT.g, t),
      b: mix(PDB_CHAIN_DARK.b, PDB_CHAIN_LIGHT.b, t),
    };
  });
}
