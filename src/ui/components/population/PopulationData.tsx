import React, { useEffect, useState } from 'react';
import LoaderRow from '../../pages/result/LoaderRow';
import {getPopulationData} from "../../../services/ProtVarService";
import {PopulationObservation} from "../../../types/PopulationObservation";
import {TOTAL_COLS} from "../../../constants/SearchResultTable";
import PopulationIcon from "../../../images/human.svg";
import {HelpButton} from "../help/HelpButton";
import {HelpContent} from "../help/HelpContent";
import Spaces from "../../elements/Spaces";
import {ShareAnnotationIcon} from "../common/ShareLink";
import {PopulationAlleleFreq} from "./PopulationAlleleFreq";
import SubmittedVariantDetails from "./SubmittedVariantDetails";
import CoLocatedVariantDetails from "./coLocated/CoLocatedVariantDetails";
import AssociationDetails from "./common/AssociationDetails";

interface PopulationDataProps {
  annotation: string
  populationObservationsUri: string
  variantAA: string
  genomicVariant: string
}

function PopulationData(props: PopulationDataProps) {
  const { annotation, populationObservationsUri, variantAA, genomicVariant } = props;
  const [poApiData, setPoApiData] = useState<PopulationObservation>();


  useEffect(() => {
    getPopulationData(populationObservationsUri).then(
      response => {
        setPoApiData(response.data);
      }
    );
  }, [populationObservationsUri]);

  // Show loader while fetching data
  if (!poApiData) {
    return <LoaderRow />;
  }

  const proteinVariants = poApiData.variants || [];
  // If no protein variants are found and no allele frequency is available
  if (proteinVariants.length === 0 && (!poApiData.freqMap || Object.keys(poApiData.freqMap).length === 0)) {
    return <NoPopulationDataRow/>;
  }

  const submittedVariants = proteinVariants.filter(variant => variant.alternativeSequence === props.variantAA);
  const colocatedVariants = proteinVariants.filter(variant => variant.alternativeSequence !== props.variantAA);

  // Determine which allele frequencies to show in each column
  const parts = genomicVariant.split("-");
  const isValid = parts.length === 4;
  const alt = isValid ? parts[3] : null;

  const mainFreqMap = alt && poApiData.freqMap ? { ...(poApiData.freqMap[alt] ? { [alt]: poApiData.freqMap[alt] } : {}) } : {};
  const otherFreqMap = poApiData.freqMap && alt
    ? Object.fromEntries(Object.entries(poApiData.freqMap).filter(([allele]) => allele !== alt))
    : {};

  return (
    <tr>
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
  );
}

function NoPopulationDataRow() {
  return <tr>
    <td colSpan={TOTAL_COLS} className="expanded-row">
      <div className="column">No Population Observation to report</div>
    </td>
  </tr>
}

export default PopulationData;