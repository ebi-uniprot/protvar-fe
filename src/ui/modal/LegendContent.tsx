import React, { useContext } from 'react'
import AnnotationLegend from './AnnotationLegend'
import { CADD_SCORE_ATTR } from "../components/function/prediction/CaddScorePred";
import { AM_SCORE_ATTR } from "../components/function/prediction/AlphaMissensePred";
import { AF_ATTR } from "../components/population/PopulationAlleleFreq";
import { POPEVE_SCORE_ATTR, POPEVE_COLORS, POPEVE_MIN, POPEVE_MAX } from "../components/function/prediction/PopEvePred";
import { ESM_SCORE_ATTR } from "../components/function/prediction/EsmPred";
import { CONSERV_SCORE_ATTR } from "../components/function/prediction/ConservPred";
import { AppContext } from "../App";
import { FEATURE_RANKING, FeaturePriority } from "../components/function/utils/featureRanking";
import { LegendCategories } from "../components/common/LegendCategories";

interface CommonLegendProps {
  stdColor: boolean
}

function LegendSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="legend-section">
      <strong className="legend-section-title">{title}</strong>
      {children}
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
  return (
    <>
      <GradientBar gradient={gradient} labels={['Low', 'High']} />
      <LegendCategories attrs={CONSERV_SCORE_ATTR} stdColor={stdColor} />
    </>
  );
}

function EsmLegend({ stdColor }: CommonLegendProps) {
  const gradient = stdColor
    ? 'linear-gradient(to right, blue 0%, blue 20%, lightgray 20%, lightgray 40%, red 40%, red 100%)'
    : 'linear-gradient(to right, #460556, #218c8f, #f9e725)';
  return (
    <>
      <GradientBar gradient={gradient} labels={['0', '-5', '-10', '-15', '-20', '-25']} />
      <LegendCategories attrs={ESM_SCORE_ATTR} stdColor={stdColor} />
    </>
  );
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
    <div className="legend-content">
      {/* Colour toggle at the very top */}
      <div className="legend-toggle-wrap">
        <label className="toggle-switch" title="Toggle between ProtVar standardised and original source colours">
          <input type="checkbox" checked={stdColor} onChange={() => updateState("stdColor", !stdColor)} />
          <span className="toggle-track"><span className="toggle-thumb"></span></span>
          <span className="toggle-label">ProtVar standardised colours</span>
        </label>
      </div>

      <h6 className="legend-content-title">Result Legends</h6>

      {/* Two-column grid */}
      <div className="legend-grid">

        <LegendSection title="CADD phred-like score">
          <LegendCategories attrs={Object.values(CADD_SCORE_ATTR)} stdColor={stdColor} />
        </LegendSection>

        <LegendSection title="AlphaMissense score">
          <LegendCategories attrs={Object.values(AM_SCORE_ATTR)} stdColor={stdColor} />
        </LegendSection>

        <LegendSection title="ESM1b LLR score">
          <EsmLegend stdColor={stdColor} />
        </LegendSection>

        <LegendSection title="popEVE score">
          <GradientBar
            gradient={stdColor
              ? 'linear-gradient(to right, blue 0%, blue 59%, lightgray 59%, lightgray 66%, red 66%, red 100%)'
              : `linear-gradient(to right, ${[...POPEVE_COLORS].reverse().join(',')})`
            }
            labels={['≥ ' + String(POPEVE_MAX), String(POPEVE_MIN)]}
          />
          <LegendCategories attrs={Object.values(POPEVE_SCORE_ATTR)} stdColor={stdColor} />
          <div className="legend-footnote">
            Low confidence when gap freq &gt; 0.5
          </div>
        </LegendSection>

        <LegendSection title="Residue conservation">
          <ConservLegend stdColor={stdColor} />
        </LegendSection>

        <LegendSection title="GnomAD allele frequency">
          <LegendCategories attrs={Object.values(AF_ATTR)} stdColor={false} />
        </LegendSection>

      </div>

      {/* Annotation icons — AnnotationLegend has its own heading */}
      <div className="legend-annotation-wrap">
        <AnnotationLegend />
      </div>

      {/* UniProt feature ranking */}
      <div className="legend-feature-ranking-wrap">
        <LegendSection title="UniProt feature ranking">
          <FeatureRankingLegend />
        </LegendSection>
      </div>
    </div>
  );
}

export default LegendContent;
