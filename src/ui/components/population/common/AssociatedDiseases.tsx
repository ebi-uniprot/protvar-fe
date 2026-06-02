import React from "react";
import Evidences from "../../common/Evidences";
import {VariantAssociation} from "../../../../types/PopulationObservation";
import {ExpandableList} from "../../common/ExpandableList";
import {ExpandableText} from "../../common/ExpandableText";


interface AssociatedDiseasesProps {
  associations: VariantAssociation[];
}

function AssociatedDiseases({ associations }: AssociatedDiseasesProps) {
  if (!associations || associations.length === 0) return null;

  return (
    <div className="association-section">
      <div className="section-title">
        <span>Associated Diseases <span className="count-badge">{associations.length}</span></span>
      </div>
      <ExpandableList
        items={associations}
        renderItem={(association, index) => (
          <AssociationCard key={index} association={association} />
        )}
      />
    </div>
  );
}

function AssociationCard({ association }: { association: VariantAssociation }) {
  const name = association.name?.replace(/α/g, "Alpha");
  const description = association.description?.replace(/α/g, "Alpha");
  const showDescription = description && description !== name;

  return (
    <div className="association-card">
      {name && <div className="association-name">{name}</div>}
      {showDescription && <ExpandableText text={description} charLimit={150} />}
      <Evidences evidences={association.evidences} />
    </div>
  );
}

export default AssociatedDiseases;
