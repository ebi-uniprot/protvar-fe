import { v1 as uuidv1 } from 'uuid';
import { PopulationFrequency } from '../PopulationDetail';
interface PopulationFrequencyDetailsProps {
  populationFrequencies: Array<PopulationFrequency>
}
function PopulationFrequencyDetails(props: PopulationFrequencyDetailsProps) {
  const frequencies = props.populationFrequencies.map(getPopFrequency);
  if (frequencies.length <= 0)
    return <></>

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