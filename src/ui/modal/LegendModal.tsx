import {useState, useCallback, useRef, useContext} from 'react'
import { v1 as uuidv1 } from 'uuid';
import Button from '../elements/form/Button'
import Modal from './Modal'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import AnnotationLegend from './AnnotationLegend'
import {CADD_SCORE_ATTR} from "../components/search/CaddScorePred";
import {PredAttr} from "../components/function/prediction/Prediction";
import {AM_SCORE_ATTR} from "../components/function/prediction/AlphaMissensePred";
import {EVE_SCORE_ATTR} from "../components/function/prediction/EvePred";
import {StdColorContext} from "../App";

function LegendModal(props: {toggleStdColor: () => void}) {
  const stdColor = useContext(StdColorContext);
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
            <CaddLegend stdColor={stdColor} />
          </div>
          <div className="legend-div">
            <ConservLegend/><br/>
            <AlphaMissenseLegend stdColor={stdColor} />
          </div>
          <div className="legend-div">
            <EsmLegend stdColor={stdColor} /><br/>
            <EveLegend stdColor={stdColor} />
          </div>
          <div className="legend-div">
            <AnnotationLegend/>
          </div>
        </div>
        <div className="padding-left-right-1x float-right">
          <label>
            <input type="checkbox" checked={stdColor} onChange={props.toggleStdColor} />
            Standard colours
          </label>
        </div>
      </Modal>
    </div>
  )
}

interface CommonLegendProps {
  stdColor: boolean
}

function CaddLegend(props: CommonLegendProps) {
  return (
    <div className="search-results-legends">
      <strong>CADD phred-like score</strong>
      <br />
      <div className="flex-column">
        {
          Object.values(CADD_SCORE_ATTR).map((sc: PredAttr) => {
            return <div key={uuidv1()} className="flex">
              <span className="padding-left-right-1x">
                  <i className="bi bi-square-fill" style={{color: (props.stdColor ? sc.stdColor : sc.color)}}></i>
                </span>
              <div className="flex1">{sc.title}</div>
            </div>;
          })
        }
      </div>
    </div>
  );
}

function ConservLegend() {
  return (
    <div className="search-results-legends" style={{float: "unset"}}>
      <strong>Residue conservation</strong>
      <br/>
      <br/>
      <div className="flex-column">
        <div className="flex">
                  <span className="padding-left-right-1x">
                    <div className="conserv-score-grad"></div>
                    <div className="score-label">Low High</div>
                  </span>
        </div>
      </div>
    </div>
  );
}

function EsmLegend(props: CommonLegendProps) {
  return (
    <div className="search-results-legends" style={{ float: "unset" }}>
      <strong>ESM1b LLR score</strong>
      <br />
      <br />
      <div className="flex-column">
        <div className="flex">
                  <span className="padding-left-right-1x">
                    <div className={`esm1b-score-grad${props.stdColor ? '-std' : ''}`}></div>
                    <div className="score-label">0  -5  -10  -15  -20  -25</div>
                  </span>
        </div>
      </div>
    </div>
  );
}

function AlphaMissenseLegend(props: CommonLegendProps) {
  return <div className="search-results-legends" style={{float: "unset"}}>
    <strong>AlphaMissense score</strong>
    <br/>
    <div className="flex-column">
      {
        Object.values(AM_SCORE_ATTR).map((sc: PredAttr) => {
          return <div key={uuidv1()} className="flex">
                <span className="padding-left-right-1x">
                  <i className="bi bi-circle-fill" style={{color: (props.stdColor ? sc.stdColor : sc.color)}}></i>
                </span>
            <div className="flex1">{sc.title}</div>
          </div>;
        })
      }
    </div>
    <br/>
  </div>;
}

function EveLegend(props: CommonLegendProps) {
  return (
    <div className="search-results-legends" style={{ float: "unset" }}>
      <strong>EVE score</strong>
      <br />
      <div className="flex-column">
        {
          Object.values(EVE_SCORE_ATTR).map((sc: PredAttr) => {
            return <div key={uuidv1()} className="flex">
              <span className="padding-left-right-1x">
                <i className="bi bi-circle-fill" style={{color: (props.stdColor ? sc.stdColor : sc.color)}}></i>
              </span>
              <div className="flex1">{sc.title}</div>
            </div>;
          })
        }
      </div>
      <br/>
    </div>
  );
}

export default LegendModal
