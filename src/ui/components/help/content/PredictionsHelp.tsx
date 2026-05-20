import React from 'react';
import { PredictionRadar } from '../../function/prediction/PredictionRadar';
import { CONSERV_SCORE_ATTR } from '../../function/prediction/ConservPred';
import { AM_SCORE_ATTR } from '../../function/prediction/AlphaMissensePred';
import { CADD_SCORE_ATTR } from '../../function/prediction/CaddScorePred';
import { ESM_SCORE_ATTR } from '../../function/prediction/EsmPred';
import { POPEVE_SCORE_ATTR } from '../../function/prediction/PopEvePred';
import { FOLDX_SCORE_ATTR } from '../../function/prediction/FoldxPred';
import { M3D_SCORE_ATTR } from '../../function/prediction/Missense3dPred';
import { CONFIDENCE_LEVELS, ConfidenceBadge } from '../../function/utils/confidenceUtils';
import { HelpCategories } from '../shared/HelpCategories';

const PATHOGENIC_EXAMPLE = {
  conservScore:  { score: 0.93 },
  amScore:       { amPathogenicity: 0.91, amClass: 'PATHOGENIC' },
  caddScore:     '34.2',
  esmScore:      { score: -16.5 },
  popEveScore:   { popeve: -6.1, gapFreq: 0.1, poppedEve: 0, poppedEsm1v: 0, eve: 0, esm1v: 0 },
  foldxs:        [{ proteinAcc: '', position: 0, afId: '', afPos: 0, wildType: 'A', mutatedType: 'g', foldxDdg: 3.4, plddt: 80, numFragments: 1 }],
  m3dPred:       { prediction: 'DAMAGING', damagingFeature: '-' },
};

const BENIGN_EXAMPLE = {
  conservScore:  { score: 0.18 },
  amScore:       { amPathogenicity: 0.05, amClass: 'BENIGN' },
  caddScore:     '5.8',
  esmScore:      { score: -1.9 },
  popEveScore:   undefined,
  foldxs:        [{ proteinAcc: '', position: 0, afId: '', afPos: 0, wildType: 'A', mutatedType: 'g', foldxDdg: 0.4, plddt: 80, numFragments: 1 }],
  m3dPred:       { prediction: 'non-damaging', damagingFeature: '-' },
};

