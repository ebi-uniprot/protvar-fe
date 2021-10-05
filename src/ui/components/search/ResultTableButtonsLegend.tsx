import ProteinIcon from '../../../images/proteins.svg';
import StructureIcon from '../../../images/structures-3d.svg';
import PopulationIcon from '../../../images/human.svg';

function ResultTableButtonsLegend() {
  return (
    <div className="flex align-items-center">
      <div className="flex">
        <img src={ProteinIcon} className="click-icon" alt="protein icon" title="Functional information" /> Functional Information
      </div>
      <div className="flex">
        <img src={PopulationIcon} className="click-icon" alt="Population icon" title="Population Observation" /> Population Observation
      </div>
      <div className="flex">
        <img src={StructureIcon} className="click-icon" alt="Structure icon" title="3D Structures" /> Structures
      </div>
    </div>
  );
}

export default ResultTableButtonsLegend;