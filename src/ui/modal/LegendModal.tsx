import { useState, useCallback, useRef } from 'react'
import Button from '../elements/form/Button'
import Modal from './Modal'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import ResultTableButtonsLegend from '../components/search/ResultTableButtonsLegend'
import EveScoreColors from '../components/search/EveScoreColors'
import CaddLegendColors from '../components/search/CaddLegendColors'

function LegendModal() {
  const [showModel, setShowModel] = useState(false)

  const downloadModelDiv = useRef(null)
  useOnClickOutside(
    downloadModelDiv,
    useCallback(() => setShowModel(false), []),
  )

  return (
    <div
      id="view-legend-container"
      ref={downloadModelDiv}
      className="padding-left-1x"
    >
      <Button
        onClick={() => setShowModel((val) => !val)}
        className={'view-legend'}
      >
        View Legends
      </Button>
      <Modal show={showModel} handleClose={() => setShowModel(false)}>
        <div className="window__header">
          <span className="window__header__title">Table Legends</span>
          <span
            className="modal-close-button"
            onClick={() => setShowModel(false)}
          >
            <i className="bi bi-x-lg"></i>
        </span>
        </div>
        <div className="legend-modal-content">
            <div className="legend-div">
            <EveScoreColors />
            </div>
          <div className="legend-div">
          <CaddLegendColors />
          </div>
          <div className="legend-div">
          <ResultTableButtonsLegend />
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default LegendModal
