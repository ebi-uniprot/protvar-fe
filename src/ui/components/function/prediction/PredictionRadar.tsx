import React, { useState } from 'react';
import RadarChartLib from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';
import { AmScore, ConservScore, EsmScore, M3dPred, PopEveScore } from '../../../../types/MappingResponse';
import { Foldx } from '../../../../types/Prediction';
import { STD_BENIGN_COLOR, STD_COLOR_GRADIENT, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR } from './PredConstants';
import { POPEVE_MIN, POPEVE_MAX, POPEVE_SCORE_ATTR, getPopEveClass } from './PopEvePred';
import { AM_SCORE_ATTR } from './AlphaMissensePred';
import { caddScoreAttr } from './CaddScorePred';
import { conservScoreAttr } from './ConservPred';
import { ESM_SCORE_ATTR } from './EsmPred';
import { aminoAcid3to1Letter } from '../../../../utills/Util';

const RadarChart = RadarChartLib as React.ComponentType<any>;

interface PredictionRadarProps {
  conservScore?: ConservScore;
  amScore?: AmScore;
  caddScore?: string;
  esmScore?: EsmScore;
  popEveScore?: PopEveScore;
  foldxs?: Array<Foldx>;
  variantAA?: string;
  m3dPred?: M3dPred;
  size?: number;
}

const CAPTIONS: Record<string, string> = {
  conserv: 'Conservation',
  am:      'AlphaMissense',
  cadd:    'CADD',
  esm:     'ESM-1b',
  popeve:  'PopEVE',
  foldx:   'FoldX',
  m3d:     'Missense3D',
};

// --- normalisation (0 = benign, 1 = pathogenic) ---

function normCadd(cadd?: string): number | undefined {
  if (!cadd || cadd === '-') return undefined;
  const v = parseFloat(cadd);
  return isNaN(v) ? undefined : Math.min(v / 40, 1);
}

function normEsm(esm?: EsmScore): number | undefined {
  return esm ? Math.min(Math.max(esm.score / -25, 0), 1) : undefined;
}

function normPopEve(popeve?: PopEveScore): number | undefined {
  if (!popeve) return undefined;
  return Math.min(Math.max((popeve.popeve - POPEVE_MAX) / (POPEVE_MIN - POPEVE_MAX), 0), 1);
}

function normFoldx(foldxs?: Array<Foldx>, variantAA?: string): number | undefined {
  if (!foldxs || foldxs.length === 0) return undefined;
  const v1 = variantAA ? aminoAcid3to1Letter(variantAA) : undefined;
  const match = v1 ? foldxs.find(fx => fx.mutatedType.toLowerCase() === v1) : foldxs[0];
  if (!match) return undefined;
  return Math.min(Math.max(match.foldxDdg / 4, 0), 1);
}

function normM3d(m3dPred?: M3dPred): number | undefined {
  if (!m3dPred) return undefined;
  return m3dPred.prediction.toUpperCase() === 'DAMAGING' ? 1 : 0;
}

// --- stdColor per axis ---

function stdColorConserv(s?: ConservScore): string | undefined {
  return s ? STD_COLOR_GRADIENT.rgbAt(s.score).toHexString() : undefined;
}

function stdColorAm(s?: AmScore): string | undefined {
  return s ? AM_SCORE_ATTR[s.amClass]?.stdColor : undefined;
}

function stdColorCadd(s?: string): string | undefined {
  return caddScoreAttr(s)?.stdColor;
}

function stdColorEsm(s?: EsmScore): string | undefined {
  if (!s) return undefined;
  if (s.score >= -5)  return STD_BENIGN_COLOR;
  if (s.score >= -10) return STD_UNCERTAIN_COLOR;
  return STD_PATHOGENIC_COLOR;
}

function stdColorPopEve(s?: PopEveScore): string | undefined {
  return s ? POPEVE_SCORE_ATTR[getPopEveClass(s.popeve)].stdColor : undefined;
}

