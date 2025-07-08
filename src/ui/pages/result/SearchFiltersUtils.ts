import {SearchFilterParams} from "./AdvancedSearch";
import {ALPHAMISSENSE_CATEGORIES, CADD_CATEGORIES} from "./filterConstants";

const isValidCategory = (category: string, options: string[]) => options.includes(category);

// Extract filters from URL
export const extractFilters = (searchParams: URLSearchParams): SearchFilterParams => ({
  cadd: searchParams.getAll("cadd").filter(c => isValidCategory(c, CADD_CATEGORIES.map(x => x.value))),
  am: searchParams.getAll("am").filter(a => isValidCategory(a, ALPHAMISSENSE_CATEGORIES.map(x => x.value))),
  known: ["true", "1"].includes(searchParams.get("known") || "") ? true : undefined,
  sort: searchParams.get("sort") || undefined,
  order: (searchParams.get("order") as "asc" | "desc") || undefined,
});