export const PredictionsHelp: React.FC = () => {
  return (
    <div className="help-content">
      <h1 id="predictions">Predictions</h1>

      <h2>
        ProtVar Score Radar{' '}
        <span className="experimental-text-badge">
          <i className="bi bi-flask" /> experimental
        </span>
      </h2>
      <p>
        A radar chart summarises all available prediction scores for a variant in a single view.
        Each axis represents one tool; the further a point extends from the centre, the more
        evidence for pathogenicity that tool provides.
      </p>

      <div className="help-radar-row">
        <div className="help-radar-item">
          <PredictionRadar {...PATHOGENIC_EXAMPLE} size={160} />
          <p className="help-radar-label">Likely pathogenic</p>
        </div>
        <div className="help-radar-item">
          <PredictionRadar {...BENIGN_EXAMPLE} size={160} />
          <p className="help-radar-label">Likely benign</p>
        </div>
      </div>

      <ul>
        <li>
          <strong>Fill colour</strong> is the average of the standardised colours across all available
          scores. Variants where most tools agree on pathogenicity pull the colour toward red; variants
          scoring as benign across tools pull it toward blue. Mixed signals produce intermediate hues.
        </li>
        <li>
          <strong>Grey axis labels</strong> indicate that a particular score is not available for this
          variant.
        </li>
      </ul>

      <h2>Conservation</h2>
      <p>
        Inter-species amino acid conservation based on UniRef90 sequence alignments using the ScoreCons
        algorithm (<a href="https://pubmed.ncbi.nlm.nih.gov/11093265" target="_blank" rel="noreferrer">PubMed 11093265</a>).
        Scored from 0 (no conservation) to 1 (complete conservation).
      </p>
      <HelpCategories attrs={CONSERV_SCORE_ATTR} />

      <h2>Pathogenicity Predictions</h2>
      <p>Predictions relating to the probability that the variant has a pathogenic or benign consequence.</p>

      <h3>AlphaMissense</h3>
      <p>
        A deep learning model based on structural context and population frequencies
        (<a href="https://pubmed.ncbi.nlm.nih.gov/37733863" target="_blank" rel="noreferrer">PubMed 37733863</a>).
        Scores range from 0 (least deleterious) to 1 (most deleterious). Category ranges vary and are
        provided by AlphaMissense.
      </p>
      <HelpCategories attrs={Object.values(AM_SCORE_ATTR)} />

      <h3>CADD</h3>
      <p>
        Scaled Combined Annotation-Dependent Depletion scores
        (<a href="https://pubmed.ncbi.nlm.nih.gov/30371827" target="_blank" rel="noreferrer">PubMed 30371827</a>).
        An integrative annotation score built from genomic features. Scores are relative to all other
        scores, log10-scaled, with higher values representing a more deleterious variant consequence.
      </p>
      <HelpCategories attrs={CADD_SCORE_ATTR} />

      <h3>ESM-1b</h3>
      <p>
        Evolutionary Scaled Model (<a href="https://pubmed.ncbi.nlm.nih.gov/33876751" target="_blank" rel="noreferrer">PubMed 33876751</a>).
        A deep contextual language model built across a diverse range of species.
        Scores range from −25 (most deleterious) to 0 (least deleterious).
      </p>
      <HelpCategories attrs={ESM_SCORE_ATTR} />

      <h3>PopEVE</h3>
      <p>
        Population-based EVE score integrating evolutionary and population genetics signals. Scores
        are negative; more negative values indicate greater predicted deleteriousness.
      </p>
      <HelpCategories attrs={POPEVE_SCORE_ATTR} />

      <h2>Structure Predictions</h2>

      <h3>FoldX — Stability Change (ΔΔG)</h3>
      <p>
        The predicted free energy change in the protein when the reference amino acid is replaced with
        the variant, calculated using FoldX v5.0 on the AlphaFold2 structure
        (<a href="https://pubmed.ncbi.nlm.nih.gov/15980494" target="_blank" rel="noreferrer">PubMed 15980494</a>).
      </p>
      <HelpCategories attrs={FOLDX_SCORE_ATTR} />

      <h3>Missense3D</h3>
      <p>
        Structural annotation of missense variant consequences. Missense3D classifies variants as
        <em> damaging</em> or <em>non-damaging</em> based on structural features of the AlphaFold2 model,
        such as changes to buried residues, secondary structure disruption, or clashes.
      </p>
      <HelpCategories attrs={M3D_SCORE_ATTR} />

      <h2>Pockets Containing the Variant</h2>
      <p>
        Predicted protein pockets containing the variant position and other amino acids involved in
        the pocket, with prediction confidence
        (<a href="https://pubmed.ncbi.nlm.nih.gov/38854010" target="_blank" rel="noreferrer">PubMed 38854010</a>).
      </p>
      <ul>
        <li><strong>Pocket confidence:</strong> Filter pockets containing the variant according to confidence that the pocket exists.
          <ul>
            <li><em>&gt;900</em> — <ConfidenceBadge level={CONFIDENCE_LEVELS.VERY_HIGH} /></li>
            <li><em>800–900</em> — <ConfidenceBadge level={CONFIDENCE_LEVELS.HIGH} /></li>
            <li><em>&lt;800</em> — <ConfidenceBadge level={CONFIDENCE_LEVELS.LOW} /></li>
          </ul>
        </li>
        <li><strong>Combined score:</strong> Used to measure the confidence level of the pocket prediction.</li>
        <li><strong>Pocket pLDDT mean:</strong> The mean per-residue model confidence for the amino acids predicted to form the pocket from AlphaFold.</li>
        <li><strong>Buriedness:</strong> Ranges from 0 to 1 where 0 is entirely exposed to solvent and 1 is completely buried.</li>
        <li><strong>Radius of gyration:</strong> A measure of pocket compactness.</li>
        <li><strong>Residues:</strong> The amino acids predicted to compose the pocket.</li>
      </ul>

      <h2>Protein–Protein Interfaces Containing the Variant</h2>
      <p>
        Predicted protein–protein interfaces containing the variant position with information about
        the quality of the interface and the proteins involved
        (<a href="https://pubmed.ncbi.nlm.nih.gov/36690744" target="_blank" rel="noreferrer">PubMed 36690744</a>,{' '}
        <a href="https://pubmed.ncbi.nlm.nih.gov/38854010" target="_blank" rel="noreferrer">PubMed 38854010</a>).
      </p>
      <ul>
        <li><strong>pDockQ:</strong> Interface confidence score based on the pLDDT model confidence and the number of residues at the interface.
          <ul>
            <li><em>&gt;0.5</em> — <ConfidenceBadge level={CONFIDENCE_LEVELS.VERY_HIGH} /></li>
            <li><em>0.23–0.5</em> — <ConfidenceBadge level={CONFIDENCE_LEVELS.HIGH} /></li>
            <li><em>&lt;0.23</em> — <ConfidenceBadge level={CONFIDENCE_LEVELS.LOW} /></li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