function stdColorFoldx(foldxs?: Array<Foldx>, variantAA?: string): string | undefined {
  if (!foldxs || foldxs.length === 0) return undefined;
  const v1 = variantAA ? aminoAcid3to1Letter(variantAA) : undefined;
  const match = v1 ? foldxs.find(fx => fx.mutatedType.toLowerCase() === v1) : foldxs[0];
  if (!match) return undefined;
  return match.foldxDdg >= 2 ? STD_PATHOGENIC_COLOR : STD_BENIGN_COLOR;
}

function stdColorM3d(s?: M3dPred): string | undefined {
  if (!s) return undefined;
  return s.prediction.toUpperCase() === 'DAMAGING' ? STD_PATHOGENIC_COLOR : STD_BENIGN_COLOR;
}

// --- color averaging ---

const NAMED_COLORS: Record<string, [number, number, number]> = {
  blue:      [0, 0, 255],
  red:       [255, 0, 0],
  lightgray: [211, 211, 211],
};

function parseRgb(color: string): [number, number, number] | null {
  if (color.startsWith('#') && color.length === 7) {
    return [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16),
    ];
  }
  return NAMED_COLORS[color.toLowerCase()] ?? null;
}

function averageStdColors(colors: (string | undefined)[]): string {
  const parsed = colors
    .filter((c): c is string => !!c)
    .map(parseRgb)
    .filter((c): c is [number, number, number] => c !== null);
  if (parsed.length === 0) return '#aaaaaa';
  const [r, g, b] = parsed
    .reduce(([ar, ag, ab], [r, g, b]) => [ar + r, ag + g, ab + b], [0, 0, 0])
    .map(v => Math.round(v / parsed.length));
  return `rgb(${r},${g},${b})`;
}

// --- component ---

// Library default: captionMargin = 10, zoomDistance = 1.2
// viewBox = "-captionMargin 0 (size + 2*captionMargin) size"
// dot position (in local coords centered at size/2, size/2):
//   x = cos(angle - π/2) * value * chartSize/2
//   y = sin(angle - π/2) * value * chartSize/2
// where angle = 2π * i / N, chartSize = size / zoomDistance
const CAPTION_MARGIN = 10;
const ZOOM_DISTANCE = 1.2;

