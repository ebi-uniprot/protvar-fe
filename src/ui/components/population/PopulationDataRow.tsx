import { TOTAL_COLS } from "../../../constants/SearchResultTable";
import CoLocatedVariantDetails from "./coLocated/CoLocatedVariantDetails";
import AssociationDetails from "./common/AssociationDetails";
import SubmittedVariantDetails from "./SubmittedVariantDetails";
import PopulationIcon from '../../../images/human.svg';
import {PopulationObservationResponse, ProteinColocatedVariant} from "../../../types/PopulationObservationResponse";
import {HelpButton} from "../help/HelpButton";
import {HelpContent} from "../help/HelpContent";
import React from "react";
import Spaces from "../../elements/Spaces";
import {ShareAnnotationIcon} from "../common/ShareLink";

interface PopulationDataRowProps {
  annotation: string
  poApiData: PopulationObservationResponse,
  variantAA: string
}

function PopulationDataRow(props: PopulationDataRowProps) {
  const variant = new Array<ProteinColocatedVariant>();
  const colocatedVariant = new Array<ProteinColocatedVariant>();
  props.poApiData.proteinColocatedVariant.forEach((variation) => {
    if (variation.alternativeSequence === props.variantAA) {
      variant.push(variation);
    } else {
      colocatedVariant.push(variation);
    }
  });

  const associatedDiseaseFlag = variant.length > 0 && variant[0].association ? true : false;
  return <tr>
    <td colSpan={TOTAL_COLS} className="expanded-row">
      <div className="significances-groups">
        <div className="column">
          <h5 style={{display: "inline"}}>
            <img src={PopulationIcon} className="click-icon" alt="population icon"
                 title="Population observation" /> Population Observation
          </h5>
          <HelpButton title="" content={<HelpContent name="population-observations" />} />
          <Spaces count={2} />
          <ShareAnnotationIcon annotation={props.annotation} />
          <table>
            <tbody>
              <tr>
                <th>Submitted Variant Details</th>
                <th>Co-located Variants at Residue Level</th>
              </tr>
              <tr>
                <td><SubmittedVariantDetails variants={variant}/></td>
                <td><CoLocatedVariantDetails coLocatedVariants={colocatedVariant}/></td>
              </tr>
            </tbody>
          </table>
          {associatedDiseaseFlag ? (
            <table>
              <tbody>
                <tr>
                  <th>Associated Diseases from UniProt</th>
                </tr>

                <tr>
                  <td><AssociationDetails associations={variant[0].association}/></td>
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