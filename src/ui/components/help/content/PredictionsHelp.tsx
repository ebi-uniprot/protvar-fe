import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../App';
import { HELP } from '../../../../constants/BrowserPaths';
import { PredictionRadar } from '../../function/prediction/PredictionRadar';
import { CONSERV_SCORE_ATTR } from '../../function/prediction/ConservPred';
import { AM_SCORE_ATTR } from '../../function/prediction/AlphaMissensePred';
import { CADD_SCORE_ATTR } from '../../function/prediction/CaddScorePred';
import { ESM_SCORE_ATTR } from '../../function/prediction/EsmPred';
import { POPEVE_SCORE_ATTR } from '../../function/prediction/PopEvePred';
import { FOLDX_SCORE_ATTR } from '../../function/prediction/FoldxPred';
import { M3D_SCORE_ATTR } from '../../function/prediction/Missense3dPred';
import { POCKET_CONFIDENCE_BANDS, INTERACTION_CONFIDENCE_BANDS } from '../../function/utils/confidenceUtils';
import { HelpCategories } from '../shared/HelpCategories';
import { AFConfidenceLegend } from '../../structure/alphafoldConfidence';

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

// AlphaFold help body — used inline under the AlphaFold H3 in PredictionsHelp,
// and (wrapped by AlphaFoldHelp below) in the drawer triggered from the
// structure viewer's AF confidence panel. Intro is phrased to make sense in
// both contexts.
export const AlphaFoldHelpContent: React.FC = () => (
  <>
    <p>
      AlphaFold is the predicted protein structure that ProtVar's structure-based annotations are
      built on. Two confidence layers accompany it: pLDDT (per-residue) and PAE (per-residue-pair).
    </p>
    <h4>Model Confidence</h4>
    <p>
      AlphaFold produces a per-residue confidence score (pLDDT) between 0 and 100. Some regions with
      low pLDDT may be unstructured in isolation.
    </p>
    <AFConfidenceLegend />
    <h4>Predicted Aligned Error (PAE)</h4>
    <p>
      The colour at position (x, y) indicates AlphaFold's expected position error at residue x, when
      the predicted and true structures are aligned on residue y. This is useful for assessing
      inter-domain accuracy.
    </p>
  </>
);

// Drawer-ready wrapper — H1 + help-content container. Triggered from
// AFConfidencePanel's "?" button next to "Predicted Aligned Error".
export const AlphaFoldHelp: React.FC = () => (
  <div className="help-content">
    <h1>AlphaFold</h1>
    <AlphaFoldHelpContent />
  </div>
);

