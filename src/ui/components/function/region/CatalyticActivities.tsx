import RegionProteinProps from "./RegionProteinProps";
import Evidences from "../../categories/Evidences";
import { Comment, DBReference, Reaction } from '../FunctionalDetail'
import { RHEA_URL } from "../../../../constants/ExternalUrls";
import RegionProteinAccordion from "./RegionProteinAccordion";

function CatalyticActivities(props: RegionProteinProps) {
  return <RegionProteinAccordion title="Catalytic Activity" detailComponentGenerator={getCatalyticActivity} {...props} />
}

function getCatalyticActivity(region: Comment) {
  var reaction = region.reaction;
  return (
    <>
      <ul>
        <li>{reaction.name}</li>
      </ul>

      {catalyticActivityDetails(reaction)}
    </>
  );
}

function catalyticActivityDetails(reaction: Reaction) {
  const evidencesFlag = reaction.evidences && reaction.evidences.length > 0;
  return (
    <div>
      <ul>
        <li>{getRHEA(reaction.dbReferences)} </li>
      </ul>

      {evidencesFlag &&
        <ul>
          <li>
            <Evidences evidences={reaction.evidences} />
          </li>
        </ul>
      }
      <hr />
    </div>
  );
}

function getRHEA(dbReferences: Array<DBReference>) {
  const reaIds: Array<JSX.Element> = []
  if (dbReferences) {
    dbReferences.forEach((reference) => {
      if (reference.type === 'Rhea' && reference.id.includes('RHEA:')) {
        reaIds.push(
          <>
            <a href={RHEA_URL + reference.id.split(':')[1]} target="_blank" rel="noreferrer" key={reference.id}>{reference.id}</a>
            <br />
          </>
        )
      }
    });
  }
  return <>{reaIds}</>;
}
export default CatalyticActivities;