import {SearchFilterParams} from "./AdvancedSearch";
import {ALPHAMISSENSE_CATEGORIES, CADD_CATEGORIES, STABILITY_CATEGORIES} from "./filterConstants";

const isValidCategory = (category: string, options: string[]) => options.includes(category);

// Extract filters from URL
export const extractFilters = (searchParams: URLSearchParams): SearchFilterParams => ({
  cadd: searchParams.getAll("cadd").filter(c => isValidCategory(c, CADD_CATEGORIES.map(x => x.value))),
  am: searchParams.getAll("am").filter(a => isValidCategory(a, ALPHAMISSENSE_CATEGORIES.map(x => x.value))),
  known: ["true", "1"].includes(searchParams.get("known") || "") ? true : undefined,
  pocket: ["true", "1"].includes(searchParams.get("pocket") || "") ? true : undefined,
  interact: ["true", "1"].includes(searchParams.get("interact") || "") ? true : undefined,
  stability: searchParams.getAll("stability").filter(a => isValidCategory(a, STABILITY_CATEGORIES.map(x => x.value))),
  sort: searchParams.get("sort") || undefined,
  order: (searchParams.get("order") as "asc" | "desc") || undefined,
});