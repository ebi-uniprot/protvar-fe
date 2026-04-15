import AssociatedDiseases from "../common/AssociatedDiseases";
import XRefList from "../common/XRefList";
import PopulationFrequencyDetails from "../common/PopulationFrequencyDetails";
import { StringVoidFun } from "../../../../constants/CommonTypes";
import {VariantAssociation, Variant} from "../../../../types/PopulationObservation";

interface CoLocatedVariantGenomicLocationProps {
  coLocatedVariant: Variant;
  expandedGenomicKey: string;
  toggleGenomic: StringVoidFun;
}

function getGenomicLocation(props: CoLocatedVariantGenomicLocationProps): string {
  if (props.coLocatedVariant.genomicLocation) {
    return props.coLocatedVariant.genomicLocation[0];
  }
  return `No genomic location (${props.coLocatedVariant.xrefs[0].id})`;
}

function CoLocatedVariantGenomicLocation(props: CoLocatedVariantGenomicLocationProps) {
  const location = getGenomicLocation(props);
  const isExpanded = props.expandedGenomicKey === location;

  return (
    <div className="genomic-location-section">
      <button
        type="button"
        className="collapsible"
        onClick={() => props.toggleGenomic(location)}
        aria-expanded={isExpanded}
      >
        <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} chevron-icon`}></i>
        <b>{location}</b>
      </button>

      {isExpanded &&
        <CoLocatedVariantGenomicLocationDetail {...props} />}
    </div>
  );
}

function CoLocatedVariantGenomicLocationDetail(props: CoLocatedVariantGenomicLocationProps) {
  const variant = props.coLocatedVariant;

  return (
    <div className="colocated-variant-xrefs">
      <XRefList
        xrefs={variant.xrefs}
        populationFrequencies={variant.populationFrequencies}
        clinicalSignificances={variant.clinicalSignificances}
      />

      {getAssociationsTag(variant.association)}

      <PopulationFrequencyDetails populationFrequencies={variant.populationFrequencies} />
    </div>
  );
}

function getAssociationsTag(associations: Array<VariantAssociation>) {
  if (associations && associations.length > 0) {
    return (
      <li>
        <b>Associated Diseases from UniProt:</b>
        <AssociatedDiseases associations={associations} />
      </li>
    );
  }
}

export default CoLocatedVariantGenomicLocation;