import React, { useContext } from 'react'
import { v1 as uuidv1 } from 'uuid';
import AnnotationLegend from './AnnotationLegend'
import { CADD_SCORE_ATTR } from "../components/function/prediction/CaddScorePred";
import { PredAttr } from "../components/function/prediction/Prediction";
import { AM_SCORE_ATTR } from "../components/function/prediction/AlphaMissensePred";
import { AF_ATTR } from "../components/population/PopulationAlleleFreq";
import { POPEVE_SCORE_ATTR } from "../components/function/prediction/PopEvePred";
import { AppContext } from "../App";
import { FEATURE_RANKING, FeaturePriority } from "../components/function/utils/featureRanking";

interface CommonLegendProps {
  stdColor: boolean
}

function LegendSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <strong style={{ display: 'block', marginBottom: '0.4rem' }}>{title}</strong>
      {children}
    </div>
  );
}

function CircleItems({ attrs, stdColor }: { attrs: PredAttr[]; stdColor: boolean }) {
  return (
    <div className="flex-column">
      {attrs.map((sc) => (
        <div key={uuidv1()} className="flex" style={{ alignItems: 'center', marginBottom: 2 }}>
          <span className="padding-left-right-1x">
            <i className="bi bi-circle-fill" style={{ color: stdColor ? sc.stdColor : sc.color }}></i>
          </span>
          <div className="flex1">{sc.text}{sc.range ? ` (${sc.range})` : ''}</div>
        </div>
      ))}
    </div>
  );
}

function SquareItems({ attrs, stdColor }: { attrs: PredAttr[]; stdColor: boolean }) {
  return (
    <div className="flex-column">
      {attrs.map((sc) => (
        <div key={uuidv1()} className="flex" style={{ alignItems: 'center', marginBottom: 2 }}>
          <span className="padding-left-right-1x">
            <i className="bi bi-square-fill" style={{ color: stdColor ? sc.stdColor : sc.color }}></i>
          </span>
          <div className="flex1">{sc.range} {sc.text}</div>
        </div>
      ))}
    </div>
  );
}

function GradientBar({ gradient, labels }: { gradient: string; labels: string[] }) {
  return (
    <>
      <div style={{ background: gradient, width: '8rem', height: '1.2rem', borderRadius: 2 }} />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '8rem',
        fontSize: '0.65em',
        color: '#666',
        marginTop: 2,
      }}>
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </>
  );
}

function ConservLegend({ stdColor }: CommonLegendProps) {
  const gradient = stdColor
    ? 'linear-gradient(to right, blue, lightgray, red)'
    : 'linear-gradient(to right, #732faf, #194888, #277777, #72cb5d, #bab518, #c46307, #9d0101)';
  return <GradientBar gradient={gradient} labels={['Low', 'High']} />;
}

function EsmLegend({ stdColor }: CommonLegendProps) {
  const gradient = stdColor
    ? 'linear-gradient(to right, blue 0%, blue 20%, lightgray 20%, lightgray 40%, red 40%, red 100%)'
    : 'linear-gradient(to right, #460556, #218c8f, #f9e725)';
  return <GradientBar gradient={gradient} labels={['0', '-5', '-10', '-15', '-20', '-25']} />;
}

const PRIORITY_META: Record<FeaturePriority, { label: string; color: string; description: string }> = {
  high:   { label: 'High',   color: '#4a90e2', description: 'Strong functional implication; frequently pathogenic' },
  middle: { label: 'Middle', color: '#ffc107', description: 'Moderate functional implication; context-dependent' },
  low:    { label: 'Low',    color: '#c0c0c0', description: 'Structural / compositional; less likely directly pathogenic' },
};

function FeatureRankingLegend() {
  const tiers: FeaturePriority[] = ['high', 'middle', 'low'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {tiers.map(priority => {
        const meta = PRIORITY_META[priority];
        const features = Object.values(FEATURE_RANKING)
          .filter(f => f.priority === priority)
          .sort((a, b) => a.rank - b.rank);
        return (
          <div key={priority} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 4,
              minHeight: '2.2rem',
              background: meta.color,
              borderRadius: 2,
              flexShrink: 0,
              marginTop: 2,
            }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: meta.color, marginBottom: 2 }}>
                {meta.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#666', lineHeight: 1.4 }}>
                {features.map(f => f.label).join(', ')}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LegendContent() {
  const state = useContext(AppContext);
  const { stdColor, updateState } = state;

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Colour toggle at the very top */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="toggle-switch" title="Toggle between ProtVar standardised and original source colours">
          <input type="checkbox" checked={stdColor} onChange={() => updateState("stdColor", !stdColor)} />
          <span className="toggle-track"><span className="toggle-thumb"></span></span>
          <span className="toggle-label">ProtVar standardised colours</span>
        </label>
      </div>

      <h6 style={{ marginBottom: '1.25rem', fontWeight: 600 }}>Result Legends</h6>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>

        <LegendSection title="CADD phred-like score">
          <SquareItems attrs={Object.values(CADD_SCORE_ATTR)} stdColor={stdColor} />
        </LegendSection>

        <LegendSection title="AlphaMissense score">
          <CircleItems attrs={Object.values(AM_SCORE_ATTR)} stdColor={stdColor} />
        </LegendSection>

        <LegendSection title="ESM1b LLR score">
          <EsmLegend stdColor={stdColor} />
        </LegendSection>

        <LegendSection title="popEVE score">
          <CircleItems attrs={Object.values(POPEVE_SCORE_ATTR)} stdColor={stdColor} />
          <div style={{ fontSize: '0.75em', fontStyle: 'italic', marginTop: '0.4em', color: '#666' }}>
            Low confidence when gap freq &gt; 0.5
          </div>
        </LegendSection>

        <LegendSection title="Residue conservation">
          <ConservLegend stdColor={stdColor} />
        </LegendSection>

        <LegendSection title="GnomAD allele frequency">
          <CircleItems attrs={Object.values(AF_ATTR)} stdColor={false} />
        </LegendSection>

      </div>

      {/* Annotation icons — AnnotationLegend has its own heading */}
      <div style={{ marginTop: '0.5rem' }}>
        <AnnotationLegend />
      </div>

      {/* UniProt feature ranking */}
      <div style={{ marginTop: '1rem' }}>
        <LegendSection title="UniProt feature ranking">
          <FeatureRankingLegend />
        </LegendSection>
      </div>
    </div>
  );
}

export default LegendContent;
