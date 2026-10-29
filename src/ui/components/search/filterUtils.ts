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
import { MappingRequest } from "../../../types/MappingRequest";
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
  domain: parseBooleanParam(searchParams, "domain"),
  binding: parseBooleanParam(searchParams, "binding"),
  actsite: parseBooleanParam(searchParams, "actsite"),
  consMin: parseNumberParam(searchParams, "consMin"),
  consMax: parseNumberParam(searchParams, "consMax"),

  // Population
  disease: parseBooleanParam(searchParams, "disease"),
  freq: normalizeFilterValues(searchParams.getAll("freq"), VALID_ALLELE_FREQ_VALUES),

  // Structural
  transmem: parseBooleanParam(searchParams, "transmem"),
  expModel: parseBooleanParam(searchParams, "expModel"),
  interact: parseBooleanParam(searchParams, "interact"),
  pocket: parseBooleanParam(searchParams, "pocket"),
  stability: normalizeFilterValues(searchParams.getAll("stability"), VALID_STABILITY_VALUES),

  // Consequence
  cadd: normalizeFilterValues(searchParams.getAll("cadd"), VALID_CADD_VALUES),
  aviMin: parseNumberParam(searchParams, "aviMin"),
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
  if (filters.domain === true) params.set("domain", "true");
  if (filters.binding === true) params.set("binding", "true");
  if (filters.actsite === true) params.set("actsite", "true");
  if (filters.consMin !== undefined) params.set("consMin", filters.consMin.toString());
  if (filters.consMax !== undefined) params.set("consMax", filters.consMax.toString());

  // Population
  if (filters.disease === true) params.set("disease", "true");
  const normalizedFreq = normalizeFilterValues(filters.freq, VALID_ALLELE_FREQ_VALUES);
  normalizedFreq.forEach(val => params.append("freq", val));

  // Structural
  if (filters.transmem === true) params.set("transmem", "true");
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
  if (filters.aviMin !== undefined) params.set("aviMin", filters.aviMin.toString());
  normalizedAm.forEach(val => params.append("am", val));
  normalizedPopeve.forEach(val => params.append("popeve", val));

  if (filters.esmMin !== undefined) params.set("esmMin", filters.esmMin.toString());
  if (filters.esmMax !== undefined) params.set("esmMax", filters.esmMax.toString());

  // Sorting
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);

  return params;
};

// ---- Active-filter chips (for the collapsed filter bar) ----------------

export interface FilterChip {
  id: string;    // stable id — also encodes how to remove the atom
  label: string; // display text
}

// One label per boolean filter.
const BOOLEAN_CHIP_LABELS: [keyof SearchFilterParams, string][] = [
  ['ptm', 'PTM'],
  ['mutagen', 'Mutagenesis'],
  ['domain', 'Functional Domain'],
  ['binding', 'Binding Site'],
  ['actsite', 'Active Site'],
  ['transmem', 'Transmembrane'],
  ['disease', 'Disease Association'],
  ['expModel', 'Experimental Model'],
  ['interact', 'P-P Interface'],
  ['pocket', 'Predicted Pocket'],
];

// Prefix per multi-select array filter — one chip per selected value.
const ARRAY_CHIP_PREFIXES: [keyof SearchFilterParams, string][] = [
  ['cadd', 'CADD'],
  ['am', 'AlphaMissense'],
  ['popeve', 'popEVE'],
  ['stability', 'Stability'],
  ['freq', 'Allele Freq'],
];

const prettyValue = (v: string): string =>
  v.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());

