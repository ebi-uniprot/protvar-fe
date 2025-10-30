// filterUtils.ts
import {
  VALID_CADD_VALUES,
  VALID_AM_VALUES,
  VALID_POPEVE_VALUES,
  VALID_STABILITY_VALUES,
  VALID_ALLELE_FREQ_VALUES
} from "./filterConstants";
import { SearchFilterParams } from "./SearchFilters";
import { CaddCategory } from "../../../types/CaddCategory";
import { StabilityChange } from "../../../types/StabilityChange";
import { PopEveClass } from "../../../types/PopEveClass";
import { AlleleFreqCategory } from "../../../types/AlleleFreqCategory";

export const normalizeFilterValues = (selected: string[], valid: string[]): string[] => {
  const validSet = new Set(valid);
  return selected.map(v => v.toLowerCase()).filter(v => validSet.has(v));
};

const parseBooleanParam = (searchParams: URLSearchParams, key: string): boolean | undefined => {
  return ["true", "1"].includes(searchParams.get(key) || "") ? true : undefined;
};

const parseNumberParam = (searchParams: URLSearchParams, key: string): number | undefined => {
  const value = searchParams.get(key);
  if (value === null) return undefined;
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
};

const parseVariantParam = (searchParams: URLSearchParams): 'known' | 'potential' | undefined => {
  const value = searchParams.get("variant");
  if (value === 'known' || value === 'potential') return value;
  return undefined;
};

// Extract filters from URL - NOW MUCH SIMPLER! Property names match URL params exactly
export const extractFilters = (searchParams: URLSearchParams): SearchFilterParams => ({
  // Variant Type
  variant: parseVariantParam(searchParams),

  // Functional
  ptm: parseBooleanParam(searchParams, "ptm"),
  mutagen: parseBooleanParam(searchParams, "mutagen"),
  consMin: parseNumberParam(searchParams, "consMin"),
  consMax: parseNumberParam(searchParams, "consMax"),
  domain: parseBooleanParam(searchParams, "domain"),

  // Population
  disease: parseBooleanParam(searchParams, "disease"),
  freq: normalizeFilterValues(searchParams.getAll("freq"), VALID_ALLELE_FREQ_VALUES),

  // Structural
  expModel: parseBooleanParam(searchParams, "expModel"),
  interact: parseBooleanParam(searchParams, "interact"),
  pocket: parseBooleanParam(searchParams, "pocket"),
  stability: normalizeFilterValues(searchParams.getAll("stability"), VALID_STABILITY_VALUES),

  // Consequence
  cadd: normalizeFilterValues(searchParams.getAll("cadd"), VALID_CADD_VALUES),
  am: normalizeFilterValues(searchParams.getAll("am"), VALID_AM_VALUES),
  popeve: normalizeFilterValues(searchParams.getAll("popeve"), VALID_POPEVE_VALUES),
  esmMin: parseNumberParam(searchParams, "esmMin"),
  esmMax: parseNumberParam(searchParams, "esmMax"),

  // Sorting
  sort: searchParams.get("sort") || undefined,
  order: (searchParams.get("order") as "asc" | "desc") || undefined,
});

