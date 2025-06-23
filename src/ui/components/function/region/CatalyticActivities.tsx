import RegionProteinProps from "./RegionProteinProps";
import Evidences from "../Evidences";
import { v1 as uuidv1 } from 'uuid';
import { RHEA_URL } from "../../../../constants/ExternalUrls";
import RegionProteinAccordion from "./RegionProteinAccordion";
import {CatalyticActivityComment, Comment, Reaction} from "../../../../types/Comment";
import {DbReference} from "../../../../types/Common";
import React, {Fragment} from "react";

function CatalyticActivities(props: RegionProteinProps) {
  return <RegionProteinAccordion title="Catalytic Activity" detailComponentGenerator={getCatalyticActivity} {...props}/>
}

function getCatalyticActivity(comment: Comment) {
  const reaction = (comment as CatalyticActivityComment).reaction;
  return (
    <Fragment key={uuidv1()}>
      <ul>
        <li>{reaction.name}</li>
      </ul>

      {catalyticActivityDetails(reaction)}
    </Fragment>
  );
}

function catalyticActivityDetails(reaction: Reaction) {
  const evidencesFlag = reaction.evidences && reaction.evidences.length > 0;
  return (
    <div>
      <ul>
        <li>{getRHEA(reaction.dbReferences ?? [])} </li>
      </ul>

      {evidencesFlag &&
        <ul>
          <li>
            <Evidences evidences={reaction.evidences ?? []} />
          </li>
        </ul>
      }
      <hr />
    </div>
  );
}

function getRHEA(dbReferences: Array<DbReference>) {
  const reaIds: Array<React.JSX.Element> = []
  if (dbReferences) {
    dbReferences.forEach((reference) => {
      if (reference.type === 'Rhea' && reference.id.includes('RHEA:')) {
        reaIds.push(
          <Fragment key={uuidv1()}>
            <a href={RHEA_URL + reference.id.split(':')[1]} target="_blank" rel="noreferrer" key={reference.id} className="ext-link">{reference.id}</a>
            <br />
          </Fragment>
        )
      }
    });
  }
  return <>{reaIds}</>;
}
export default CatalyticActivities;