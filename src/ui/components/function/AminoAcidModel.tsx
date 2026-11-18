import ala from '../../../images/ala.png';
import arg from '../../../images/arg.png';
import asn from '../../../images/asn.png';
import asp from '../../../images/asp.png';
import cys from '../../../images/cys.png';
import gln from '../../../images/gln.png';
import glu from '../../../images/glu.png';
import gly from '../../../images/gly.png';
import his from '../../../images/his.png';
import ile from '../../../images/ile.png';
import leu from '../../../images/leu.png';
import lys from '../../../images/lys.png';
import met from '../../../images/met.png';
import phe from '../../../images/phe.png';
import pro from '../../../images/pro.png';
import ser from '../../../images/ser.png';
import thr from '../../../images/thr.png';
import trp from '../../../images/trp.png';
import tyr from '../../../images/tyr.png';
import val from '../../../images/val.png';
import ter from '../../../images/ter.png';
import React, { Suspense, useState } from 'react';
import { fullAminoAcidName, getKeyValue } from '../../../utills/Util';
import { hasResidueSdf } from './aminoAcid/residueSdf';
import { Icon } from '../../elements/Icon';

// Lazy so 3Dmol is only loaded when the user opens the 3D view.
const AminoAcidCompare = React.lazy(() => import('./aminoAcid/AminoAcidCompare'));

const aminoAcids = {
  ala,
  arg,
  asn,
  asp,
  cys,
  gln,
  glu,
  gly,
  his,
  ile,
  leu,
  lys,
  met,
  phe,
  pro,
  ser,
  thr,
  trp,
  tyr,
  val,
  ter
};
function getImageByKey(key: string) {
  return getKeyValue(key.toLowerCase())(aminoAcids);
}

interface AminoAcidModelProps {
  refAA: string
  variantAA: string
}
const AminoAcidModel = (props: AminoAcidModelProps) => {
  const { refAA, variantAA } = props;
  const [spin, setSpin] = useState(true);
  const [resetNonce, setResetNonce] = useState(0);
  // 3D whenever both residues are standard; Ter/stop has no structure, so
  // that case falls back to the 2D images.
  const can3d = hasResidueSdf(refAA) && hasResidueSdf(variantAA);

  return (
    <div className="aa-model-wrapper">
      {can3d && (
        <div className="aa-model-header">
          <div className="aa-3d-options">
            <button
              type="button"
              className="aa-3d-toggle"
              aria-pressed={!spin}
              title={spin ? 'Stop spin' : 'Resume spin'}
              aria-label={spin ? 'Stop spin' : 'Resume spin'}
              onClick={() => setSpin((v) => !v)}
            >
              <Icon name={spin ? 'pause-fill' : 'play-fill'} />
            </button>
            <button
              type="button"
              className="aa-3d-toggle"
              title="Reset view"
              aria-label="Reset view"
              onClick={() => setResetNonce((n) => n + 1)}
            >
              <Icon name="arrow-counterclockwise" />
            </button>
          </div>
        </div>
      )}

      <div className="aa-model-body">
      {can3d ? (
        <Suspense fallback={<div className="aa-3d-loading">Loading 3D…</div>}>
          <AminoAcidCompare
            refCode={refAA}
            altCode={variantAA}
            refName={fullAminoAcidName(refAA)}
            altName={fullAminoAcidName(variantAA)}
            spin={spin}
            resetNonce={resetNonce}
          />
        </Suspense>
      ) : (
        <div className="aa-model-images">
          <div className="aa-model-item">
            <img className="img-size" src={getImageByKey(refAA)} alt={refAA} />
            <span className="aa-model-label">{fullAminoAcidName(refAA)}</span>
          </div>
          <Icon name="chevron-right" className="aa-change-arrow" />
          <div className="aa-model-item">
            <img className="img-size" src={getImageByKey(variantAA)} alt={variantAA} />
            <span className="aa-model-label">{fullAminoAcidName(variantAA)}</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AminoAcidModel;
