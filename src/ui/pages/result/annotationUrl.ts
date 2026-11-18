/**
 * Annotation URL utilities
 *
 * The open panel is in the URL as ?ann=<type>[-<row>] or ?annotation=<type>[-<row>], any combination:
 *   short  ann=fun | pop | str             (what the app writes)
 *   long   annotation=function | population | structure
 *   kept for old links: functional, structural, and a "-row-<n>" suffix
 * No row number specified → defaults to row 1. Anything but the short form is rewritten to it.
 */

/** The URL parameter the app writes, and the long name it also reads */
export const ANN_PARAM = 'ann';
const ANN_PARAM_LONG = 'annotation';

/** The open panel's value from the URL (ann= first, then annotation=) */
export function getAnnotationParam(params: URLSearchParams): string | null {
  return params.get(ANN_PARAM) ?? params.get(ANN_PARAM_LONG);
}

/** Set the open panel (as ann=…), dropping any annotation=… */
export function setAnnotationParam(params: URLSearchParams, value: string): void {
  params.delete(ANN_PARAM_LONG);
  params.set(ANN_PARAM, value);
}

/** Close any open panel in the URL (both names) */
export function deleteAnnotationParam(params: URLSearchParams): void {
  params.delete(ANN_PARAM);
  params.delete(ANN_PARAM_LONG);
}

export type AnnotationType = "functional" | "structural" | "population";
export type AnnotationShortType = "fun" | "str" | "pop";

interface ParsedAnnotation {
  type: AnnotationType;
  rowNumber: number; // Always a number (defaults to 1)
}

const ANNOTATION_MAP: Record<string, AnnotationType> = {
  fun: "functional",
  function: "functional",
  functional: "functional",     // older links
  str: "structural",
  structure: "structural",
  structural: "structural",     // older links
  pop: "population",
  population: "population",
};

const LONG_TO_SHORT: Record<AnnotationType, AnnotationShortType> = {
  functional: "fun",
  structural: "str",
  population: "pop",
};

// the long names used in URLs (annotation=function|population|structure)
const URL_LONG: Record<AnnotationType, string> = {
  functional: "function",
  structural: "structure",
  population: "population",
};

/**
 * Parse annotation parameter from URL
 * Examples: "fun" → row 1, "str-2" → row 2, "functional-1" → row 1
 */
export function parseAnnotationParam(param: string | null): ParsedAnnotation | null {
  if (!param) return null;

  // "-row-2" too: the form older shared links carried (annotation=functional-row-2)
  const match = param.toLowerCase().match(/^([a-z]+)(?:-(?:row-)?(\d+))?$/);

  if (!match) return null;

  const typeKey = match[1];
  const rowNum = match[2] ? parseInt(match[2], 10) : 1; // Default to row 1
  if (rowNum < 1) return null;

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
  const typeStr = useShortFormat ? LONG_TO_SHORT[type] : URL_LONG[type];
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
    params.delete("highlightChain");
    params.delete("highlightPocket");
    params.delete("highlightInterface");
    params.delete("zoom");
  }

  // Add future parameter clearing here as needed:
  // if (annotationType !== "functional") {
  //   params.delete("fun_view");
  // }
}