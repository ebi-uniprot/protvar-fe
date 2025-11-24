import {PredAttr} from "../function/prediction/Prediction";
import {STD_COLOR_GRADIENT_REVERSE} from "../function/prediction/PredConstants";
import Spaces from "../../elements/Spaces";
import React from "react";
import {AlleleFreq} from "../../../types/PopulationObservation";

const PRECISION: number = 5 // dp

const GNOMAD_URL = (genomicVariant: string): string =>
  `https://gnomad.broadinstitute.org/variant/${genomicVariant}?dataset=gnomad_r4`

export const AF_ATTR: PredAttr[] = [
  {color: '#FAD0C9', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(0.1).toHexString(), text: 'very rare', range: 'AF < 0.1%' },
  {color: '#A3D8FF', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(0.5).toHexString(), text: 'rare', range: '0.1% ≤ AF < 0.5%' },
  {color: '#B8E1B1', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(0.8).toHexString(), text: 'low frequency', range: '0.5% ≤ AF < 5%' },
  {color: '#7FBC5C', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(1).toHexString(), text: 'common', range: 'AF ≥ 5%' }
]

interface PopulationAlleleFreqProps {
  freqMap: { [key: string]: AlleleFreq };
  genomicVariant: string;
  stdColor: boolean;
}

export const PopulationAlleleFreq = ({ freqMap, genomicVariant, stdColor }: PopulationAlleleFreqProps) => {
  if (!freqMap || Object.keys(freqMap).length === 0) return <></>;

  return (
    <ul>
      <li>
        <b>GnomAD allele frequency:</b>
      </li>
      <li>
      <ul>{Object.entries(freqMap).map(([key, freq]) => {
        const showAcAn = freq.ac !== undefined && freq.an !== undefined;
        return (
          <li key={key}>
            <span title={`Alternate allele frequency ${freq.af.toString()} (${key})`}>
              <a href={GNOMAD_URL(genomicVariant)} target="_blank" rel="noopener noreferrer">
                {key}: {freq.af.toFixed(PRECISION)}
              </a>
              {showAcAn && (
                <span title="Alternate allele count / Total number of alleles">
                  {' '}
                  ({freq.ac}/{freq.an})
                </span>
              )}
              <Spaces /> <AFIcon af={freq.af} stdColor={stdColor} />
            </span>
          </li>
        );
      })}</ul>
      </li>
    </ul>
  );
};

function AFIcon(props: { af: number, stdColor: boolean }) {
  let attr = afAttr(props.af)
  if (attr) {
    return <>
    <i className="bi bi-circle-fill" style={{color: (props.stdColor ? attr.stdColor : attr.color)}}></i>
      <Spaces/> <span className="badge">{attr.text}</span>
    </>
  }
  return <></>
}

function afAttr(af: number) {
  if (af < 0.001) {
    return AF_ATTR[0];
  } else if (af >= 0.001 && af < 0.005) {
    return AF_ATTR[1];
  } else if (af >= 0.005 && af < 0.05) {
    return AF_ATTR[2];
  } else {
    return AF_ATTR[3];
  }
}