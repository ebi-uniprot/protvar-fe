import {ConservPred} from "./ConservPred";
import {AlphaMissensePred} from "./AlphaMissensePred";
//import {EvePred} from "./EvePred";
import {EsmPred} from "./EsmPred";
import {FoldxPred} from "./FoldxPred";
import React, {useContext} from "react";
import {AppContext} from "../../../App";
import {CaddScorePred} from "./CaddScorePred";
import {PopEvePred} from "./PopEvePred";
import {FunctionalInfo} from "../../../../types/FunctionalInfo";
import {AmScore, TranslatedSequence} from "../../../../types/MappingResponse";
import {Missense3dPred} from "./Missense3dPred";
import {usePredictionHighlight} from "../../../../hooks/usePredictionHighlight";
import {PredictionWrapper} from "./PredictionWrapper";

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
  const highlightedPrediction = usePredictionHighlight();

  const hasPathogenicityPredictions = props.caddScore || props.amScore ||
    props.functionalData.eveScore || props.functionalData.esmScore ||
    props.functionalData.popEveScore;

  const hasStructurePredictions = (props.functionalData.foldxs && props.functionalData.foldxs.length > 0) ||
    props.functionalData.m3dPred;

  return (
    <>
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
    </>
  );
}