import React, { Component, Fragment } from 'react';
import SignificanceDataLine from '../significances/SignificanceDataLine';
import { v1 as uuidv1 } from 'uuid';

const specialFeatureTypes = [ 'MUTAGEN', 'CONFLICT' ];
export const FEATURES = {
	INIT_MET: 'Cleaved Initiator Methionine',
	SIGNAL: 'Signal Peptide',
	TRANSIT: 'Cleaved Transit Peptide',
	PROPEP: 'Propeptide',
	CHAIN: 'Chain',
	PEPTIDE: 'Peptide',
	TOPO_DOM: 'Transmembrane Protein Topological Region',
	TRANSMEM: 'Helical Transmembrane Peptide',
	DOMAIN: 'Functional Domain',
	REPEAT: 'Repeated Sequence',
	REGION: 'Region',
	COILED: 'Coiled-coil Region',
	MOTIF: 'Functional Motif',
	COMPBIAS: 'AA Composition Bias',
	TRANSMEM: 'Helical Transmembrane Peptide',
	DNA_BIND: 'DNA Binding Residue',
	NP_BIND: 'Nucleotide Phosphate Binding Residue',
	ACT_SITE: 'Active Site Residue',
	METAL: 'Metal Ion Binding Site Residue',
	BINDING: 'Binding Site Residue',
	CA_BIND: 'Calcium Binding Residue',
	ZN_FING: 'Zinc Finger Residue',
	DNA_BIND: 'DNA Binding Residue',
	NP_BIND: 'Nucleotide Phosphate Binding Residue',
	ACT_SITE: 'Active Site Residue',
	METAL: 'Metal Ion Binding Site Residue',
	BINDING: 'Binding Site Residue',
	SITE: 'Functionally Important Residue',
	MOD_RES: 'PTM Modified Residue',
	LIPID: 'PTM bound Lipid'
};

export const REGIONS = {
	INIT_MET: 'Cleaved Initiator Methionine',
	SIGNAL: 'Signal Peptide',
	TRANSIT: 'Cleaved Transit Peptide',
	PROPEP: 'Propeptide',
	CHAIN: 'Chain',
	PEPTIDE: 'Peptide',
	TOPO_DOM: 'Transmembrane Protein Topological Region',
	TRANSMEM: 'Helical Transmembrane Peptide',
	DOMAIN: 'Functional Domain',
	REPEAT: 'Repeated Sequence',
	REGION: 'Region',
	COILED: 'Coiled-coil Region',
	MOTIF: 'Functional Motif',
	COMPBIAS: 'AA Composition Bias'
	// Intramembrane
	// Sequence uncertainty	Regions of uncertainty in the sequence
	// Sequence conflict		Description of sequence discrepancies of unknown origin
	// Non-adjacent residues	Indicates that two residues in a sequence are not consecutive
};

export const PROTEINS = {
	TRANSMEM: 'Helical Transmembrane Peptide',
	DNA_BIND: 'DNA Binding Residue',
	NP_BIND: 'Nucleotide Phosphate Binding Residue',
	ACT_SITE: 'Active Site Residue',
	METAL: 'Metal Ion Binding Site Residue',
	BINDING: 'Binding Site Residue'
	// Non-terminal residue
};

export const RESIDUES = {
	CA_BIND: 'Calcium Binding Residue',
	ZN_FING: 'Zinc Finger Residue',
	DNA_BIND: 'DNA Binding Residue',
	NP_BIND: 'Nucleotide Phosphate Binding Residue',
	ACT_SITE: 'Active Site Residue',
	METAL: 'Metal Ion Binding Site Residue',
	BINDING: 'Binding Site Residue',
	SITE: 'Functionally Important Residue',
	MOD_RES: 'PTM Modified Residue',
	LIPID: 'PTM bound Lipid'
	// Non-standard residue
	// Glycosylation
	// Disulfide bond
};

const Modal = ({ handleClose, show, children }) => {
	const showHideClassName = show ? 'modal d-block' : 'modal d-none';

	return (
		<div className={showHideClassName}>
			<div className="modal-container">{children}</div>
		</div>
	);
};

