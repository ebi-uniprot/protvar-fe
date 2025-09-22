// filterUtils.ts
import {VALID_CADD_VALUES, VALID_AM_VALUES, VALID_STABILITY_VALUES} from "./filterConstants";
import {SearchFilterParams} from "./SearchFilters";
import {CaddCategory} from "../../../types/CaddCategory";
import {StabilityChange} from "../../../types/StabilityChange";

export const normalizeFilterValues = (selected: string[], valid: string[]) => {
  const validSet = new Set(valid);
  return selected.map(v => v.toLowerCase()).filter(v => validSet.has(v));
};

const parseBooleanParam = (searchParams: URLSearchParams, key: string): boolean | undefined => {
  return ["true", "1"].includes(searchParams.get(key) || "") ? true : undefined;
};

// Extract filters from URL
export const extractFilters = (searchParams: URLSearchParams): SearchFilterParams => ({
  cadd: normalizeFilterValues(searchParams.getAll("cadd"), VALID_CADD_VALUES),
  am: normalizeFilterValues(searchParams.getAll("am"), VALID_AM_VALUES),
  stability: normalizeFilterValues(searchParams.getAll("stability"), VALID_STABILITY_VALUES),
  known: parseBooleanParam(searchParams, "known"),
  pocket: parseBooleanParam(searchParams, "pocket"),
  interact: parseBooleanParam(searchParams, "interact"),
  sort: searchParams.get("sort") || undefined,
  order: (searchParams.get("order") as "asc" | "desc") || undefined,
});

// Mapping function: UI categories -> Backend categories
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