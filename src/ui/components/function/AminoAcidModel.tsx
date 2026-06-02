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

// Lazy so molstar (heavy) is only loaded when the user opens the 3D view.
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
  const [show3d, setShow3d] = useState(false);
  const [spin, setSpin] = useState(true);
  const [resetNonce, setResetNonce] = useState(0);
  // 3D is only offered when both residues are standard (Ter/stop has no structure).
  const can3d = hasResidueSdf(refAA) && hasResidueSdf(variantAA);

  return (
    <div className="aa-model-wrapper">
      {can3d && (
        <div className="aa-model-header">
          <div className="view-toggle">
            <button className={!show3d ? 'active' : ''} onClick={() => setShow3d(false)}>
              <i className="bi bi-image" /> 2D
            </button>
            <button className={show3d ? 'active' : ''} onClick={() => setShow3d(true)}>
              <i className="bi bi-box" /> 3D
            </button>
          </div>
          {show3d && (
            <div className="aa-3d-options">
              <button
                type="button"
                className={`aa-3d-toggle${spin ? ' active' : ''}`}
                aria-pressed={spin}
                onClick={() => setSpin((v) => !v)}
              >
                <i className="bi bi-arrow-repeat" /> Spin
              </button>
              <button
                type="button"
                className="aa-3d-toggle"
                onClick={() => setResetNonce((n) => n + 1)}
              >
                <i className="bi bi-arrow-counterclockwise" /> Reset
              </button>
            </div>
          )}
        </div>
      )}

      <div className="aa-model-body" key={show3d ? '3d' : '2d'}>
      {show3d && can3d ? (
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
          <i className="bi bi-chevron-right aa-change-arrow"></i>
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
