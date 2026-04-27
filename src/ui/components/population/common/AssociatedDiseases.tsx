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
  const text = (association.description || association.name).replace(/α/g, "Alpha");

  return (
    <div className="association-card">
      <ExpandableText text={text} charLimit={150} />
      <Evidences evidences={association.evidences} />
    </div>
  );
}

export default AssociatedDiseases;
