/**
 * Annotation URL utilities
 * No row number specified → defaults to row 1
 */

export type AnnotationType = "functional" | "structural" | "population";
export type AnnotationShortType = "fun" | "str" | "pop";

interface ParsedAnnotation {
  type: AnnotationType;
  rowNumber: number; // Always a number (defaults to 1)
}

const ANNOTATION_MAP: Record<string, AnnotationType> = {
  functional: "functional",
  fun: "functional",
  structural: "structural",
  str: "structural",
  population: "population",
  pop: "population",
};

const LONG_TO_SHORT: Record<AnnotationType, AnnotationShortType> = {
  functional: "fun",
  structural: "str",
  population: "pop",
};

/**
 * Parse annotation parameter from URL
 * Examples: "fun" → row 1, "str-2" → row 2, "functional-1" → row 1
 */
export function parseAnnotationParam(param: string | null): ParsedAnnotation | null {
  if (!param) return null;

  const match = param.match(/^(functional|fun|structural|str|population|pop)(?:-(\d+))?$/);

  if (!match) return null;

  const typeKey = match[1];
  const rowNum = match[2] ? parseInt(match[2], 10) : 1; // Default to row 1

  const type = ANNOTATION_MAP[typeKey];
  if (!type) return null;

  return { type, rowNumber: rowNum };
}

/**
 * Build annotation key from type and row number
 * Examples: "functional-row-1", "structural-row-2"
 */
export function buildAnnotationKey(type: AnnotationType, rowNumber: number): string {
  return `${type}-row-${rowNumber}`;
}

/**
 * Build annotation URL parameter
 * Examples: "fun", "str-2", "pop-3"
 * If rowNumber is 1, omit it for cleaner URLs
 */
export function buildAnnotationParam(
  type: AnnotationType,
  rowNumber: number,
  useShortFormat: boolean = true
): string {
  const typeStr = useShortFormat ? LONG_TO_SHORT[type] : type;
  return rowNumber === 1 ? typeStr : `${typeStr}-${rowNumber}`;
}

/**
 * Extract type and row number from annotation key
 * Example: "structural-row-2" → { type: "structural", rowNumber: 2 }
 */
export function parseAnnotationKey(key: string): { type: AnnotationType; rowNumber: number } | null {
  const match = key.match(/^(functional|structural|population)-row-(\d+)$/);
  if (!match) return null;

  return {
    type: match[1] as AnnotationType,
    rowNumber: parseInt(match[2], 10),
  };
}


/**
 * Clear annotation-specific URL parameters when switching tabs
 * Structure parameters should only exist when on the structural tab
 */
export function clearAnnotationSpecificParams(
  params: URLSearchParams,
  annotationType: AnnotationType | null
): void {
  // Structure parameters only valid for structural tab
  if (annotationType !== "structural") {
    params.delete("structure");
    params.delete("highlight_chain");
    params.delete("highlight_pocket");
    params.delete("highlight_interface");
    params.delete("zoom");
  }

  // Add future parameter clearing here as needed:
  // if (annotationType !== "functional") {
  //   params.delete("fun_view");
  // }
}