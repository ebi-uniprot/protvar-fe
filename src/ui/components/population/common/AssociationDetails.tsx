import { Fragment } from "react"
import Evidences from "../../function/Evidences";
import { v1 as uuidv1 } from 'uuid';
import {Association} from "../../../../types/PopulationObservationResponse";

interface AssociationDetailsProps {
  associations: Array<Association>
}
function AssociationDetails(props: AssociationDetailsProps) {
  return <>{props.associations.map(getAssociation)}</>;
}
function getAssociation(association: Association) {
  let name = association.name;
  if (association.description)
    name = name + '-' + association.description;
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