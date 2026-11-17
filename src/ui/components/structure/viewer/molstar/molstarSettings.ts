import { viewerBgColor } from "../../../../../types/Colors";
import { HOVER_COLOR } from "../viewerColors";

// Computed per call so the background follows the active theme (a structure
// reload re-applies these settings).
const baseSettings = () => ({
  bgColor: viewerBgColor(),
  highlightColor: HOVER_COLOR,
  hideControls: true,
  hideStructure: ["water"],
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
