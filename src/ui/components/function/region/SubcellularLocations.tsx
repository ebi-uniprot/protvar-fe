import RegionProteinProps from "./RegionProteinProps";
import RegionProtein from "./RegionProtein";
import {getActivityRegulation} from "./ActivityRegulations";
import { EmptyElement } from "../../../../constants/ConstElement";
import {Comment, SubcellLocationComment} from "../../../../types/Comment";

function SubcellularLocations(props: RegionProteinProps) {
  return <RegionProtein title="Subcellular Location" detailComponentGenerator={getSubcellularLocation} {...props} />
}

function getSubcellularLocation(comment: Comment) {
  const locations = (comment as SubcellLocationComment).locations;
  const locationList: string[] = [];
  const topologyList: string[] = [];

  locations.forEach((location) => {
    if (location.location) {
      locationList.push(location.location.value);
    }
    if (location.topology) {
      topologyList.push(location.topology.value);
    }
  });

  if (locationList.length === 0) {
    return EmptyElement;
  }

  const features = getActivityRegulation(comment);

  return (
    <div key={locationList.join('-')} className="protein-info-detail">
      {locationList.length > 0 && (
        <div className="info-row">
          <span className="info-label">Locations</span>
          <span className="info-value">{locationList.join(', ')}</span>
        </div>
      )}
      {topologyList.length > 0 && (
        <div className="info-row">
          <span className="info-label">Topologies</span>
          <span className="info-value">{topologyList.join(', ')}</span>
        </div>
      )}
      {features !== EmptyElement && (
        <div className="info-row">
          <span className="info-label">Features</span>
          <div className="info-value">{features}</div>
        </div>
      )}
    </div>
  );
}

export default SubcellularLocations;