interface HelpFile {
  name: string;
  md: boolean;
  title: string;
}

// List of help files
export const HELP_FILES: HelpFile[] = [
  { name: 'submit-variants', md: true, title: 'Submit Variants' },
  { name: 'supported-variant-format', md: true, title: 'Supported Variant Format' },
  { name: 'genomic-assembly-detection', md: true, title: 'Genomic Assembly Detection' },
  { name: 'search-history', md: false, title: 'Search History' }, // React component
  { name: 'result-page', md: true, title: 'Result Page' },
  { name: 'function-annotations', md: true, title: 'Function Annotations' },
  { name: 'population-observations', md: true, title: 'Population Observations' },
  { name: 'structure-annotations', md: true, title: 'Structure Annotations' },
  { name: 'result-download', md: false, title: 'Result Download' }, // React component
  { name: 'download-options', md: true, title: 'Download Options' },
  { name: 'downloads-page', md: true, title: 'Downloads Page' },
  { name: 'further-info', md: true, title: 'Further Information' },
  { name: 'download-file', md: true, title: 'Download File Format' },
  { name: 'direct-queries', md: true, title: 'Direct Queries' },
  { name: 'api', md: true, title: 'API' },
];