import React, {useState, useCallback, useRef, useContext} from 'react'
import { v1 as uuidv1 } from 'uuid';
import Modal from './Modal'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import AnnotationLegend from './AnnotationLegend'
import {CADD_SCORE_ATTR} from "../components/function/prediction/CaddScorePred";
import {PredAttr} from "../components/function/prediction/Prediction";
import {AM_SCORE_ATTR} from "../components/function/prediction/AlphaMissensePred";
import {AF_ATTR} from "../components/population/PopulationAlleleFreq";
//import {EVE_SCORE_ATTR} from "../components/function/prediction/EvePred";
import {POPEVE_SCORE_ATTR} from "../components/function/prediction/PopEvePred";
import {AppContext} from "../App";
import {ColourCheckbox} from "./ColourCheckbox";

function LegendModal() {
  const state = useContext(AppContext)
  const [showModel, setShowModel] = useState(false)

  const downloadModelDiv = useRef(null)
  useOnClickOutside(
    downloadModelDiv,
    useCallback(() => setShowModel(false), []),
  )

  return (<>
      <i className="bi bi-circle-half icon-btn"
         onClick={() => setShowModel((val) => !val)}
      > View Legends</i>

  <div
    id="view-legend-container"
    ref={downloadModelDiv}
  >
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
            <CaddLegend stdColor={state.stdColor}/>
          </div>
          <div className="legend-div">
            <ConservLegend stdColor={state.stdColor}/><br/>
            <AlphaMissenseLegend stdColor={state.stdColor}/>
            <AlleleFreqLegend stdColor={false}/>
          </div>
          <div className="legend-div">
            <EsmLegend stdColor={state.stdColor}/><br/>
            {/*<EveLegend stdColor={state.stdColor}/>*/}
            <PopEveLegend stdColor={state.stdColor}/>
          </div>
          <div className="legend-div">
            <AnnotationLegend/>
          </div>
        </div>
        <div className="padding-left-right-1x float-right">
          <ColourCheckbox state={state}/>
        </div>
      </Modal>
    </div>

    </>
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
              <div className="flex1">{`${sc?.range} ${sc?.text}`}</div>
            </div>;
          })
        }
      </div>
    </div>
  );
}

function ConservLegend(props: CommonLegendProps) {
  return (
    <div className="search-results-legends" style={{ float: "unset" }}>
      <strong>Residue conservation</strong>
      <br />
      <br />
      <div className="flex-column">
        <div className="flex">
                  <span className="padding-left-right-1x">
                    <div className={`conserv-score-grad${props.stdColor ? '-std' : ''}`}></div>
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
            <div className="flex1">{sc.text}</div>
          </div>;
        })
      }
    </div>
    <br/>
  </div>;
}

function AlleleFreqLegend(props: CommonLegendProps) {
  return <div className="search-results-legends" style={{float: "unset"}}>
    <strong>GnomAD allele frequency</strong>
    <br/>
    <div className="flex-column">
      {
        Object.values(AF_ATTR).map((sc: PredAttr) => {
          return <div key={uuidv1()} className="flex">
                <span className="padding-left-right-1x">
                  <i className="bi bi-circle-fill" style={{color: (props.stdColor ? sc.stdColor : sc.color)}}></i>
                </span>
            <div className="flex1">{sc.text} ({sc.range})</div>
          </div>;
        })
      }
    </div>
    <br/>
  </div>;
}
// eslint-disable-next-line
{/*
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
              <div className="flex1">{sc.text}</div>
            </div>;
          })
        }
      </div>
      <br/>
    </div>
  );
}
*/}
function PopEveLegend(props: CommonLegendProps) {
  return (
    <div className="search-results-legends" style={{ float: "unset" }}>
      <strong>popEVE score</strong>
      <br />
      <div className="flex-column">
        {
          Object.values(POPEVE_SCORE_ATTR).map((sc: PredAttr) => {
            return <div key={uuidv1()} className="flex">
              <span className="padding-left-right-1x">
                <i className="bi bi-circle-fill" style={{color: (props.stdColor ? sc.stdColor : sc.color)}}></i>
              </span>
              <div className="flex1">{sc.text} ({sc.range})</div>
            </div>;
          })
        }
      </div>
      <div style={{ fontSize: '0.9em', fontStyle: 'italic', marginTop: '0.5em' }}>
        Low confidence when gap freq &gt; 0.5
      </div>
      <br/>
    </div>
  );
}

export default LegendModal
