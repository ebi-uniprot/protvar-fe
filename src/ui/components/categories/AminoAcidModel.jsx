import React from 'react';
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
function getImageByKey(key) {
	return aminoAcids[key];
}

const AminoAcidModel = (props) => {
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
							<ul className="flatList-no-separator">
								<li>
									<img className="img-size" src={getImageByKey(ref)} alt={ref}/>
								</li>
								<li>
									<span className="icon-arrow">&#8594;</span>
								</li>
								<li>
									<img className="img-size" src={getImageByKey(variant)} alt={variant}/>
								</li>
							</ul>
						</td>
						{/* <td>
							The residue at sequence position 34 in this protein is an arginine which has a positively
							charged side chain, making it hydrophilic (ie preferring the surface of the protein to its
							interior).
							<br />
							<br />The variant residue is a histidine which has a positively charged side chain, making
							it hydrophilic (ie preferring the surface of the protein to its interior). Number of base
							changes: 1
						</td> */}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default AminoAcidModel;
