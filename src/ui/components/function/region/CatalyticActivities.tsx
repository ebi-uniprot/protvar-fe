import RegionProteinProps from "./RegionProteinProps";
import Evidences from "../../common/Evidences";
import { RHEA_URL } from "../../../../constants/ExternalUrls";
import RegionProtein from "./RegionProtein";
import {CatalyticActivityComment, Comment} from "../../../../types/Comment";
import {DbReference} from "../../../../types/Common";
import React from "react";
import {ExtLink} from "../../common/Link";

function CatalyticActivities(props: RegionProteinProps) {
  return <RegionProtein title="Catalytic Activity" detailComponentGenerator={getCatalyticActivity} {...props}/>
}

function getCatalyticActivity(comment: Comment) {
  const reaction = (comment as CatalyticActivityComment).reaction;
  const rhea = getRHEA(reaction.dbReferences ?? []);

  return (
    <div key={reaction.name} className="protein-info-detail">
      <p className="reaction-name">{reaction.name}</p>
      {rhea && (
        <div className="rhea-links">{rhea}</div>
      )}
      <Evidences evidences={reaction.evidences ?? []} />
    </div>
  );
}

function getRHEA(dbReferences: Array<DbReference>) {
  const reaIds: Array<React.JSX.Element> = [];

  if (dbReferences) {
    dbReferences.forEach((reference) => {
      if (reference.type === 'Rhea' && reference.id.includes('RHEA:')) {
        reaIds.push(<ExtLink key={reference.id} url={RHEA_URL + reference.id.split(':')[1]} text={reference.id} />);
      }
    });
  }

  return reaIds.length > 0 ? <>{reaIds}</> : null;
}

export default CatalyticActivities;