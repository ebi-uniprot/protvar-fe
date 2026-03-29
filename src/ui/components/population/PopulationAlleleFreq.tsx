import {PredAttr} from "../function/prediction/Prediction";
import {STD_COLOR_GRADIENT_REVERSE} from "../function/prediction/PredConstants";
import React from "react";
import {AlleleFreq} from "../../../types/PopulationObservation";
import {ExtLink} from "../common/Link";

const PRECISION: number = 5; // decimal places

const buildGnomadUrl = (genomicVariant: string, allele: string): string => {
  const parts = genomicVariant.split("-");
  if (parts.length === 4) {
    // Replace the alt (4th part) with the current allele
    const [chr, pos, ref] = parts;
    const variantId = `${chr}-${pos}-${ref}-${allele}`;
    return `https://gnomad.broadinstitute.org/variant/${variantId}?dataset=gnomad_r4`;
  }
  // Fallback to original if format is unexpected
  return `https://gnomad.broadinstitute.org/variant/${genomicVariant}?dataset=gnomad_r4`;
};

export const AF_ATTR: PredAttr[] = [
  {color: '#FAD0C9', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(0.1).toHexString(), text: 'very rare', range: 'AF < 0.1%', threshold: 0.001 },
  {color: '#A3D8FF', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(0.5).toHexString(), text: 'rare', range: '0.1% ≤ AF < 0.5%', threshold: 0.005 },
  {color: '#B8E1B1', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(0.8).toHexString(), text: 'low frequency', range: '0.5% ≤ AF < 5%', threshold: 0.05 },
  {color: '#7FBC5C', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(1).toHexString(), text: 'common', range: 'AF ≥ 5%', threshold: Infinity }
]

interface PopulationAlleleFreqProps {
  freqMap: { [key: string]: AlleleFreq };
  genomicVariant: string;
  stdColor: boolean;
}

export const PopulationAlleleFreq = ({ freqMap, genomicVariant, stdColor }: PopulationAlleleFreqProps) => {
  if (!freqMap || Object.keys(freqMap).length === 0) return null;

  return (
    <div className="allele-freq-section">
      <div className="allele-freq-header">GnomAD Allele Frequency</div>
      <div className="allele-freq-content">
        {Object.entries(freqMap).map(([allele, freq]) => (
          <AlleleFreqCard
            key={allele}
            allele={allele}
            freq={freq}
            genomicVariant={genomicVariant}
            stdColor={stdColor}
          />
        ))}
      </div>
    </div>
  );
};

interface AlleleFreqCardProps {
  allele: string;
  freq: AlleleFreq;
  genomicVariant: string;
  stdColor: boolean;
}

function AlleleFreqCard({ allele, freq, genomicVariant, stdColor }: AlleleFreqCardProps) {
  const classification = getClassification(freq.af);
  const showAcAn = freq.ac !== undefined && freq.an !== undefined;
  const gnomadUrl = buildGnomadUrl(genomicVariant, allele);

  return (
    <div className="allele-freq-card">
      <div className="allele-freq-top">
        <span className="allele-name">{allele}:</span>
        <span className="allele-value" title={freq.af.toString()}>{freq.af.toFixed(PRECISION)}</span>
        <span className="ml-auto">
          <ExtLink url={gnomadUrl} title={`View ${allele} in GnomAD`} />
        </span>
      </div>
      <div className="allele-freq-bottom">
        <span className="allele-classification">
          <i className="bi bi-circle-fill" style={{ color: stdColor ? classification.stdColor : classification.color }}></i>
          {classification.text}
        </span>
        {showAcAn && (
          <span className="allele-count" title="Alternate allele count / Total number of alleles">
            {freq.ac}/{freq.an}
          </span>
        )}
      </div>
    </div>
  );
}

function getClassification(af: number) {
  for (const attr of AF_ATTR) {
    if (attr.threshold && af < attr.threshold) {
      return attr;
    }
  }
  return AF_ATTR[AF_ATTR.length - 1];
}