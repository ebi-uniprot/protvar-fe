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

interface PopulationDataRowProps {
  annotation: string
  poApiData: PopulationObservation,
  variantAA: string
  genomicVariant: string
}

function PopulationDataRow(props: PopulationDataRowProps) {

  const proteinVariants = props.poApiData.variants || [];
  const submittedVariants = proteinVariants.filter(variant => variant.alternativeSequence === props.variantAA);
  const colocatedVariants = proteinVariants.filter(variant => variant.alternativeSequence !== props.variantAA);
  const { freqMap } = props.poApiData;

  // If no protein variants are found but allele frequency is available, display allele frequency only
  if (proteinVariants.length === 0 &&
    (!freqMap || Object.keys(freqMap).length === 0)) {
    return <NoPopulationDataRow/>;
  }

  return <tr>
    <td colSpan={TOTAL_COLS} className="expanded-row">
      <div className="significances-groups">
        <div className="column">
          <h5 style={{display: "inline"}}>
            <img src={PopulationIcon} className="click-icon" alt="population icon"
                 title="Population observation"/> Population Observation
          </h5>
          <HelpButton title="" content={<HelpContent name="population-observations"/>}/>
          <Spaces count={2}/>
          <ShareAnnotationIcon annotation={props.annotation}/>
          <table>
            <tbody>
            <tr>
              <th>Submitted Variant Details</th>
              <th>Co-located Variants at Residue Level</th>
            </tr>
            {freqMap && Object.keys(freqMap).length > 0 &&
              <AlleleFreqRow freqMap={freqMap} genomicVariant={props.genomicVariant} />
            }
            <tr>
              <td style={{verticalAlign: "top"}}><SubmittedVariantDetails variants={submittedVariants} /></td>
              <td><CoLocatedVariantDetails coLocatedVariants={colocatedVariants}/></td>
            </tr>
            </tbody>
          </table>
          {submittedVariants.length > 0 && submittedVariants[0].association &&
            <table>
              <tbody>
              <tr>
                <th>Associated Diseases from UniProt</th>
              </tr>
              <tr>
                <td><AssociationDetails associations={submittedVariants[0].association}/></td>
              </tr>
              </tbody>
            </table>}
        </div>
      </div>
    </td>
  </tr>
}

interface AlleleFreqRowProps {
  freqMap: { [key: string]: AlleleFreq };
  genomicVariant: string
}
function AlleleFreqRow(props: AlleleFreqRowProps) {
  const {freqMap, genomicVariant} = props
  const parts = genomicVariant.split("-");
  const isValid = parts.length === 4;

  if (!isValid) {
    return (
      <tr>
        <td>
          <PopulationAlleleFreq freqMap={freqMap} genomicVariant={genomicVariant} stdColor={false}/>
        </td>
        <td></td>
      </tr>
    );
  }

  const alt = parts[3];
  const mainFreqMap = {...(freqMap[alt] ? {[alt]: freqMap[alt]} : {})};
  const otherFreqMap = Object.fromEntries(
    Object.entries(freqMap).filter(([allele]) => allele !== alt)
  );

  return <tr>
    <td>
      <PopulationAlleleFreq freqMap={mainFreqMap} genomicVariant={genomicVariant} stdColor={false} />
    </td>
    <td>
      {Object.keys(otherFreqMap).length > 0 && (
        <PopulationAlleleFreq freqMap={otherFreqMap} genomicVariant={genomicVariant} stdColor={false} />
      )}
    </td>
  </tr>
}

export default PopulationDataRow;