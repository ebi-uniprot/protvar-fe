// filterConstants.ts
//import {CaddCategory} from "../../../types/CaddCategory";
import {AmClass} from "../../../types/AmClass";

// Backend categories (what API expects)
/*const BACKEND_CADD_CATEGORIES = [
  { label: "Likely Benign (<15.0)", value: CaddCategory.LIKELY_BENIGN },
  { label: "Potentially Deleterious (15.0–19.9)", value: CaddCategory.POTENTIALLY_DELETERIOUS },
  { label: "Quite Likely Deleterious (20.0–24.9)", value: CaddCategory.QUITE_LIKELY_DELETERIOUS },
  { label: "Probably Deleterious (25.0–29.9)", value: CaddCategory.PROBABLY_DELETERIOUS },
  { label: "Highly Likely Deleterious (>29.9)", value: CaddCategory.HIGHLY_LIKELY_DELETERIOUS },
];*/

// UI categories (simplified for user experience)
export const CADD_CATEGORIES = [
  { value: 'low', label: '< 15' },      // Maps to LIKELY_BENIGN
  { value: 'medium', label: '15-25' },  // Maps to POTENTIALLY + QUITE_LIKELY
  { value: 'high', label: '> 25' }      // Maps to PROBABLY + HIGHLY_LIKELY
];

export const VALID_CADD_VALUES = CADD_CATEGORIES.map(cat => cat.value);

// Backend and UI AlphaMissense values are the same
export const ALPHAMISSENSE_CATEGORIES = [
  { value: AmClass.BENIGN, label: 'Benign' },
  { value: AmClass.AMBIGUOUS, label: 'Ambiguous' },
  { value: AmClass.PATHOGENIC, label: 'Pathogenic' }
];

export const VALID_AM_VALUES = ALPHAMISSENSE_CATEGORIES.map(cat => cat.value);

// UI stability categories
export const STABILITY_CATEGORIES = [
  { value: 'destabilizing', label: 'Likely Destabilizing' }, // Maps to LIKELY_DESTABILISING
  { value: 'stable', label: 'Unlikely to Destabilize' }      // Maps to UNLIKELY_DESTABILISING
];

export const VALID_STABILITY_VALUES = STABILITY_CATEGORIES.map(cat => cat.value);

export const VALID_POPEVE_VALUES = ['severe', 'moderate', 'unlikely'];

export const POPEVE_CATEGORIES = [
  { value: 'severe', label: 'Severe' },
  { value: 'moderate', label: 'Moderately Deleterious' },
  { value: 'unlikely', label: 'Unlikely Deleterious' }
];