import React from "react";
import Evidences from "../../common/Evidences";
import {VariantAssociation} from "../../../../types/PopulationObservation";

interface AssociationDetailsProps {
  associations: VariantAssociation[];
}

function AssociationDetails(props: AssociationDetailsProps) {
  if (props.associations.length === 0) {
    return <div className="no-data-message">No association found</div>;
  }

  return (
    <div>
      {props.associations.map((association, index) => (
        <AssociationCard key={index} association={association} />
      ))}
    </div>
  );
}

function AssociationCard({ association }: { association: VariantAssociation }) {
  let name = association.name;
  if (association.description) {
    name = name + ' - ' + association.description.replace(/α/g, "Alpha");
  }

  return (
    <div className="association-card">
      <div className="association-name">{name}</div>
      <Evidences evidences={association.evidences} />
    </div>
  );
}

export default AssociationDetails;