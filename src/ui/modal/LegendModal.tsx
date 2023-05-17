import { useState, useCallback, useRef } from 'react';
import Button from '../elements/form/Button';
import Modal from './Modal';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import ResultTableButtonsLegend from '../components/search/ResultTableButtonsLegend';
import EveScoreColors from '../components/search/EveScoreColors';
import CaddLegendColors from '../components/search/CaddLegendColors';


function LegendModal() {
  const [showModel, setShowModel] = useState(false)
 
  const downloadModelDiv = useRef(null)
  useOnClickOutside(downloadModelDiv, useCallback(() => setShowModel(false), []));

  return <div id="view-legend-container" ref={downloadModelDiv} className="padding-left-1x">
    <Button onClick={() => setShowModel(val => !val)} className={'view-legend'}>
      View Legends
    </Button>
    <Modal show={showModel} handleClose={() => setShowModel(false)}>
    <div className='flex'>
      <EveScoreColors />
      <CaddLegendColors />
      <ResultTableButtonsLegend />
    </div>
    </Modal>
  </div>
}
export default LegendModal;