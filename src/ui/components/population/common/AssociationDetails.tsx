import Evidences from "../../categories/Evidences";
import { Association } from "../PopulationDetail";
import { v1 as uuidv1 } from 'uuid';

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
    <>
      <ul>
        <li key={uuidv1()}>{name}</li>
        <li key={uuidv1()}>
          <Evidences evidences={association.evidences} />
        </li>
      </ul>
      <hr />
    </>
  );
}
export default AssociationDetails;