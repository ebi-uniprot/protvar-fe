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
import { fullAminoAcidName, getKeyValue } from '../../../utills/Util';

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
  return (
    <div className="aa-model-wrapper">
      <div className="aa-model-images">
        <div className="aa-model-item">
          <img className="img-size" src={getImageByKey(refAA)} alt={refAA} />
          <span className="aa-model-label">{fullAminoAcidName(refAA)}</span>
        </div>
        <i className="bi bi-arrow-right-short icon-arrow"></i>
        <div className="aa-model-item">
          <img className="img-size" src={getImageByKey(variantAA)} alt={variantAA} />
          <span className="aa-model-label">{fullAminoAcidName(variantAA)}</span>
        </div>
      </div>
    </div>
  );
};

export default AminoAcidModel;
