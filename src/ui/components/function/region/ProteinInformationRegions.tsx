import { useState } from 'react';
import {Comment} from "../../../../types/FunctionalResponse";
import { divideProteinRegions } from "../ProteinHelper";
import ActivityRegulations, { getActivityRegulation } from './ActivityRegulations';
import AdditionalResources from './AdditionalResources';
import CatalyticActivities from "./CatalyticActivities";
import Interactions from './Interactions';
import RegionProteinAccordion from './RegionProteinAccordion';
import SubcellularLocations from './SubcellularLocations';

interface ProteinInformationRegionsProps {
  accession: string
  comments: Array<Comment>
}
function ProteinInformationRegions(props: ProteinInformationRegionsProps) {
  const [expandedRegionKey, setExpandedRegionKey] = useState('');
  function toggleProteinRegion(key: string) {
    setExpandedRegionKey(expandedRegionKey === key ? '' : key)
  }
  const { comments, accession } = props;
  const [catalyticActivities, activityRegulations, subunits, subcellularLocations, ptms,
    similarities, webResources, domains, interactions] = divideProteinRegions(comments)
  return <>
    <CatalyticActivities comments={catalyticActivities} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <ActivityRegulations comments={activityRegulations} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <RegionProteinAccordion comments={subunits} title="Complex" detailComponentGenerator={getActivityRegulation}
      expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <SubcellularLocations comments={subcellularLocations} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <RegionProteinAccordion comments={domains} title="Domains" detailComponentGenerator={getActivityRegulation}
      expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <RegionProteinAccordion comments={ptms} title="PTM's" detailComponentGenerator={getActivityRegulation}
      expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <RegionProteinAccordion comments={similarities} title="Family" detailComponentGenerator={getActivityRegulation}
      expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <AdditionalResources comments={webResources} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <Interactions comments={interactions} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} accession={accession} />
  </>
}

export default ProteinInformationRegions;