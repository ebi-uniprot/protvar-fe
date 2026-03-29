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

  // Calculate data richness
  const calculateDataRichness = (data?: PopulationObservation): number => {
    if (!data) return 0;

    let score = 0;
    if (data.freqMap && Object.keys(data.freqMap).length > 0) score += 0.4;
    if (data.variants && data.variants.length > 0) score += 0.3;
    if (data.variants?.[0]?.association) score += 0.3;

    return Math.min(score, 1.0);
  };

  //const dataRichness = poApiData ? calculateDataRichness(poApiData) : Math.random();
  const dataRichness = calculateDataRichness(poApiData);

  useEffect(() => {
    getPopulationData(populationObservationsUri).then(
      response => {
        setPoApiData(response.data);
      }
    );
  }, [populationObservationsUri]);

  // Show loader while fetching data
  if (!poApiData) return <LoaderRow />;

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
              <HelpButton title="" content={<HelpContent name="population-observations"/>}/>
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
  return (
    <tr>
      <td colSpan={TOTAL_COLS} className="expanded-row">
        <div className="annotation-data-container">
          <div className="annotation-header">
            <div className="annotation-title">
              <img
                src={PopulationIcon}
                className="annotation-icon"
                data-fill="0.0"
                alt="Population observation"
              />
              <h5>Population Observation</h5>
            </div>
          </div>
          <div className="no-data-message">
            No population observation data available
          </div>
        </div>
      </td>
    </tr>
  );
}

export default PopulationData;