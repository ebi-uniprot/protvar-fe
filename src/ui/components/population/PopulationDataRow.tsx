import {TOTAL_COLS} from "../../../constants/SearchResultTable";
import CoLocatedVariantDetails from "./coLocated/CoLocatedVariantDetails";
import AssociationDetails from "./common/AssociationDetails";
import SubmittedVariantDetails from "./SubmittedVariantDetails";
import PopulationIcon from '../../../images/human.svg';
import {AlleleFreq, PopulationObservation} from "../../../types/PopulationObservation";
import {HelpButton} from "../help/HelpButton";
import {HelpContent} from "../help/HelpContent";
import React from "react";
import Spaces from "../../elements/Spaces";
import {ShareAnnotationIcon} from "../common/ShareLink";
import NoPopulationDataRow from "./NoPopulationDataRow";
import {PopulationAlleleFreq} from "./PopulationAlleleFreq";
import '../../../styles/new/annotation.css';
import '../../../styles/new/population.css';

interface PopulationDataRowProps {
  annotation: string;
  poApiData: PopulationObservation;
  variantAA: string;
  genomicVariant: string;
}

function PopulationDataRow(props: PopulationDataRowProps) {

  const proteinVariants = props.poApiData.variants || [];
  const submittedVariants = proteinVariants.filter(variant => variant.alternativeSequence === props.variantAA);
  const colocatedVariants = proteinVariants.filter(variant => variant.alternativeSequence !== props.variantAA);
  const { freqMap } = props.poApiData;

  // If no protein variants are found and no allele frequency is available
  if (proteinVariants.length === 0 && (!freqMap || Object.keys(freqMap).length === 0)) {
    return <NoPopulationDataRow/>;
  }

  // Determine which allele frequencies to show in each column
  const parts = props.genomicVariant.split("-");
  const isValid = parts.length === 4;
  const alt = isValid ? parts[3] : null;

  const mainFreqMap = alt && freqMap ? {...(freqMap[alt] ? {[alt]: freqMap[alt]} : {})} : {};
  const otherFreqMap = freqMap && alt
    ? Object.fromEntries(Object.entries(freqMap).filter(([allele]) => allele !== alt))
    : {};

  return <tr>
    <td colSpan={TOTAL_COLS} className="expanded-row">
      <div className="annotation-data-container">
        <div className="annotation-header">
          <h5>
            <img src={PopulationIcon} className="click-icon" alt="population icon" title="Population observation" />
            Population Observation
          </h5>
          <div className="annotation-actions">
            <HelpButton title="" content={<HelpContent name="population-observations"/>}/>
            <Spaces count={2}/>
            <ShareAnnotationIcon annotation={props.annotation}/>
          </div>
        </div>

        <div className="annotation-grid">
          {/* Left Column: Submitted Variant Details */}
          <div className="annotation-column">
            <div className="column-header">Submitted Variant Details</div>
            <PopulationAlleleFreq
              freqMap={mainFreqMap}
              genomicVariant={props.genomicVariant}
              stdColor={false}
            />
            <SubmittedVariantDetails variants={submittedVariants} />
          </div>

          {/* Right Column: Co-located Variants */}
          <div className="annotation-column">
            <div className="column-header">Co-located Variants at Residue Level</div>
            <PopulationAlleleFreq
              freqMap={otherFreqMap}
              genomicVariant={props.genomicVariant}
              stdColor={false}
            />
            <CoLocatedVariantDetails coLocatedVariants={colocatedVariants}/>
          </div>
        </div>

        {/* Associated Diseases - Full Width Below */}
        {submittedVariants.length > 0 && submittedVariants[0].association && (
          <div className="association-section">
            <div className="section-title">
              <span>Associated Diseases from UniProt</span>
            </div>
            <div className="section-content">
              <AssociationDetails associations={submittedVariants[0].association}/>
            </div>
          </div>
        )}

      </div>
    </td>
  </tr>
}


export default PopulationDataRow;