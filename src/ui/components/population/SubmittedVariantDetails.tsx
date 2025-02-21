import XRefDetail from "./common/XRefDetail";
import {ProteinColocatedVariant} from "../../../types/PopulationObservationResponse";
import {AlleleFreq} from "./AlleleFreq";


interface SubmittedVariantDetailsProps {
  variants: Array<ProteinColocatedVariant>
  alleleFreq: number
}
function SubmittedVariantDetails(props: SubmittedVariantDetailsProps) {
  if (props.variants.length <= 0) {
    return <label><b>The variant has not been reported before</b></label>
  }

  let variant = props.variants[0];
  let change = variant.wildType + '>' + variant.alternativeSequence;

  return (
    <ul>
      {props.alleleFreq && <li>
        <AlleleFreq af={props.alleleFreq} stdColor={false} />
      </li>}
      <li>
        <b>Genomic Location:</b> {variant.genomicLocation}
      </li>
      <li>
        <b>Change:</b> {change}
      </li>
      <XRefDetail xrefs={variant.xrefs} populationFrequencies={variant.populationFrequencies}
                  clinicalSignificances={variant.clinicalSignificances}/>
    </ul>
  );
}

export default SubmittedVariantDetails;