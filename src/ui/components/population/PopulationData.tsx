import React, { useEffect, useState } from 'react';
import Loader from '../../elements/Loader';
import {getPopulationData} from "../../../services/ProtVarService";
import {PopulationObservation, Variant} from "../../../types/PopulationObservation";
import PopulationIcon from "../../../images/human.svg";
import {HelpButton} from "../help/HelpButton";
import {HelpContent} from "../help/HelpContent";
import {ShareAnnotationIcon} from "../common/ShareLink";
import {NoAnnotationData} from "../common/NoAnnotationData";
import {PopulationAlleleFreq} from "./PopulationAlleleFreq";
import SubmittedVariantDetails from "./SubmittedVariantDetails";
import CoLocatedVariantDetails from "./coLocated/CoLocatedVariantDetails";
import AssociatedDiseases from "./common/AssociatedDiseases";
import XRefList from "./common/XRefList";
import PopulationFrequencyDetails from "./common/PopulationFrequencyDetails";

interface PopulationDataProps {
  annotation: string
  populationObservationsUri: string
  variantAA: string
  genomicVariant: string
}

function PopulationData(props: PopulationDataProps) {
  const { populationObservationsUri, variantAA, genomicVariant } = props;
  const [poApiData, setPoApiData] = useState<PopulationObservation>();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const calculateDataRichness = (data?: PopulationObservation): number => {
    if (!data) return 0;
    let score = 0;
    if (data.freqMap && Object.keys(data.freqMap).length > 0) score += 0.4;
    if (data.variants && data.variants.length > 0) score += 0.3;
    if (data.variants?.[0]?.association) score += 0.3;
    return Math.min(score, 1.0);
  };

  const dataRichness = calculateDataRichness(poApiData);

  useEffect(() => {
    getPopulationData(populationObservationsUri).then(response => {
      setPoApiData(response.data);
    });
  }, [populationObservationsUri]);

  // Default selection: submitted variant when data loads
  useEffect(() => {
    if (poApiData) {
      const submitted = poApiData.variants?.filter(v => v.alternativeSequence === variantAA) || [];
      setSelectedVariant(submitted[0] || poApiData.variants?.[0] || null);
    }
  }, [poApiData, variantAA]);

  if (!poApiData) return <div className="annotation-loader"><Loader /></div>;

  const proteinVariants = poApiData.variants || [];
  if (proteinVariants.length === 0 && (!poApiData.freqMap || Object.keys(poApiData.freqMap).length === 0)) {
    return <NoAnnotationData icon={PopulationIcon} iconAlt="Population observation" title="Population Observation" message="No population observation data available" />;
  }

  const submittedVariants = proteinVariants.filter(variant => variant.alternativeSequence === variantAA);
  const colocatedVariants = proteinVariants.filter(variant => variant.alternativeSequence !== variantAA);

  const parts = genomicVariant.split("-");
  const isValid = parts.length === 4;
  const alt = isValid ? parts[3] : null;

  // freqMap holds gnomAD AF for every alt allele observed at the submitted
  // variant's genomic *nucleotide* position (chr:pos). The submitted alt's AF
  // belongs with the submitted variant; the rest are sibling SNVs at the same
  // nucleotide — NOT residue-level colocated variants — so they get their own
  // "other alleles" block rather than sitting under the co-located column.
  const mainFreqMap = alt && poApiData.freqMap ? { ...(poApiData.freqMap[alt] ? { [alt]: poApiData.freqMap[alt] } : {}) } : {};
  const otherFreqMap = poApiData.freqMap && alt
    ? Object.fromEntries(Object.entries(poApiData.freqMap).filter(([allele]) => allele !== alt))
    : {};

  // The submitted nucleotide change (ref>alt); used to anchor the gnomAD section
  // even when the submitted variant has no AF, so absence reads as "not observed"
  // rather than a blank, and the "Other alleles" list keeps a clear antecedent.
  const ref = isValid ? parts[2] : null;
  const submittedChange = ref && alt ? `${ref}>${alt}` : null;
  const hasSubmittedAF = Object.keys(mainFreqMap).length > 0;

  const selectedChange = selectedVariant
    ? `${selectedVariant.wildType} > ${selectedVariant.alternativeSequence}`
    : null;
  const selectedLocation = selectedVariant?.genomicLocation?.[0];

  return (
    <div className="annotation-data-container">
      <div className="annotation-header">
            <div className="annotation-title">
              <img
                src={PopulationIcon}
                className="annotation-icon"
                data-fill={dataRichness.toFixed(1)}
                alt="Population observation"
                title={`Data richness: ${(dataRichness * 100).toFixed(0)}%`}
              />
              <h5>Population Observation</h5>
              {dataRichness > 0.7 && (
                <span className="data-richness-badge">
                  <i className="bi bi-check-circle-fill"></i>
                  Rich data
                </span>
              )}
            </div>
            <div className="annotation-actions">
              <HelpButton title="" content={<HelpContent name="population"/>}/>
              <ShareAnnotationIcon annotation={props.annotation}/>
            </div>
          </div>

          <div className="annotation-grid">
            {/* Left Column: Submitted Variant */}
            <div className="annotation-column">
              <div className="column-header">Submitted Variant</div>
              <PopulationAlleleFreq
                freqMap={mainFreqMap}
                genomicVariant={props.genomicVariant}
                stdColor={false}
              />
              {/* Submitted variant has no gnomAD AF — state it explicitly so the
                  absence is clear and "Other alleles" below has an antecedent. */}
              {!hasSubmittedAF && submittedChange && (
                <div className="allele-freq-section">
                  <div className="allele-freq-header">GnomAD Allele Frequency</div>
                  <div className="allele-freq-none">{submittedChange} — not observed in gnomAD</div>
                </div>
              )}
              {/* Other alts at the same nucleotide (multi-allelic sites): sibling
                  SNVs, shown muted beneath the submitted variant's gnomAD AF —
                  not residue-level colocated variants. */}
              {Object.keys(otherFreqMap).length > 0 && (
                <PopulationAlleleFreq
                  freqMap={otherFreqMap}
                  genomicVariant={props.genomicVariant}
                  stdColor={false}
                  header="Other alleles at this position"
                  muted
                />
              )}
              <SubmittedVariantDetails
                variants={submittedVariants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>

            {/* Right Column: Co-located Variants */}
            <div className="annotation-column">
              <div className="column-header">Co-located Variants at Residue Level</div>
              <CoLocatedVariantDetails
                coLocatedVariants={colocatedVariants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>
          </div>

          {/* Shared Detail Panel: XRef + Diseases for selected variant */}
          {selectedVariant && (
            <div
              key={selectedVariant.wildType + selectedVariant.alternativeSequence + (selectedVariant.genomicLocation?.[0] ?? '')}
              className="annotation-column variant-detail-panel"
            >
              <div className="column-header">
                {selectedChange}
                {selectedLocation && (
                  <span className="variant-detail-location">{selectedLocation}</span>
                )}
              </div>
              <XRefList
                xrefs={selectedVariant.xrefs}
                populationFrequencies={selectedVariant.populationFrequencies}
                clinicalSignificances={selectedVariant.clinicalSignificances}
              />
              <PopulationFrequencyDetails populationFrequencies={selectedVariant.populationFrequencies} />
              <AssociatedDiseases associations={selectedVariant.association} />
            </div>
          )}

    </div>
  );
}


export default PopulationData;