export const PredictionsHelp: React.FC = () => {
  const { stdColor, updateState } = useContext(AppContext);

  return (
    <div className="help-content">
      <h1 id="predictions">Predictions</h1>

      <label className="toggle-switch" title="Toggle between ProtVar standardised and original source colours">
        <input type="checkbox" checked={stdColor} onChange={() => updateState('stdColor', !stdColor)} />
        <span className="toggle-track"><span className="toggle-thumb"></span></span>
        <span className="toggle-label">ProtVar colours</span>
      </label>

      <hr />

      <h2>Contents</h2>
      <ol>
        <li><Link to={`${HELP}#predictions:radar`}>Score Radar</Link></li>
        <li><Link to={`${HELP}#predictions:conservation`}>Conservation</Link></li>
        <li><Link to={`${HELP}#predictions:pathogenicity`}>Pathogenicity Predictions</Link>
          <ul>
            <li><Link to={`${HELP}#predictions:am`}>AlphaMissense</Link></li>
            <li><Link to={`${HELP}#predictions:cadd`}>CADD</Link></li>
            <li><Link to={`${HELP}#predictions:esm`}>ESM-1b</Link></li>
            <li><Link to={`${HELP}#predictions:popeve`}>PopEVE</Link></li>
          </ul>
        </li>
        <li><Link to={`${HELP}#predictions:structure`}>Structure-based Annotations</Link>
          <ul>
            <li><Link to={`${HELP}#predictions:alphafold`}>AlphaFold</Link></li>
            <li><Link to={`${HELP}#predictions:foldx`}>FoldX — Stability Change (ΔΔG)</Link></li>
            <li><Link to={`${HELP}#predictions:m3d`}>Missense3D</Link></li>
            <li><Link to={`${HELP}#predictions:pockets`}>Pockets containing the variant</Link></li>
            <li><Link to={`${HELP}#predictions:interfaces`}>Protein–Protein interfaces containing the variant</Link></li>
          </ul>
        </li>
      </ol>

      <hr />

      <h2 id="predictions:radar">
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

      <h2 id="predictions:conservation">Conservation</h2>
      <p>
        Inter-species amino acid conservation based on UniRef90 sequence alignments using the ScoreCons
        algorithm (<a href="https://pubmed.ncbi.nlm.nih.gov/11093265" target="_blank" rel="noreferrer">PubMed 11093265</a>).
        Scored from 0 (no conservation) to 1 (complete conservation).
      </p>
      <HelpCategories attrs={CONSERV_SCORE_ATTR} stdColor={stdColor} />

      <h2 id="predictions:pathogenicity">Pathogenicity Predictions</h2>
      <p>Predictions relating to the probability that the variant has a pathogenic or benign consequence.</p>

      <h3 id="predictions:am">AlphaMissense</h3>
      <p>
        A deep learning model based on structural context and population frequencies
        (<a href="https://pubmed.ncbi.nlm.nih.gov/37733863" target="_blank" rel="noreferrer">PubMed 37733863</a>).
        Scores range from 0 (least deleterious) to 1 (most deleterious). Category ranges vary and are
        provided by AlphaMissense.
      </p>
      <HelpCategories attrs={Object.values(AM_SCORE_ATTR)} stdColor={stdColor} />

      <h3 id="predictions:cadd">CADD</h3>
      <p>
        Scaled Combined Annotation-Dependent Depletion scores
        (<a href="https://pubmed.ncbi.nlm.nih.gov/30371827" target="_blank" rel="noreferrer">PubMed 30371827</a>).
        An integrative annotation score built from genomic features. Scores are relative to all other
        scores, log10-scaled, with higher values representing a more deleterious variant consequence.
      </p>
      <HelpCategories attrs={CADD_SCORE_ATTR} stdColor={stdColor} />

      <h3 id="predictions:esm">ESM-1b</h3>
      <p>
        Evolutionary Scaled Model (<a href="https://pubmed.ncbi.nlm.nih.gov/33876751" target="_blank" rel="noreferrer">PubMed 33876751</a>).
        A deep contextual language model built across a diverse range of species.
        Scores range from −25 (most deleterious) to 0 (least deleterious).
      </p>
      <HelpCategories attrs={ESM_SCORE_ATTR} stdColor={stdColor} />

      <h3 id="predictions:popeve">PopEVE</h3>
      <p>
        Population-based EVE score integrating evolutionary and population genetics signals. Scores
        are negative; more negative values indicate greater predicted deleteriousness.
      </p>
      <HelpCategories attrs={POPEVE_SCORE_ATTR} stdColor={stdColor} />

      <h2 id="predictions:structure">Structure-based Annotations</h2>
      <p>
        Annotations and predictions derived from the AlphaFold2 structural model — starting with the
        model itself and the per-residue and contextual analyses built on top of it.
      </p>

      <h3 id="predictions:alphafold">AlphaFold</h3>
      <AlphaFoldHelpContent />

      <h3 id="predictions:foldx">FoldX — Stability Change (ΔΔG)</h3>
      <p>
        The predicted free energy change in the protein when the reference amino acid is replaced with
        the variant, calculated using FoldX v5.0 on the AlphaFold2 structure
        (<a href="https://pubmed.ncbi.nlm.nih.gov/15980494" target="_blank" rel="noreferrer">PubMed 15980494</a>).
      </p>
      <HelpCategories attrs={FOLDX_SCORE_ATTR} stdColor={stdColor} />

      <h3 id="predictions:m3d">Missense3D</h3>
      <p>
        Structural annotation of missense variant consequences. Missense3D classifies variants as
        <em> damaging</em> or <em>non-damaging</em> based on structural features of the AlphaFold2 model,
        such as changes to buried residues, secondary structure disruption, or clashes.
      </p>
      <HelpCategories attrs={M3D_SCORE_ATTR} stdColor={stdColor} />

      <h3 id="predictions:pockets">Pockets Containing the Variant</h3>
      <p>
        Predicted protein pockets containing the variant position and other amino acids involved in
        the pocket, with prediction confidence
        (<a href="https://pubmed.ncbi.nlm.nih.gov/38854010" target="_blank" rel="noreferrer">PubMed 38854010</a>).
      </p>
      <ul>
        <li><strong>Pocket confidence:</strong> Filter pockets containing the variant according to confidence that the pocket exists.
          <HelpCategories attrs={POCKET_CONFIDENCE_BANDS} />
        </li>
        <li><strong>Combined score:</strong> Used to measure the confidence level of the pocket prediction.</li>
        <li><strong>Pocket pLDDT mean:</strong> The mean per-residue model confidence for the amino acids predicted to form the pocket from AlphaFold.</li>
        <li><strong>Buriedness:</strong> Ranges from 0 to 1 where 0 is entirely exposed to solvent and 1 is completely buried.</li>
        <li><strong>Radius of gyration:</strong> A measure of pocket compactness.</li>
        <li><strong>Residues:</strong> The amino acids predicted to compose the pocket.</li>
      </ul>

      <h3 id="predictions:interfaces">Protein–Protein Interfaces Containing the Variant</h3>
      <p>
        Predicted protein–protein interfaces containing the variant position with information about
        the quality of the interface and the proteins involved
        (<a href="https://pubmed.ncbi.nlm.nih.gov/36690744" target="_blank" rel="noreferrer">PubMed 36690744</a>,{' '}
        <a href="https://pubmed.ncbi.nlm.nih.gov/38854010" target="_blank" rel="noreferrer">PubMed 38854010</a>).
      </p>
      <ul>
        <li><strong>pDockQ:</strong> Interface confidence score based on the pLDDT model confidence and the number of residues at the interface.
          <HelpCategories attrs={INTERACTION_CONFIDENCE_BANDS} />
        </li>
      </ul>

      <p className="help-see-also">
        See also: <Link to={`${HELP}#protvar-links`}>ProtVar Links</Link> for sharing or deep-linking to a specific result view.
      </p>
    </div>
  );
};