export const PredictionRadar: React.FC<PredictionRadarProps> = ({
  conservScore, amScore, caddScore, esmScore, popEveScore, foldxs, variantAA, m3dPred, size = 200,
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const scores: Record<string, number | undefined> = {
    conserv: conservScore?.score,
    am:      amScore?.amPathogenicity,
    cadd:    normCadd(caddScore),
    esm:     normEsm(esmScore),
    popeve:  normPopEve(popEveScore),
    foldx:   normFoldx(foldxs, variantAA),
    m3d:     normM3d(m3dPred),
  };

  const stdColors: Record<string, string | undefined> = {
    conserv: stdColorConserv(conservScore),
    am:      stdColorAm(amScore),
    cadd:    stdColorCadd(caddScore),
    esm:     stdColorEsm(esmScore),
    popeve:  stdColorPopEve(popEveScore),
    foldx:   stdColorFoldx(foldxs, variantAA),
    m3d:     stdColorM3d(m3dPred),
  };

  const availableCount = Object.values(scores).filter(v => v !== undefined).length;
  if (availableCount === 0) return null;

  const availableColors = Object.keys(scores)
    .filter(key => scores[key] !== undefined)
    .map(key => stdColors[key]);
  const fillColor = averageStdColors(availableColors);

  const radarData = Object.fromEntries(
    Object.keys(scores).map(key => [key, scores[key] ?? 0])
  );

  const totalAxes = Object.keys(scores).length;

  const v1 = variantAA ? aminoAcid3to1Letter(variantAA) : undefined;
  const foldxMatch = foldxs?.length
    ? (v1 ? foldxs.find(fx => fx.mutatedType.toLowerCase() === v1) : foldxs[0])
    : undefined;

  const tooltipValues: Record<string, string> = {};
  if (conservScore) {
    const label = conservScoreAttr(conservScore.score)?.text ?? '';
    tooltipValues['conserv'] = `${conservScore.score.toFixed(2)} · ${label}`;
  }
  if (amScore) {
    const label = AM_SCORE_ATTR[amScore.amClass]?.text ?? amScore.amClass.toLowerCase();
    tooltipValues['am'] = `${amScore.amPathogenicity.toFixed(2)} · ${label}`;
  }
  if (caddScore && caddScore !== '-') {
    const label = caddScoreAttr(caddScore)?.text ?? '';
    tooltipValues['cadd'] = `${parseFloat(caddScore).toFixed(1)}${label ? ` · ${label}` : ''}`;
  }
  if (esmScore) {
    const label = esmScore.score >= -5 ? ESM_SCORE_ATTR[0].text : esmScore.score >= -10 ? ESM_SCORE_ATTR[1].text : ESM_SCORE_ATTR[2].text;
    tooltipValues['esm'] = `${esmScore.score.toFixed(1)} · ${label}`;
  }
  if (popEveScore) {
    const label = POPEVE_SCORE_ATTR[getPopEveClass(popEveScore.popeve)].text;
    tooltipValues['popeve'] = `${popEveScore.popeve.toFixed(2)} · ${label}`;
  }
  if (foldxMatch) {
    const label = foldxMatch.foldxDdg >= 2 ? 'destabilising' : 'stabilising';
    tooltipValues['foldx'] = `${foldxMatch.foldxDdg.toFixed(2)} kcal/mol · ${label}`;
  }
  if (m3dPred) tooltipValues['m3d'] = m3dPred.prediction.toLowerCase();

  const options = {
    scales: 4,
    dots: false,
    captionProps: (caption: { key: string }) => ({
      className: 'caption',
      textAnchor: 'middle' as const,
      fontSize: 11,
      fontFamily: 'inherit',
      fill: scores[caption.key] !== undefined ? '#444' : '#ccc',
      fontWeight: scores[caption.key] !== undefined ? '600' : '400',
    }),
  };

  const axisKeys = Object.keys(CAPTIONS);
  const N_AXES = axisKeys.length;
  const chartHalfSize = size / ZOOM_DISTANCE / 2;

  const dotOverlay = (
    <svg
      width={size}
      height={size}
      viewBox={`${-CAPTION_MARGIN} 0 ${size + 2 * CAPTION_MARGIN} ${size}`}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {axisKeys.map((key, i) => {
        if (scores[key] === undefined) return null;
        const angle = 2 * Math.PI * i / N_AXES;
        const v = scores[key] ?? 0;
        const cx = size / 2 + Math.cos(angle - Math.PI / 2) * v * chartHalfSize;
        const cy = size / 2 + Math.sin(angle - Math.PI / 2) * v * chartHalfSize;
        const isHovered = hoveredKey === key;
        return (
          <circle
            key={`dot-${key}`}
            cx={cx} cy={cy}
            r={isHovered ? 5 : 3}
            fill="white"
            stroke="#ccc"
            strokeWidth={1}
            style={{ pointerEvents: 'auto', cursor: 'default' }}
            onMouseEnter={() => setHoveredKey(key)}
            onMouseLeave={() => setHoveredKey(null)}
          />
        );
      })}
    </svg>
  );

  return (
    <div className="prediction-radar">
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <RadarChart
          captions={CAPTIONS}
          data={[{ data: radarData, meta: { color: fillColor } }]}
          size={size}
          options={options}
        />
        {dotOverlay}
      </div>
      <div className="radar-tooltip">
        {hoveredKey
          ? <><strong>{CAPTIONS[hoveredKey]}</strong>: {tooltipValues[hoveredKey] ?? 'N/A'}</>
          : (availableCount < totalAxes ? 'Grey: score not available' : ' ')
        }
      </div>
    </div>
  );
};
