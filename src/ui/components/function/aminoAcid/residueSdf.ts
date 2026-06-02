/**
 * Static map of three-letter residue code -> bundled ideal-coordinate SDF URL.
 * The SDFs (RCSB `{CODE}_ideal.sdf`) are committed under src/assets/aa-sdf and
 * emitted as asset URLs by the bundler, so there is no runtime fetch to RCSB.
 */
import ALA from '../../../../assets/aa-sdf/ALA.sdf';
import ARG from '../../../../assets/aa-sdf/ARG.sdf';
import ASN from '../../../../assets/aa-sdf/ASN.sdf';
import ASP from '../../../../assets/aa-sdf/ASP.sdf';
import CYS from '../../../../assets/aa-sdf/CYS.sdf';
import GLN from '../../../../assets/aa-sdf/GLN.sdf';
import GLU from '../../../../assets/aa-sdf/GLU.sdf';
import GLY from '../../../../assets/aa-sdf/GLY.sdf';
import HIS from '../../../../assets/aa-sdf/HIS.sdf';
import ILE from '../../../../assets/aa-sdf/ILE.sdf';
import LEU from '../../../../assets/aa-sdf/LEU.sdf';
import LYS from '../../../../assets/aa-sdf/LYS.sdf';
import MET from '../../../../assets/aa-sdf/MET.sdf';
import PHE from '../../../../assets/aa-sdf/PHE.sdf';
import PRO from '../../../../assets/aa-sdf/PRO.sdf';
import SER from '../../../../assets/aa-sdf/SER.sdf';
import THR from '../../../../assets/aa-sdf/THR.sdf';
import TRP from '../../../../assets/aa-sdf/TRP.sdf';
import TYR from '../../../../assets/aa-sdf/TYR.sdf';
import VAL from '../../../../assets/aa-sdf/VAL.sdf';

const RESIDUE_SDF_URL: Record<string, string> = {
  ALA, ARG, ASN, ASP, CYS, GLN, GLU, GLY, HIS, ILE,
  LEU, LYS, MET, PHE, PRO, SER, THR, TRP, TYR, VAL,
};

/** Returns the bundled SDF URL for a 3-letter residue code (any case), or undefined. */
export function residueSdfUrl(code3?: string | null): string | undefined {
  if (!code3) return undefined;
  return RESIDUE_SDF_URL[code3.toUpperCase()];
}

/** True only for the 20 standard residues we have a structure for (excludes Ter/stop). */
export function hasResidueSdf(code3?: string | null): boolean {
  return residueSdfUrl(code3) !== undefined;
}
