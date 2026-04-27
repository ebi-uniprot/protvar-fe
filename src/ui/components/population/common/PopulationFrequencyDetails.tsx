import {PopulationFrequency} from "../../../../types/PopulationObservation";

interface PopulationFrequencyDetailsProps {
  populationFrequencies: PopulationFrequency[];
}

function PopulationFrequencyDetails({ populationFrequencies }: PopulationFrequencyDetailsProps) {
  if (!populationFrequencies?.length) return null;

  const grouped = populationFrequencies.reduce((acc, freq) => {
    const key = freq.sourceName || '_';
    if (!acc[key]) acc[key] = [];
    acc[key].push(freq);
    return acc;
  }, {} as Record<string, PopulationFrequency[]>);

  return (
    <div className="population-freq-section">
      <div className="section-title">Population Frequencies</div>
      <div className="pop-freq-groups">
        {Object.entries(grouped).map(([source, freqs]) => (
          <div key={source} className="pop-freq-source-group">
            {source !== '_' && (
              <span className="pop-freq-source-name">{source}</span>
            )}
            {freqs.map((freq, i) => (
              <div key={i} className="pop-freq-row">
                <span className="pop-freq-population">{freq.populationName}</span>
                <span className="pop-freq-value">{freq.frequency.toExponential(2)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopulationFrequencyDetails;
