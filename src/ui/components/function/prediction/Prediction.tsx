import {ConservPred} from "./ConservPred";
import {AlphaMissensePred} from "./AlphaMissensePred";
//import {EvePred} from "./EvePred";
import {EsmPred} from "./EsmPred";
import {FoldxPred} from "./FoldxPred";
import React, {useContext, useState} from "react";
import {AppContext} from "../../../App";
import {CaddScorePred} from "./CaddScorePred";
import {PopEvePred} from "./PopEvePred";
import {FunctionalInfo} from "../../../../types/FunctionalInfo";
import {AmScore, TranslatedSequence} from "../../../../types/MappingResponse";
import {Missense3dPred} from "./Missense3dPred";
import {usePredictionHighlight} from "../../../../hooks/usePredictionHighlight";
import {PredictionWrapper} from "./PredictionWrapper";
import {PredictionRadar} from "./PredictionRadar";

export type PredAttr = {
  text: string,
  color: string,
  stdColor: string,
  tip?: string,
  range?: string,
  threshold?: number
}

export interface PredictionProps {
  functionalData: FunctionalInfo
  refAA: string
  variantAA: string
  ensg: string;
  ensp: TranslatedSequence[];
  caddScore: string;
  amScore: AmScore;
}

export const Prediction = (props: PredictionProps) => {
  const state = useContext(AppContext);
  const { highlightedPrediction } = usePredictionHighlight();
  const [view, setView] = useState<'chart' | 'table'>('table');

  const hasScores = !!(
    props.functionalData.conservScore ||
    props.amScore ||
    (props.caddScore && props.caddScore !== '-') ||
    props.functionalData.esmScore ||
    props.functionalData.popEveScore ||
    (props.functionalData.foldxs?.length ?? 0) > 0 ||
    props.functionalData.m3dPred
  );

  return (
    <>
      {hasScores && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <div className="view-toggle">
            <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>
              <i className="bi bi-table" /> Table
            </button>
            <button className={view === 'chart' ? 'active' : ''} onClick={() => setView('chart')}>
              <i className="bi bi-radar" /> Chart<sup><i className="bi bi-flask" title="Experimental feature" /></sup>
            </button>
          </div>
        </div>
      )}

      {view === 'chart' && <PredictionRadar
        conservScore={props.functionalData.conservScore}
        amScore={props.amScore}
        caddScore={props.caddScore}
        esmScore={props.functionalData.esmScore}
        popEveScore={props.functionalData.popEveScore}
        foldxs={props.functionalData.foldxs}
        variantAA={props.variantAA}
        m3dPred={props.functionalData.m3dPred}
      />}

      {view === 'table' && <>
      {/* 1. CONSERVATION - Fundamental evolutionary context */}
      {/*<div className="prediction-subsection-header">Conservation</div>*/}
      <PredictionWrapper
        predictionType="conserv"
        isHighlighted={highlightedPrediction === 'conserv'}
      >
        <ConservPred conserv={props.functionalData.conservScore} stdColor={state.stdColor} />
      </PredictionWrapper>

      {/* 2. PATHOGENICITY PREDICTIONS - Most clinically relevant */}
      {/*<div className="prediction-subsection-header">Pathogenicity</div>*/}
      {/*!hasPathogenicityPredictions && (
        <div className="no-predictions">No pathogenicity predictions available for this variant</div>
      )*/}

      {/* AlphaMissense - Newest, best performance, widely trusted */}
      <PredictionWrapper
        predictionType="alphamissense"
        isHighlighted={highlightedPrediction === 'alphamissense'}
      >
        <AlphaMissensePred am={props.amScore} stdColor={state.stdColor} />
      </PredictionWrapper>

      {/* CADD - Well-established, widely cited, good benchmark */}
      <PredictionWrapper
        predictionType="cadd"
        isHighlighted={highlightedPrediction === 'cadd'}
      >
        <CaddScorePred cadd={props.caddScore} stdColor={state.stdColor} />
      </PredictionWrapper>

      {/* ESM-1b - Protein language model, complementary approach */}
      <PredictionWrapper
        predictionType="esm"
        isHighlighted={highlightedPrediction === 'esm'}
      >
        <EsmPred esm={props.functionalData.esmScore} stdColor={state.stdColor} />
      </PredictionWrapper>

      {/* PopEVE - Population genetics-aware, good for rare variants */}
      <PredictionWrapper
        predictionType="popeve"
        isHighlighted={highlightedPrediction === 'popeve'}
      >
        <PopEvePred popeve={props.functionalData.popEveScore} stdColor={state.stdColor} />
      </PredictionWrapper>

      {/* EVE - Currently commented out */}
      {/*<EvePred eve={props.functionalData.eveScore} stdColor={state.stdColor}/>*/}

      {/* 3. STRUCTURE PREDICTIONS - Mechanistic insight */}
      {/*<div className="prediction-subsection-header">Structure</div>*/}
      {/*!hasStructurePredictions && (
        <div className="no-predictions">No structure predictions available for this variant</div>
      )*/}

      {/* FoldX - Stability change (ΔΔG) */}
      <PredictionWrapper
        predictionType="foldx"
        isHighlighted={highlightedPrediction === 'foldx'}
      >
        <FoldxPred foldxs={props.functionalData.foldxs} variantAA={props.variantAA} />
      </PredictionWrapper>

      {/* Missense3D - Structural features affected */}
      <PredictionWrapper
        predictionType="m3d"
        isHighlighted={highlightedPrediction === 'm3d'}
      >
        <Missense3dPred functionalData={props.functionalData} refAA={props.refAA} variantAA={props.variantAA} />
      </PredictionWrapper>
      </>}
    </>
  );
}