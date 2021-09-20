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
import stop from '../../../images/stop.png';
import { AMINO_ACID_FULL_NAME } from '../../../constants/Protein';
import { getKeyValue } from '../../../utills/Util';

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
  stop
};
function getImageByKey(key: string) {
  return getKeyValue(key)(aminoAcids);
}
interface AminoAcidModelProps {
  refAA: string
  variantAA: string
}
const AminoAcidModel = (props: AminoAcidModelProps) => {
  const { refAA, variantAA } = props;
  var ref = refAA.toLowerCase();
  var variant = variantAA.toLowerCase();
  if (variantAA === '*') {
    variant = 'stop';
  }
  return (
    <div>
      <table className="img-table">
        <tbody>
          <tr>
            <td>
              <div>
                <img className="img-size" src={getImageByKey(ref)} alt={ref} />
                <span className="icon-arrow">&#8594;</span>
                <img className="img-size" src={getImageByKey(variant)} alt={variant} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ width: "50%" }}>{AMINO_ACID_FULL_NAME.get(ref)}</span>
                <span style={{ width: "50%", float: "right" }}>{variantAA === "*" ? "Stop" : AMINO_ACID_FULL_NAME.get(variant)}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AminoAcidModel;
