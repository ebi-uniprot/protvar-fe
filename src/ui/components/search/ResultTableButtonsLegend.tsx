import ProteinIcon from '../../../images/proteins.svg'
import StructureIcon from '../../../images/structures-3d.svg'
import PopulationIcon from '../../../images/human.svg'

function ResultTableButtonsLegend() {
  return (
    <div>
      <strong>Annotations</strong>
      <br />
      <br />
      <div className="flex-column">
        <div className="flex">
          <img
            src={ProteinIcon}
            className="click-icon"
            alt="protein icon"
            title="Functional information icon - click in below table for more details"
          />{' '}
          Functional Information
        </div>
        <div className="flex">
          <img
            src={PopulationIcon}
            className="click-icon"
            alt="Population icon"
            title="Population Observation icon - click in below table for more details"
          />{' '}
          Population Observation
        </div>
        <div className="flex">
          <img
            src={StructureIcon}
            className="click-icon"
            alt="Structure icon"
            title="3D Structures icon - click in below table for more details"
          />{' '}
          Structures
        </div>
      </div>
    </div>
  )
}

export default ResultTableButtonsLegend
