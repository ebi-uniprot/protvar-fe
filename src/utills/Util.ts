import { AMINO_ACID_FULL_NAME } from "../constants/Protein";

export const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

export const fullAminoAcidName = (key: string | undefined | null) => {
  if (!key)
    return ""
  return AMINO_ACID_FULL_NAME.get(key.toLowerCase())
}