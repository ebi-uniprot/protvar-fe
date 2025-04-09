import RegionProteinProps from "./RegionProteinProps";
import RegionProteinAccordion from "./RegionProteinAccordion";
import {getActivityRegulation} from "./ActivityRegulations";
import { v1 as uuidv1 } from 'uuid';
import { EmptyElement } from "../../../../constants/ConstElement";
import {Comment, SubcellLocationComment} from "../../../../types/Comment";

function SubcellularLocations(props: RegionProteinProps) {
  return <RegionProteinAccordion title="Subcellular Location" detailComponentGenerator={getSubcellularLocation} {...props} />
}

function getSubcellularLocation(comment: Comment) {
  const locations = (comment as SubcellLocationComment).locations;
  var locationList: Array<JSX.Element> = [];
  var topologyList: Array<JSX.Element> = [];
  locations.forEach((location) => {
    if (location.location)
      locationList.push(<li key={uuidv1()}>{location.location.value}</li>);
    if (location.topology)
      topologyList.push(<li key={uuidv1()}>{location.topology.value}</li>);
  });


  var loc = null;
  var topologies = null;
  var feature = null;
  if (locationList.length > 0)
    loc = (
      <label>
        <b>Locations : </b>
        <ul>{locationList}</ul>
      </label>
    );
  if (topologyList.length > 0)
    topologies = (
      <label>
        <b>Topologies : </b>
        <ul>{topologyList}</ul>
      </label>
    );
  const features = getActivityRegulation(comment);
  if (features !== EmptyElement)
    feature = (
      <label>
        <b>Features : </b>
        <ul>{features}</ul>
      </label>
    );
  if (locationList.length > 0) {
    return (
      <div key={uuidv1()}>
        {loc}
        {topologies}
        {feature}
      </div>
    );
  } else
    return EmptyElement;
}
export default SubcellularLocations;