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
  let name = frequency.sourceName;
  let frequencies = frequency.frequencies.map((freq) => {
    return (
      <li key={uuidv1()}>
        {freq.label}-{freq.value}
      </li>
    );
  });
  return (
    <>
      <ul>
        <li key={uuidv1()}>{name}</li>
        <ul>
          <li key={uuidv1()}>{frequencies}</li>
        </ul>
      </ul>
      <hr />
    </>
  );
}

export default PopulationFrequencyDetails;