// Flat list of chips for the active filters in `f` — one chip per value.
// Variant type is the one filter whose default depends on the view: browse defaults to known variants (a
// "Potential variants" chip when widened), an upload to all submitted variants ("Known variants only" chip
// when narrowed).
export const describeFilters = (f: SearchFilterParams, upload = false): FilterChip[] => {
  const chips: FilterChip[] = [];

  if (upload ? f.variant === 'known' : f.variant === 'potential')
    chips.push({ id: 'variant', label: upload ? 'Known variants only' : 'Potential variants' });

  for (const [key, label] of BOOLEAN_CHIP_LABELS) {
    if (f[key] === true) chips.push({ id: key as string, label });
  }

  for (const [key, prefix] of ARRAY_CHIP_PREFIXES) {
    for (const v of ((f[key] as string[] | undefined) ?? [])) {
      chips.push({ id: `${key}:${v}`, label: `${prefix}: ${prettyValue(v)}` });
    }
  }

  if (f.consMin !== undefined || f.consMax !== undefined)
    chips.push({ id: 'conservation', label: `Conservation ${f.consMin ?? 0}–${f.consMax ?? 1}` });
  if (f.esmMin !== undefined || f.esmMax !== undefined)
    chips.push({ id: 'esm1b', label: `ESM-1b ${f.esmMin ?? -25}–${f.esmMax ?? 0}` });
  if (f.aviMin !== undefined)
    chips.push({ id: 'aviMin', label: `AVI ≥ ${f.aviMin}` });

  return chips;
};

// Remove the filter atom identified by `id` from `f`.
export const removeChip = (f: SearchFilterParams, id: string, upload = false): SearchFilterParams => {
  if (id === 'variant') return { ...f, variant: upload ? undefined : 'known' };
  if (id === 'conservation') return { ...f, consMin: undefined, consMax: undefined };
  if (id === 'esm1b') return { ...f, esmMin: undefined, esmMax: undefined };
  if (id.includes(':')) {
    const [key, val] = id.split(':');
    const cur = (f as unknown as Record<string, string[]>)[key] ?? [];
    return { ...f, [key]: cur.filter(v => v !== val) };
  }
  return { ...f, [id]: undefined };
};

// Restore the filter atom `id` into `local`, taking its value from `applied`.
export const restoreChip = (
  local: SearchFilterParams, applied: SearchFilterParams, id: string
): SearchFilterParams => {
  if (id === 'variant') return { ...local, variant: applied.variant };
  if (id === 'conservation') return { ...local, consMin: applied.consMin, consMax: applied.consMax };
  if (id === 'esm1b') return { ...local, esmMin: applied.esmMin, esmMax: applied.esmMax };
  if (id === 'aviMin') return { ...local, aviMin: applied.aviMin };
  if (id.includes(':')) {
    const [key, val] = id.split(':');
    const cur = (local as unknown as Record<string, string[]>)[key] ?? [];
    return { ...local, [key]: cur.includes(val) ? cur : [...cur, val] };
  }
  return { ...local, [id]: true };
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

// The filter/sort fields of a mapping request, from the UI filters. Shared by the result page and the download
// panel so a download matches what's on screen. Browse defaults to known variants (a driver filter); an upload
// shows all submitted variants unless the user picks "known" — sending known=true by default would filter every
// upload view.
export const filterRequest = (filters: SearchFilterParams | undefined, isUpload: boolean): Partial<MappingRequest> => {
  const cadd = filters?.cadd ? mapUiCaddToBackend(filters.cadd) : [];
  const popeve = filters?.popeve ? mapUiPopeveToBackend(filters.popeve) : [];
  const stability = filters?.stability ? mapUiStabilityToBackend(filters.stability) : [];
  const freq = filters?.freq ? mapUiAlleleFreqToBackend(filters.freq) : [];
  return {
    known: isUpload
      ? (filters?.variant === 'known' ? true : undefined)
      : (filters?.variant !== 'potential' ? true : undefined),
    ptm: filters?.ptm,
    mutagen: filters?.mutagen,
    domain: filters?.domain,
    binding: filters?.binding,
    actsite: filters?.actsite,
    transmem: filters?.transmem,
    conservationMin: filters?.consMin,
    conservationMax: filters?.consMax,
    diseaseAssociation: filters?.disease,
    alleleFreq: freq.length > 0 ? freq : undefined,
    experimentalModel: filters?.expModel,
    interact: filters?.interact,
    pocket: filters?.pocket,
    stability: stability.length > 0 ? stability : undefined,
    cadd: cadd.length > 0 ? cadd : undefined,
    aviMin: filters?.aviMin,
    am: filters?.am ?? [],
    popeve: popeve.length > 0 ? popeve : undefined,
    esm1bMin: filters?.esmMin,
    esm1bMax: filters?.esmMax,
    sort: filters?.sort,
    order: filters?.order,
  };
};
