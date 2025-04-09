import { Fragment } from "react"
import Evidences from "../../function/Evidences";
import { v1 as uuidv1 } from 'uuid';
import {VariantAssociation} from "../../../../types/PopulationObservation";

interface AssociationDetailsProps {
  associations: Array<VariantAssociation>
}
function AssociationDetails(props: AssociationDetailsProps) {
  if (props.associations.length === 0)
    return <>No association found</>
  return <>{props.associations.map(getAssociation)}</>;
}
function getAssociation(association: VariantAssociation) {
  let name = association.name;
  if (association.description)
    name = name + '-' + association.description.replace(/α/g, "Alpha");
  return (
    <Fragment key={uuidv1()}>
      <ul>
        <li>{name}</li>
        <li>
          <Evidences evidences={association.evidences} />
        </li>
      </ul>
      <hr />
    </Fragment>
  );
}
export default AssociationDetails;