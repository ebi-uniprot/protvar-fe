import { v1 as uuidv1 } from 'uuid';
import {PopulationFrequency} from "../../../../types/PopulationObservation";
interface PopulationFrequencyDetailsProps {
  populationFrequencies: Array<PopulationFrequency>
}
function PopulationFrequencyDetails(props: PopulationFrequencyDetailsProps) {
  if (!props.populationFrequencies?.length) return <></>;
  const frequencies = props.populationFrequencies.map(getPopFrequency);
  return (
    <li key={uuidv1()}>
      <b>Population Freuencies:</b> {frequencies}
    </li>
  );
}
function getPopFrequency(frequency: PopulationFrequency) {
  return (
    <>
      <ul>
        <li key={uuidv1()}>{frequency.sourceName}</li>
        <ul>
          <li key={uuidv1()}>{frequency.populationName}-{frequency.frequency}</li>
        </ul>
      </ul>
      <hr />
    </>
  );
}

export default PopulationFrequencyDetails;