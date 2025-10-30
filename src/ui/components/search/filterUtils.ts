// filterUtils.ts
import {VALID_CADD_VALUES, VALID_AM_VALUES, VALID_POPEVE_VALUES, VALID_STABILITY_VALUES} from "./filterConstants";
import {SearchFilterParams} from "./SearchFilters";
import {CaddCategory} from "../../../types/CaddCategory";
import {StabilityChange} from "../../../types/StabilityChange";
import {PopEveClass} from "../../../types/PopEveClass";

export const normalizeFilterValues = (selected: string[], valid: string[]) => {
  const validSet = new Set(valid);
  return selected.map(v => v.toLowerCase()).filter(v => validSet.has(v));
};

const parseBooleanParam = (searchParams: URLSearchParams, key: string): boolean | undefined => {
  return ["true", "1"].includes(searchParams.get(key) || "") ? true : undefined;
};

// eslint-disable-next-line
const parseNumberParam = (searchParams: URLSearchParams, key: string): number | undefined => {
  const value = searchParams.get(key);
  if (value === null) return undefined;
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
};

// Extract filters from URL
export const extractFilters = (searchParams: URLSearchParams): SearchFilterParams => ({
  known: parseBooleanParam(searchParams, "known"),
  cadd: normalizeFilterValues(searchParams.getAll("cadd"), VALID_CADD_VALUES),
  am: normalizeFilterValues(searchParams.getAll("am"), VALID_AM_VALUES),
  popeve: normalizeFilterValues(searchParams.getAll("popeve"), VALID_POPEVE_VALUES),
  interact: parseBooleanParam(searchParams, "interact"),
  pocket: parseBooleanParam(searchParams, "pocket"),
  stability: normalizeFilterValues(searchParams.getAll("stability"), VALID_STABILITY_VALUES),
  sort: searchParams.get("sort") || undefined,
  order: (searchParams.get("order") as "asc" | "desc") || undefined,
  // COMMENTED OUT - EVE range parameters
  // eve_min: parseNumberParam(searchParams, "eve_min"),
  // eve_max: parseNumberParam(searchParams, "eve_max"),
});

export const buildFilterParams = (filters: SearchFilterParams): URLSearchParams => {
  const params = new URLSearchParams();

  const normalizedCadd = normalizeFilterValues(filters.cadd, VALID_CADD_VALUES);
  const normalizedAm = normalizeFilterValues(filters.am, VALID_AM_VALUES);
  const normalizedPopeve = normalizeFilterValues(filters.popeve, VALID_POPEVE_VALUES);
  const normalizedStability = normalizeFilterValues(filters.stability, VALID_STABILITY_VALUES);

  // Send whatever the user selected
  normalizedCadd.forEach(val => params.append("cadd", val));
  normalizedAm.forEach(val => params.append("am", val));
  normalizedPopeve.forEach(val => params.append("popeve", val));  // NEW: Add popEVE params
  normalizedStability.forEach(val => params.append("stability", val));

  // Add boolean filters
  if (filters.known === true) params.set("known", "true");
  if (filters.pocket === true) params.set("pocket", "true");
  if (filters.interact === true) params.set("interact", "true");

  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);

  // COMMENTED OUT - EVE range parameters
  /*
  if (filters.eve_min !== undefined) {
    params.set("eve_min", filters.eve_min.toString());
  }
  if (filters.eve_max !== undefined) {
    params.set("eve_max", filters.eve_max.toString());
  }
  */
  return params;
};

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