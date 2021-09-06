import AssociationDetails from "../common/AssociationDetails";
import XRefDetail from "../common/XRefDetail";
import { Association, ProteinColocatedVariant } from "../PopulationDetail";
import { v1 as uuidv1 } from 'uuid';
import PopulationFrequencyDetails from "../common/PopulationFrequencyDetails";
import { StringVoidFun } from "../../../../constants/CommonTypes";
import { ReactComponent as ChevronDownIcon } from "franklin-sites/src/svg/chevron-down.svg";

interface CoLocatedVariantGenomicLocationAccordionProps {
  coLocatedVariant: ProteinColocatedVariant
  expendedGenomicKey: string
  toggleGenomic: StringVoidFun
}
function CoLocatedVariantGenomicLocationAccordion(props: CoLocatedVariantGenomicLocationAccordionProps) {
  return (
    <ul>
      <li key={uuidv1()}>
        <button
          type="button"
          className="collapsible"
          onClick={(e) => props.toggleGenomic(props.coLocatedVariant.genomicLocation)}
        >
          <b>{props.coLocatedVariant.genomicLocation}</b>
          <ChevronDownIcon className="chevronicon" />
        </button>
      </li>
      {props.expendedGenomicKey === props.coLocatedVariant.genomicLocation &&
        <CoLocatedVariantGenomicLocationAccordionDetail {...props} />
      }
    </ul>
  );
}

function CoLocatedVariantGenomicLocationAccordionDetail(props: CoLocatedVariantGenomicLocationAccordionProps) {
  const variant = props.coLocatedVariant;
  return (
    <ul>
      <XRefDetail xrefs={variant.xrefs} populationFrequencies={variant.populationFrequencies}
        clinicalSignificances={variant.clinicalSignificances} />

      {getAssociationsTag(variant.association)}

      <PopulationFrequencyDetails populationFrequencies={variant.populationFrequencies} />
    </ul>
  );
}

function getAssociationsTag(associations: Array<Association>) {
  if (associations && associations.length > 0) {
    return (
      <li key={uuidv1()}>
        <b>Associated Diseases:</b>
        <AssociationDetails associations={associations} />
      </li>
    );
  }
}

export default CoLocatedVariantGenomicLocationAccordion;