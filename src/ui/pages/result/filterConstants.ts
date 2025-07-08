// filterConstants.ts

import {CaddCategory} from "../../../types/CaddCategory";
import {AmClass} from "../../../types/AmClass";

export const CADD_CATEGORIES = [
  { label: "Likely Benign (<15.0)", value: CaddCategory.LIKELY_BENIGN },
  { label: "Potentially Deleterious (15.0–19.9)", value: CaddCategory.POTENTIALLY_DELETERIOUS },
  { label: "Quite Likely Deleterious (20.0–24.9)", value: CaddCategory.QUITE_LIKELY_DELETERIOUS },
  { label: "Probably Deleterious (25.0–29.9)", value: CaddCategory.PROBABLY_DELETERIOUS },
  { label: "Highly Likely Deleterious (>29.9)", value: CaddCategory.HIGHLY_LIKELY_DELETERIOUS },
];

export const ALPHAMISSENSE_CATEGORIES = [
  { label: "Benign", value: AmClass.BENIGN },
  { label: "Ambiguous", value: AmClass.AMBIGUOUS },
  { label: "Pathogenic", value: AmClass.PATHOGENIC },
];

export const VALID_CADD_VALUES = Object.values(CaddCategory).map((v) => v.toLowerCase());
export const VALID_AM_VALUES = Object.values(AmClass).map((v) => v.toLowerCase());