class FunctionalSignificance extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expandedRow: null
		};
	}

	getEvidence(evidence) {
		return (
			<li key={uuidv1()}>
				<a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer">
					{evidence.name}
				</a>
			</li>
		);
	}
	getEvidences(evidences) {
		let evidenceList = [];
		let BASE_URL = 'https://www.ebi.ac.uk/QuickGO/term/';
		evidences.map((evidence) => {
			if (evidence.code !== null) {
				let URL = BASE_URL + evidence.code;
				let newEvidence = {
					name: evidence.code,
					sourceUrl: URL
				};
				evidenceList.push(this.getEvidence(newEvidence));
			}
			if (evidence.source !== null && evidence.source.id !== null) {
				let source = evidence.source.id;
				let url = '';
				if (evidence.source.url !== null) {
					url = evidence.source.url;
				}
				let newEvidence = {
					name: source,
					sourceUrl: url
				};
				evidenceList.push(this.getEvidence(newEvidence));
			}
		});
		return evidenceList;
	}
	// modalOpen() {
	// 	this.setState({ modal: true });
	// }

	// handleClick = () => {
	// 	if (!this.state.modal) {
	// 		document.addEventListener('click', this.handleOutsideClick, false);
	// 	} else {
	// 		document.removeEventListener('click', this.handleOutsideClick, false);
	// 	}

	// 	this.setState((prevState) => ({
	// 		modal: !prevState.modal
	// 	}));
	// };

	// modalClose() {
	// 	this.setState({
	// 		modal: false
	// 	});
	// }

	// handleOutsideClick = (e) => {
	// 	if (!this.node.contains(e.target)) this.modalClose();
	// };

	toggleFunctionRow(rowId) {
		const { expandedRow } = this.state;
		this.setState({
			expandedRow: rowId !== expandedRow ? rowId : null
		});
	}
	getFeatureDetail(rowKey, feature) {
		const { expandedRow } = this.state;
		if (rowKey === expandedRow) {
			return (
				<ul style={{ listStyleType: 'none' }}>
					<li>
						Position: {feature.begin}-{feature.end}
						<br />
						Evidences: <ul style={{ listStyleType: 'none' }}>{this.getEvidences(feature.evidences)}</ul>
					</li>
				</ul>
			);
		}
	}
	getFeatureList(feature, key) {
		let keyVal = uuidv1();
		return (
			<Fragment>
				<a href onClick={(e) => this.toggleFunctionRow(key)}>
					<li key={keyVal}>
						{FEATURES[feature.type]} - {feature.description}
					</li>
				</a>
				{this.getFeatureDetail(key, feature)}
			</Fragment>
		);
	}

	getRegions(regions, category) {
		let regionsList = [];
		let counter = 0;

		if (regions.length === 0) {
			return <label style={{ textAlign: 'center', fontWeight: 'bold' }}>No '{category}' to report</label>;
		}
		regions.map((region) => {
			counter = counter + 1;
			let key = category + '-' + counter;
			var list = this.getFeatureList(region, key);
			regionsList.push(list);
		});

		return <ul style={{ listStyleType: 'none' }}>{regionsList}</ul>;
	}

	render() {
		const { data, ensg, ensp, enst } = this.props;
		const ensgUrl = 'https://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=';
		const enspUrl = 'https://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=';
		const enstUrl = 'https://www.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=';
		var regions = [];
		var proteins = [];
		var residues = [];
		data.features.map((feature) => {
			if (REGIONS[feature.type] !== undefined && feature.evidences !== null) regions.push(feature);
			if (PROTEINS[feature.type] !== undefined && feature.evidences !== null) proteins.push(feature);
			if (RESIDUES[feature.type] !== undefined && feature.evidences !== null) residues.push(feature);
		});
		console.log(regions);
		return (
			<tr
				ref={(node) => {
					this.node = node;
				}}
			>
				<td colSpan="19" className="expanded-row">
					<div className="significances-groups">
						<div className="column">
							<h5>Reference Function</h5>
							<table>
								<tbody>
									<tr>
										<th>Residue</th>
										<th>Region</th>
									</tr>
									<tr>
										<td>{this.getRegions(residues, 'RESIDUES')}</td>
										<td>{this.getRegions(regions, 'REGIONS')}</td>
									</tr>
								</tbody>
							</table>

							<table>
								<tbody>
									<tr>
										<th>Protein</th>
									</tr>
									<tr>
										<td>{this.getRegions(proteins, 'PROTEINS')}</td>
									</tr>
								</tbody>
							</table>
							<table>
								<tbody>
									<tr>
										<td>
											<SignificanceDataLine label="GENE" value={ensg} link={ensgUrl} />
										</td>
										<td>
											<SignificanceDataLine label="TRANSLATION" value={ensp} link={enspUrl} />
										</td>
										<td>
											<SignificanceDataLine label="TRANSCRIPT" value={enst} link={enstUrl} />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</td>
			</tr>
		);
	}
}

export default FunctionalSignificance;
