
/**
 * Default Parser
 * @param {string} input
 */
function defaultParser(input) {
  return input;
}

module.exports.defaultParser = defaultParser;


/**
 * Parser for VeP's "Ensembl Default" user input format
 * @param {string} input
 */
function VEPEnsemblDefaultInputParser(input) {
  const terms = input.match(/\S+/g) || [];
  const change = terms[3].match(/([a-zA-Z-]+\/)?([a-zA-Z-]+)/);
  const ref = change[1] && change[1].match(/([a-zA-Z-]+)\//)[1];
  const allele = change[2];
  const strand = terms[4] || 1;

  const parsed = {
    chrom: terms[0],
    position: {
      start: terms[1],
      end: terms[2],
    },
    ref,
    allele,
    strand,
  };

  console.log('parser:', parsed);
  return parsed;
}

module.exports.VEPEnsemblDefaultInputParser = VEPEnsemblDefaultInputParser;


/**
 * Input handler for VCF-formatted text
 * @param {string} input
 */
function VEPVCFTextInputHandler(input) {
  const vcfLines = input
    .split(/\r?\n/);
  console.log('vcf lines:', vcfLines);
  return vcfLines;
}

module.exports.VEPVCFTextInputHandler = VEPVCFTextInputHandler;
