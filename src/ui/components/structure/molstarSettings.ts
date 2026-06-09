import { viewerBgColor } from "../../../types/Colors";

// Computed per call so the background follows the active theme (a structure
// reload re-applies these settings).
const baseSettings = () => ({
  bgColor: viewerBgColor(),
  hideControls: true,
  hideWater: true,
});

export const pdbSettings = (pdbId: string) => ({
  ...baseSettings(),
  moleculeId: pdbId,
});

export const afSettings = (url: string) => ({
  ...baseSettings(),
  customData: { url, format: "cif" },
});

export const interactionSettings = (url: string) => ({
  ...baseSettings(),
  customData: { url, format: "pdb" },
});
