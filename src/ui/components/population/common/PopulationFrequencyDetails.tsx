import {PopulationFrequency} from "../../../../types/PopulationObservation";

interface PopulationFrequencyDetailsProps {
  populationFrequencies: PopulationFrequency[];
}

function PopulationFrequencyDetails(props: PopulationFrequencyDetailsProps) {
  if (!props.populationFrequencies?.length) return null;

  return (
    <li className="population-freq-section">
      <b>Population Frequencies</b>
      <div>
        {props.populationFrequencies.map((freq, index) => (
          <PopulationFrequencyCard key={index} frequency={freq} />
        ))}
      </div>
    </li>
  );
}

function PopulationFrequencyCard({ frequency }: { frequency: PopulationFrequency }) {
  return (
    <div className="population-freq-item">
      <div className="population-freq-source">{frequency.sourceName}</div>
      <div className="population-freq-data">
        {frequency.populationName} - {frequency.frequency}
      </div>
    </div>
  );
}

export default PopulationFrequencyDetails;