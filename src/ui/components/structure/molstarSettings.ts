import { WHITE } from "../../../types/Colors";

export const baseSettings = {
  bgColor: WHITE,
  hideControls: true,
  hideWater: true,
};

export const pdbSettings = (pdbId: string) => ({
  ...baseSettings,
  moleculeId: pdbId,
});

export const afSettings = (url: string) => ({
  ...baseSettings,
  customData: { url, format: "cif" },
});

export const interactionSettings = (url: string) => ({
  ...baseSettings,
  customData: { url, format: "pdb" },
});