// Build URL params from filters - NOW MUCH SIMPLER! Direct 1:1 mapping
export const buildFilterParams = (filters: SearchFilterParams): URLSearchParams => {
  const params = new URLSearchParams();

  // Variant Type
  if (filters.variant) params.set("variant", filters.variant);

  // Functional
  if (filters.ptm === true) params.set("ptm", "true");
  if (filters.mutagen === true) params.set("mutagen", "true");
  if (filters.consMin !== undefined) params.set("consMin", filters.consMin.toString());
  if (filters.consMax !== undefined) params.set("consMax", filters.consMax.toString());
  if (filters.domain === true) params.set("domain", "true");

  // Population
  if (filters.disease === true) params.set("disease", "true");
  const normalizedFreq = normalizeFilterValues(filters.freq, VALID_ALLELE_FREQ_VALUES);
  normalizedFreq.forEach(val => params.append("freq", val));

  // Structural
  if (filters.expModel === true) params.set("expModel", "true");
  if (filters.interact === true) params.set("interact", "true");
  if (filters.pocket === true) params.set("pocket", "true");
  const normalizedStability = normalizeFilterValues(filters.stability, VALID_STABILITY_VALUES);
  normalizedStability.forEach(val => params.append("stability", val));

  // Consequence
  const normalizedCadd = normalizeFilterValues(filters.cadd, VALID_CADD_VALUES);
  const normalizedAm = normalizeFilterValues(filters.am, VALID_AM_VALUES);
  const normalizedPopeve = normalizeFilterValues(filters.popeve, VALID_POPEVE_VALUES);

  normalizedCadd.forEach(val => params.append("cadd", val));
  normalizedAm.forEach(val => params.append("am", val));
  normalizedPopeve.forEach(val => params.append("popeve", val));

  if (filters.esmMin !== undefined) params.set("esmMin", filters.esmMin.toString());
  if (filters.esmMax !== undefined) params.set("esmMax", filters.esmMax.toString());

  // Sorting
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);

  return params;
};

// Mapping functions: UI categories -> Backend categories
export const mapUiCaddToBackend = (uiCategories: string[]): string[] => {
  const backendCategories: string[] = [];

  uiCategories.forEach(uiCategory => {
    switch (uiCategory.toLowerCase()) {
      case 'low':
        backendCategories.push(CaddCategory.LIKELY_BENIGN);
        break;
      case 'medium':
        backendCategories.push(
          CaddCategory.POTENTIALLY_DELETERIOUS,
          CaddCategory.QUITE_LIKELY_DELETERIOUS
        );
        break;
      case 'high':
        backendCategories.push(
          CaddCategory.PROBABLY_DELETERIOUS,
          CaddCategory.HIGHLY_LIKELY_DELETERIOUS
        );
        break;
      default:
        console.warn(`Unknown UI CADD category: ${uiCategory}`);
    }
  });

  return backendCategories;
};

export const mapUiPopeveToBackend = (uiCategories: string[]): string[] => {
  const backendCategories: string[] = [];

  uiCategories.forEach(uiCategory => {
    switch (uiCategory.toLowerCase()) {
      case 'severe':
        backendCategories.push(PopEveClass.SEVERE);
        break;
      case 'moderate':
        backendCategories.push(PopEveClass.MODERATELY_DELETERIOUS);
        break;
      case 'unlikely':
        backendCategories.push(PopEveClass.UNLIKELY_DELETERIOUS);
        break;
      default:
        console.warn(`Unknown UI popEVE category: ${uiCategory}`);
    }
  });

  return backendCategories;
};

export const mapUiStabilityToBackend = (uiCategories: string[]): string[] => {
  const backendCategories: string[] = [];

  uiCategories.forEach(uiCategory => {
    switch (uiCategory.toLowerCase()) {
      case 'destabilizing':
        backendCategories.push(StabilityChange.LIKELY_DESTABILISING);
        break;
      case 'stable':
        backendCategories.push(StabilityChange.UNLIKELY_DESTABILISING);
        break;
      default:
        console.warn(`Unknown UI Stability category: ${uiCategory}`);
    }
  });

  return backendCategories;
};

export const mapUiAlleleFreqToBackend = (uiCategories: string[]): string[] => {
  const backendCategories: string[] = [];

  uiCategories.forEach(uiCategory => {
    switch (uiCategory.toLowerCase()) {
      case 'very_rare':
        backendCategories.push(AlleleFreqCategory.VERY_RARE);
        break;
      case 'rare':
        backendCategories.push(AlleleFreqCategory.RARE);
        break;
      case 'low':
        backendCategories.push(AlleleFreqCategory.LOW_FREQUENCY);
        break;
      case 'common':
        backendCategories.push(AlleleFreqCategory.COMMON);
        break;
      default:
        console.warn(`Unknown UI Allele Frequency category: ${uiCategory}`);
    }
  });

  return backendCategories;
};