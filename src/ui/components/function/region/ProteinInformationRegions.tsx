import { useState } from 'react';
import ActivityRegulations, { getActivityRegulation } from './ActivityRegulations';
import AdditionalResources from './AdditionalResources';
import CatalyticActivities from "./CatalyticActivities";
import IntActs from './IntActs';
import RegionProteinAccordion from './RegionProteinAccordion';
import SubcellularLocations from './SubcellularLocations';
import {Comment, CommentType} from "../../../../types/Comment";

interface ProteinInformationRegionsProps {
  accession: string
  groupedComments: Map<string, Array<Comment>>
}
function ProteinInformationRegions(props: ProteinInformationRegionsProps) {
  const [expandedRegionKey, setExpandedRegionKey] = useState('');
  function toggleProteinRegion(key: string) {
    setExpandedRegionKey(expandedRegionKey === key ? '' : key)
  }
  const { groupedComments, accession } = props;

  const get = (type: string) => groupedComments.get(type) ?? [];

  return <>
    <CatalyticActivities comments={get(CommentType.CATALYTIC_ACTIVITY)} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <ActivityRegulations comments={get(CommentType.ACTIVITY_REGULATION)} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <RegionProteinAccordion comments={get(CommentType.SUBUNIT)} title="Complex" detailComponentGenerator={getActivityRegulation}
      expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <SubcellularLocations comments={get(CommentType.SUBCELLULAR_LOCATION)} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <RegionProteinAccordion comments={get(CommentType.DOMAIN)} title="Domains" detailComponentGenerator={getActivityRegulation}
      expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <RegionProteinAccordion comments={get(CommentType.PTM)} title="PTM's" detailComponentGenerator={getActivityRegulation}
      expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <RegionProteinAccordion comments={get(CommentType.SIMILARITY)} title="Family" detailComponentGenerator={getActivityRegulation}
      expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <AdditionalResources comments={get(CommentType.WEBRESOURCE)} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} />
    <IntActs comments={get(CommentType.INTERACTION)} expandedRegionKey={expandedRegionKey} toggleProteinRegion={toggleProteinRegion} accession={accession} />
  </>
}

export default ProteinInformationRegions;