import { Comment } from './FunctionalDetail'

export function divideProteinRegions(regions: Array<Comment> | null | undefined) {
  const catalyticActivities: Array<Comment> = [];
  const activityRegulations: Array<Comment> = [];
  const subunits: Array<Comment> = [];
  const subcellularLocations: Array<Comment> = [];
  const domains: Array<Comment> = [];
  const ptms: Array<Comment> = [];
  const similarities: Array<Comment> = [];
  const webResources: Array<Comment> = [];
  const interactions: Array<Comment> = [];
  regions?.forEach((region) => {
    switch (region.type) {
      case 'CATALYTIC_ACTIVITY':
        catalyticActivities.push(region);
        break;
      case 'ACTIVITY_REGULATION':
        activityRegulations.push(region);
        break;
      case 'SUBUNIT':
        subunits.push(region);
        break;
      case 'SUBCELLULAR_LOCATION':
        subcellularLocations.push(region);
        break;
      case 'DOMAIN':
        domains.push(region);
        break;
      case 'PTM':
        ptms.push(region);
        break;
      case 'SIMILARITY':
        similarities.push(region);
        break;
      case 'WEBRESOURCE':
        webResources.push(region);
        break;
      case 'INTERACTION':
        interactions.push(region);
        break;
    }
  });
  return [
    catalyticActivities,
    activityRegulations,
    subunits,
    subcellularLocations,
    ptms,
    similarities,
    webResources,
    domains,
    interactions
  ];
}