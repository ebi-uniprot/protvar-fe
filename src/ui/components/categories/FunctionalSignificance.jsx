import React, { Component, Fragment } from 'react';
import SignificanceDataLine from '../significances/SignificanceDataLine';
import { v1 as uuidv1 } from 'uuid';
import Evidences from './Evidences';

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
	// TRANSMEM: 'Helical Transmembrane Peptide',
	// DNA_BIND: 'DNA Binding Residue',
	// NP_BIND: 'Nucleotide Phosphate Binding Residue',
	// ACT_SITE: 'Active Site Residue',
	// METAL: 'Metal Ion Binding Site Residue',
	// BINDING: 'Binding Site Residue'
	CATALYTIC_ACTIVITY: 'CATALYTIC ACTIVITY',
	ACTIVITY_REGULATION: 'ACTIVITY REGULATION',
	SUBUNIT: 'SUBUNIT',
	INTERACTION: 'INTERACTION',
	SUBCELLULAR_LOCATION: 'SUBCELLULAR LOCATION',
	DOMAIN: 'DOMAIN',
	PTM: 'PTM',
	SIMILARITY: 'Family',
	WEBRESOURCE: 'Additional Resource'
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
			expandedFunctionalRow: null
		};
	}

	toggleFunctionRow(rowId) {
		const { expandedFunctionalRow } = this.state;
		this.setState({
			expandedFunctionalRow: rowId !== expandedFunctionalRow ? rowId : null
		});
	}
	getFeatureDetail(rowKey, feature) {
		let keyVal = uuidv1();
		const { expandedFunctionalRow } = this.state;
		if (rowKey === expandedFunctionalRow) {
			return (
				<Fragment>
					<ul style={{ listStyleType: 'none', display: 'inline-block' }}>
						<li key={keyVal}>
							Position: {feature.begin}-{feature.end}
							<ul>
								<Evidences evidences={feature.evidences} />
							</ul>
						</li>
					</ul>
				</Fragment>
			);
		}
	}
	getFeatureList(feature, key) {
		let keyVal = uuidv1();
		return (
			<Fragment>
				<a onClick={(e) => this.toggleFunctionRow(key)}>
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
		let featureList = [];
		let counter = 0;

		if (regions.length === 0) {
			return <label style={{ textAlign: 'center', fontWeight: 'bold' }}>No '{category}' to report</label>;
		}
		regions.map((region) => {
			counter = counter + 1;
			let key = category + '-' + counter;
			var list = this.getFeatureList(region, key);
			var feature = this.getFeatureDetail(key, region);
			featureList.push(feature);
			regionsList.push(list);
		});

		return (
			<Fragment>
				<ul style={{ listStyleType: 'none', display: 'inline-block' }}>{regionsList}</ul>
				{/* {featureList} */}
			</Fragment>
		);
	}

	getRHEA(dbReference) {
		if (dbReference.id !== undefined && dbReference.id !== null) {
			return (
				<a href={dbReference.url} target="_blank">
					{dbReference.id}
				</a>
			);
		}
	}
	catalyticActivityDetails(reaction, key) {
		const { expandedFunctionalRow } = this.state;
		var displayDetails = false;
		if (key === expandedFunctionalRow) displayDetails = true;
		var dbReference = {};

		var ecNumberFlag = true;
		if (reaction.ecNumber === undefined) {
			ecNumberFlag = false;
		}
		var evidencesFlag = false;
		if (reaction.evidences !== undefined && reaction.evidences !== null && reaction.evidences.length > 0) {
			evidencesFlag = true;
		}
		var ecNumberUrl = 'https://www.ebi.ac.uk/enzymeportal/ec/' + reaction.ecNumber;
		if (reaction.dbReferences !== undefined && reaction.dbReferences !== null) {
			reaction.dbReferences.map((reference) => {
				if (reference.type === 'Rhea' && reference.id.includes('RHEA:')) {
					dbReference.id = reference.id;
					dbReference.url = 'https://www.rhea-db.org/rhea/' + reference.id.split(':')[1];
				}
			});
		}
		return (
			<div>
				<ul>
					<li key={uuidv1()}>{this.getRHEA(dbReference)} </li>
				</ul>

				{/* {ecNumberFlag ? (
					<li key={uuidv1()}>
						<a href={ecNumberUrl} target="_blank">
							{reaction.ecNumber}
						</a>
					</li>
				) : (
					<li key={uuidv1()} />
				)} */}

				{evidencesFlag ? (
					<ul>
						<li key={uuidv1()}>
							<Evidences evidences={reaction.evidences} />
						</li>
					</ul>
				) : (
					<li key={uuidv1()} />
				)}
				<hr />
			</div>
		);
	}

	getCatalyticActivity(region, accession, position) {
		var reaction = region.reaction;
		var key = 'catalytic-activity-' + accession + '-' + position;
		return (
			<Fragment>
				<ul>
					<li key={uuidv1()}>{reaction.name}</li>
				</ul>

				{this.catalyticActivityDetails(reaction, key)}
			</Fragment>
		);
	}

	getFeatures(features, key, commentName) {
		const { expandedFunctionalRow } = this.state;
		if (key === expandedFunctionalRow) {
			if (features !== undefined && features.length > 0) return features;
			else {
				return (
					<Fragment>
						<ul>
							<li key={uuidv1()}>No '{commentName}' to report</li>
						</ul>
					</Fragment>
				);
			}
		}
	}

	getCatalyticActivities(regions, accession, position) {
		let features = [];
		regions.map((region) => {
			features.push(this.getCatalyticActivity(region));
		});
		var key = 'catalytic-activity-' + accession + '-' + position;
		if (features.length > 0) {
			return (
				<Fragment>
					<label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>CATALYTIC ACTIVITY</b>
						</a>
					</label>

					<div>{this.getFeatures(features, key, 'CATALYTIC ACTIVITY')}</div>
				</Fragment>
			);
		}
	}

	getActivityRegulation(regulation) {
		if (regulation !== undefined && regulation.text !== undefined && regulation.text.length > 0) {
			let text = regulation.text[0];
			return (
				<div>
					<ul>
						<li key={uuidv1()}>{text.value}</li>
					</ul>
					{/* <label>{text.value}</label> */}
					<ul>
						<li key={uuidv1()}>
							<Evidences evidences={text.evidences} />
						</li>
					</ul>
					<hr />
				</div>
			);
		}
	}
	getActivityRegulations(activityRegulations, accession, position) {
		let features = [];
		activityRegulations.map((regulation) => {
			features.push(this.getActivityRegulation(regulation));
		});
		var key = 'activity-regulation-' + accession + '-' + position;
		if (features.length > 0) {
			return (
				<Fragment>
					<label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>ACTIVITY REGULATION</b>
						</a>
					</label>

					<div>{this.getFeatures(features, key, 'ACTIVITY REGULATION')}</div>
				</Fragment>
			);
		}
	}

	getSubunits(subunits, accession, position) {
		let features = [];
		subunits.map((subunit) => {
			features.push(this.getActivityRegulation(subunit));
		});
		var key = 'subunit-' + accession + '-' + position;
		if (features.length > 0) {
			return (
				<Fragment>
					<label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>SUBUNIT</b>
						</a>
					</label>

					<div>{this.getFeatures(features, key, 'SUBUNIT')}</div>
				</Fragment>
			);
		}
	}

	getLocation(location) {
		var loc = null;
		if (location.location !== undefined && location.location !== null) {
			loc = location.location.value;
		}
		if (location.topology !== undefined && location.topology !== null) {
			loc = loc + ' - ' + location.topology.value;
		}
		if (loc !== null) {
			return <li>{loc}</li>;
		}
	}

	getSubcellularLocation(locations) {
		var locationList = [];
		let features = [];
		locations.locations.map((location) => {
			locationList.push(this.getLocation(location));
		});

		if (locations.text !== undefined && locations.text.length > 0) {
			features.push(this.getActivityRegulation(locations));
			// locationText = locations.text[0].value;
		}
		if (locationList.length > 0) {
			return (
				<Fragment>
					<div>
						<label>
							<b>Locations : </b>
							<ul>{locationList}</ul>
						</label>
					</div>
					{features}
				</Fragment>
			);
		}
	}

	getSubcellularLocations(subcellularLocations, accession, position) {
		let features = [];
		subcellularLocations.map((locations) => {
			features.push(this.getSubcellularLocation(locations));
		});
		var key = 'cellular-' + accession + '-' + position;
		if (features.length > 0) {
			return (
				<Fragment>
					<label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>SUBCELLULAR LOCATION</b>
						</a>
					</label>

					<div>{this.getFeatures(features, key, 'SubSUBCELLULAR LOCATION')}</div>
				</Fragment>
			);
		}
	}

	getPTMs(ptms, accession, position) {
		let features = [];
		ptms.map((location) => {
			features.push(this.getActivityRegulation(location));
		});
		var key = 'ptm-' + accession + '-' + position;
		if (features.length > 0) {
			return (
				<Fragment>
					<label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>PTM</b>
						</a>
					</label>

					<div>{this.getFeatures(features, key, 'PTM')}</div>
				</Fragment>
			);
		}
	}

	getSimilarity(similarities, accession, position) {
		let features = [];
		similarities.map((similarity) => {
			features.push(this.getActivityRegulation(similarity));
		});
		var key = 'similarity-' + accession + '-' + position;
		if (features.length > 0) {
			return (
				<Fragment>
					<label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>FAMILY</b>
						</a>
					</label>

					<div>{this.getFeatures(features, key, 'FAMILY')}</div>
				</Fragment>
			);
		}
	}

	getDomains(domains, accession, position) {
		let features = [];
		domains.map((domain) => {
			features.push(this.getActivityRegulation(domain));
		});
		var key = 'domain-' + accession + '-' + position;
		if (features.length > 0) {
			return (
				<Fragment>
					<label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>DOMAINS</b>
						</a>
					</label>

					<div>{this.getFeatures(features, key, 'DOMAIN')}</div>
				</Fragment>
			);
		}
	}

	getWebResource(webresource) {
		return (
			<a href={webresource.url} target="_blank">
				<li key={uuidv1()}>{webresource.name}</li>
			</a>
		);
	}

	getWebResources(webresources, accession, position) {
		let features = [];
		webresources.map((webresource) => {
			if (webresource.name !== undefined && webresource.url !== undefined) {
				features.push(this.getWebResource(webresource));
			}
		});
		var key = 'webresource-' + accession + '-' + position;
		if (features.length > 0) {
			return (
				<Fragment>
					<label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>ADDITIONAL RESOURCES</b>
						</a>
					</label>

					<ul>{this.getFeatures(features, key, 'ADDITIONAL RESOURCES')}</ul>
				</Fragment>
			);
		}
	}

	getInteraction(gene, interactor, url, key) {
		const { expandedFunctionalRow } = this.state;
		if (key === expandedFunctionalRow) {
			return (
				<Fragment>
					<label>Gene : {gene}</label>
					<a href={url} target="_blank">
						{interactor}
					</a>
				</Fragment>
			);
		}
	}
	getInteractions(interactions, accession, position) {
		if (
			interactions.length > 0 &&
			interactions[0].interactions !== null &&
			interactions[0].interactions !== undefined &&
			interactions[0].interactions.length > 0
		) {
			var gene = null;
			var interactor = '';
			var key = 'interactions-' + accession + '-' + position;
			interactions[0].interactions.map((interaction) => {
				if (interaction.accession1 === accession) {
					interactor = interaction.interactor1;
					if (gene === null) {
						gene = interaction.gene;
					} else {
						gene = gene + ' | ' + interaction.gene;
					}
				}
			});
			let url = 'https://www.ebi.ac.uk/intact/query/' + interactor;
			if (gene !== null) {
				return (
					<Fragment>
						<label>
							<a onClick={(e) => this.toggleFunctionRow(key)}>
								<b>INTERACTIONS</b>
							</a>
						</label>

						<ul>{this.getInteraction(gene, interactor, url, key)}</ul>
					</Fragment>
				);
			}
		}
	}

	getComments(
		catalyticActivities,
		activityRegulations,
		subunits,
		subcellularLocations,
		ptms,
		similarities,
		webresources,
		domains,
		interactions,
		accession,
		position
	) {
		return (
			<Fragment>
				{this.getCatalyticActivities(catalyticActivities, accession, position)}
				{this.getActivityRegulations(activityRegulations, accession, position)}
				{this.getSubunits(subunits, accession, position)}
				{this.getSubcellularLocations(subcellularLocations, accession, position)}
				{this.getDomains(domains, accession, position)}
				{this.getPTMs(ptms, accession, position)}
				{this.getSimilarity(similarities, accession, position)}
				{this.getWebResources(webresources, accession, position)}
				{this.getInteractions(interactions, accession, position)}
			</Fragment>
		);
	}
	getProteinRegions(regions, accession, position) {
		var catalyticActivities = [];
		var activityRegulations = [];
		var subunits = [];
		var subcellularLocations = [];
		var domains = [];
		var ptms = [];
		var similarity = [];
		var webresource = [];
		var interactions = [];
		regions.map((region) => {
			switch (region.type) {
				case 'CATALYTIC_ACTIVITY':
					catalyticActivities.push(region);
					break;
				case 'ACTIVITY_REGULATION':
					activityRegulations.push(region);
					break;
				case 'SUBUNIT':
					subunits.push(region);
					break;
				case 'SUBCELLULAR_LOCATION':
					if (region.molecule === undefined) subcellularLocations.push(region);
					break;
				case 'DOMAIN':
					domains.push(region);
					break;
				case 'PTM':
					ptms.push(region);
					break;
				case 'SIMILARITY':
					similarity.push(region);
					break;
				case 'WEBRESOURCE':
					webresource.push(region);
					break;
				case 'INTERACTION':
					interactions.push(region);
				default:
					return '';
			}
		});
		return this.getComments(
			catalyticActivities,
			activityRegulations,
			subunits,
			subcellularLocations,
			ptms,
			similarity,
			webresource,
			domains,
			interactions,
			accession,
			position
		);
	}
	getProteins(regions, id, proteinExistence, sequence, accession, position) {
		return (
			<table>
				<tbody>
					<tr>
						<td>
							<ul style={{ listStyleType: 'none' }}>
								<li key={uuidv1()}>{id}</li>
								<li key={uuidv1()}>Length:{sequence.length}</li>
								<li key={uuidv1()}>{proteinExistence}</li>
							</ul>
						</td>
						<td>{this.getProteinRegions(regions, accession, position)}</td>
					</tr>
				</tbody>
			</table>
		);
	}

	render() {
		const { data, ensg, ensp, enst } = this.props;
		const ensgUrl = 'https://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=';
		const enspUrl = 'https://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=';
		const enstUrl = 'https://www.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=';
		var regions = [];
		var proteins = [];
		var residues = [];
		var functions = {};
		var functionText = '';
		if (data.features !== null && data.features != undefined && data.features.length > 0) {
			data.features.map((feature) => {
				if (REGIONS[feature.type] !== undefined && feature.evidences !== null) regions.push(feature);

				if (RESIDUES[feature.type] !== undefined && feature.evidences !== null) residues.push(feature);
			});
			if (data.comments !== undefined && data.comments !== null) {
				data.comments.map((comment) => {
					if (comment.type === 'FUNCTION') functionText = comment.text[0].value;
					if (PROTEINS[comment.type] !== undefined) proteins.push(comment);
				});
			}
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
										<th>FUNCTION</th>

										<tr>
											<td>{functionText}</td>
										</tr>
									</tbody>
								</table>
								<table>
									<tbody>
										<tr>
											<th>Protein</th>
										</tr>
										<tr>
											<td>
												{this.getProteins(
													proteins,
													data.id,
													data.proteinExistence,
													data.sequence,
													data.accession,
													data.position
												)}
											</td>
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
		} else {
			return (
				<tr
					ref={(node) => {
						this.node = node;
					}}
				>
					<td colSpan="19" className="expanded-row">
						{' '}
						<div className="significances-groups">
							<div className="column">No functions to report</div>
						</div>
					</td>
				</tr>
			);
		}
	}
}

export default FunctionalSignificance;
