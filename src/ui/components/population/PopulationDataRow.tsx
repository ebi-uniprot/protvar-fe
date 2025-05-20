import {TOTAL_COLS} from "../../../constants/SearchResultTable";
import CoLocatedVariantDetails from "./coLocated/CoLocatedVariantDetails";
import AssociationDetails from "./common/AssociationDetails";
import SubmittedVariantDetails from "./SubmittedVariantDetails";
import PopulationIcon from '../../../images/human.svg';
import {PopulationObservation} from "../../../types/PopulationObservation";
import {HelpButton} from "../help/HelpButton";
import {HelpContent} from "../help/HelpContent";
import React from "react";
import Spaces from "../../elements/Spaces";
import {ShareAnnotationIcon} from "../common/ShareLink";
import NoPopulationDataRow from "./NoPopulationDataRow";
import {AlleleFreq} from "./AlleleFreq";
import {GnomadFreq} from "../../../types/MappingResponse";

interface PopulationDataRowProps {
  annotation: string
  poApiData: PopulationObservation,
  variantAA: string
  gnomadFreq: GnomadFreq
  gnomadCoord: string
}

function PopulationDataRow(props: PopulationDataRowProps) {

  const proteinVariants = props.poApiData.variants || [];
  const matchingVariants = proteinVariants.filter(variant => variant.alternativeSequence === props.variantAA);
  const nonMatchingVariants = proteinVariants.filter(variant => variant.alternativeSequence !== props.variantAA);


  // If no protein variants are found but allele frequency is available, display allele frequency only
  if (proteinVariants.length === 0) {
    return props.gnomadFreq ? (
      <PopulationObservationLayout
        annotation={props.annotation}
        submittedVariantContent={<AlleleFreq gnomadFreq={props.gnomadFreq} gnomadCoord={props.gnomadCoord} stdColor={false}/>}
        coLocatedVariantContent={<label><b>No co-located variants to report</b></label>}
      />
    ) : <NoPopulationDataRow/>;
  }

  const hasAssociatedDiseases = matchingVariants.length > 0 && matchingVariants[0].association;
  return (
    <PopulationObservationLayout
      annotation={props.annotation}
      submittedVariantContent={<SubmittedVariantDetails variants={matchingVariants} gnomadFreq={props.gnomadFreq} gnomadCoord={props.gnomadCoord}/>}
      coLocatedVariantContent={<CoLocatedVariantDetails coLocatedVariants={nonMatchingVariants}/>}
      associatedDiseases={hasAssociatedDiseases ?
        <AssociationDetails associations={matchingVariants[0].association}/> : null}
    />
  );
}


interface PopulationObservationLayoutProps {
  annotation: string;
  submittedVariantContent: React.ReactNode;
  coLocatedVariantContent: React.ReactNode;
  associatedDiseases?: React.ReactNode;
}

function PopulationObservationLayout({
                                       annotation,
                                       submittedVariantContent,
                                       coLocatedVariantContent,
                                       associatedDiseases
                                     }: PopulationObservationLayoutProps) {
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
              <ShareAnnotationIcon annotation={annotation}/>
              <table>
                <tbody>
                <tr>
                  <th>Submitted Variant Details</th>
                  <th>Co-located Variants at Residue Level</th>
                </tr>
                <tr>
                  <td style={{verticalAlign: "top"}}>{submittedVariantContent}</td>
                  <td>{coLocatedVariantContent}</td>
                </tr>
                </tbody>
              </table>
              {associatedDiseases ? (
                <table>
                  <tbody>
                  <tr>
                    <th>Associated Diseases from UniProt</th>
                  </tr>
                  <tr>
                    <td>{associatedDiseases}</td>
                  </tr>
                  </tbody>
                </table>
              ) : null}
            </div>
          </div>
        </td>
    </tr>
}

export default PopulationDataRow;