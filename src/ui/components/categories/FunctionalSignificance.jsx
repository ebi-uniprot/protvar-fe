import React, { Component, Fragment } from 'react';

import { v1 as uuidv1 } from 'uuid';
import Evidences from './Evidences';
import { ChevronDownIcon } from 'franklin-sites';
import AminoAcidModel from './AminoAcidModel';

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
	LIPID: 'PTM bound Lipid',
	PTM: 'PTM',
	MUTAGEN: 'Mutagenesis',
	CATALYTIC_ACTIVITY: 'Catalytic Activity',
	ACTIVITY_REGULATION: 'ACTIVITY REGULATION',
	SUBUNIT: 'SUBUNIT',
	INTERACTION: 'INTERACTION',
	SUBCELLULAR_LOCATION: 'SUBCELLULAR LOCATION',
	SIMILARITY: 'Family',
	WEBRESOURCE: 'Additional Resource',
	HELIX: 'Helix'
};

export const REGIONS = {
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

	getPositionLabel(begin, end) {
		if (begin === end) {
			return (
				<Fragment>
					<b>Position :</b> {begin}
				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<b>Range : </b> {begin} - {end}
				</Fragment>
			);
		}
	}
	getFeatureDetail(rowKey, feature) {
		let keyVal = uuidv1();
		const { expandedFunctionalRow } = this.state;

		if (rowKey === expandedFunctionalRow) {
			return (
				<Fragment>
					<ul style={{ listStyleType: 'none', display: 'inline-block' }}>
						<li key={keyVal}>
							{this.getPositionLabel(feature.begin, feature.end)}
							<br />
							<Evidences evidences={feature.evidences} />
						</li>
					</ul>
				</Fragment>
			);
		}
	}
	getFeatureList(feature, key) {
		let category = '';
		if (FEATURES[feature.type] !== undefined && FEATURES[feature.type] !== null) {
			category = FEATURES[feature.type];
		}
		if (feature.description !== undefined && feature.description !== null) {
			category = category + '-' + feature.description;
		}

		return (
			<Fragment>
				{/* <a onClick={(e) => this.toggleFunctionRow(key)}>
					<li key={keyVal}> */}

				<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
					{category}
					<ChevronDownIcon className="chevronicon" />
				</button>
				{/* </li>
				</a> */}
				{this.getFeatureDetail(key, feature)}
			</Fragment>
		);
	}

	getRegions(regions, category, refAA, variantAA) {
		let regionsList = [];
		let featureList = [];
		let counter = 0;

		if (regions.length === 0) {
			if (category === 'residue') return <AminoAcidModel refAA={refAA} variantAA={variantAA} />;
			else
				return (
					<label style={{ textAlign: 'center', fontWeight: 'bold' }}>
						No functional data for the {category}
					</label>
				);
		}
		regions.map((region) => {
			counter = counter + 1;
			let key = category + '-' + counter;
			var list = this.getFeatureList(region, key);
			var feature = this.getFeatureDetail(key, region);
			featureList.push(feature);
			regionsList.push(list);
		});
		if (category === 'residue') {
			return (
				<Fragment>
					<AminoAcidModel refAA={refAA} variantAA={variantAA} />
					{regionsList}
				</Fragment>
			);
		} else return regionsList;
		// return (
		// 	<Fragment>
		// 		<ul style={{ listStyleType: 'none', display: 'inline-block' }}>{regionsList}</ul>
		// 		{/* {featureList} */}
		// 	</Fragment>
		// );
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
					<div>
						<ul>
							<li key={uuidv1()}>No '{commentName}' to report</li>
						</ul>
					</div>
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
						{/* <a onClick={(e) => this.toggleFunctionRow(key)}> */}

						<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
							<b>Catalytic Activity</b>
							<ChevronDownIcon className="chevronicon" />
						</button>

						{/* </a> */}
					</label>

					{this.getFeatures(features, key, 'CATALYTIC ACTIVITY')}
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
					{/* <label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>ACTIVITY REGULATION</b>
						</a>
					</label> */}
					<label>
						<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
							<b>Activity Regulation</b>
							<ChevronDownIcon className="chevronicon" />
						</button>
					</label>

					{this.getFeatures(features, key, 'ACTIVITY REGULATION')}
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
					{/* <label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>COMPLEX</b>
						</a>
					</label> */}

					<label>
						<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
							<b>Complex</b>
							<ChevronDownIcon className="chevronicon" />
						</button>
					</label>
					{this.getFeatures(features, key, 'SUBUNIT')}
				</Fragment>
			);
		}
	}

	getSubcellularLocation(locations) {
		var locationList = [];
		var topologyList = [];
		let features = [];
		locations.locations.map((location) => {
			if (location.location !== undefined && location.location !== null)
				locationList.push(<li key={uuidv1()}>{location.location.value}</li>);
			if (location.topology !== undefined && location.topology !== null)
				topologyList.push(<li key={uuidv1()}>{location.topology.value}</li>);
		});

		if (locations.text !== undefined && locations.text.length > 0) {
			features.push(this.getActivityRegulation(locations));
		}
		var loc = null;
		var topologies = null;
		var feature = null;
		if (locationList.length > 0)
			loc = (
				<label>
					<b>Locations : </b>
					<ul>{locationList}</ul>
				</label>
			);
		if (topologyList.length > 0)
			topologies = (
				<label>
					<b>Topologies : </b>
					<ul>{topologyList}</ul>
				</label>
			);
		if (features.length > 0)
			feature = (
				<label>
					<b>Features : </b>
					<ul>{features}</ul>
				</label>
			);
		if (locationList.length > 0) {
			return (
				<Fragment>
					<div>
						{loc}
						{topologies}
						{feature}
					</div>
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
					{/* <label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>SUBCELLULAR LOCATION</b>
						</a>
					</label> */}

					<label>
						<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
							<b>Subcellular Location</b>
							<ChevronDownIcon className="chevronicon" />
						</button>
					</label>
					{this.getFeatures(features, key, 'SubSUBCELLULAR LOCATION')}
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
					{/* <label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>PTM's</b>
						</a>
					</label> */}
					<label>
						<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
							<b>PTM's</b>
							<ChevronDownIcon className="chevronicon" />
						</button>
					</label>
					{this.getFeatures(features, key, 'PTM')}
				</Fragment>
			);
		}
	}

	getReferences(references, key) {
		const { expandedFunctionalRow } = this.state;
		if (key === expandedFunctionalRow) {
			var pfams = [];
			var interpro = [];
			if (references !== undefined && references !== null && references.length > 0) {
				references.map((reference) => {
					if (reference.type === 'Pfam') {
						var pfamUrl = 'https://pfam.xfam.org/family/' + reference.id;
						pfams.push(
							<li key={uuidv1()}>
								<a href={pfamUrl} target="_blank">
									{reference.id}
								</a>{' '}
								: {reference.properties['entry name']}
							</li>
						);
					}
					if (reference.type === 'InterPro') {
						var interproUrl = 'https://www.ebi.ac.uk/interpro/entry/InterPro/' + reference.id;
						interpro.push(
							<li key={uuidv1()}>
								<a href={interproUrl} target="_blank">
									{reference.id}
								</a>{' '}
								: {reference.properties['entry name']}
							</li>
						);
					}
				});
				var pfamTag = null;
				if (pfams.length > 0) {
					pfamTag = (
						<label>
							<b>Pfam:</b>
							<ul>
								<li key={uuidv1()}>{pfams}</li>
							</ul>
						</label>
					);
				}
				var interproTag = null;
				if (interpro.length > 0) {
					interproTag = (
						<label>
							<b>InterPro:</b>
							<ul>
								<li key={uuidv1()}>{interpro}</li>
							</ul>
						</label>
					);
				}
				return (
					<Fragment>
						<ul>
							<li key={uuidv1()}>{pfamTag}</li>
							<li key={uuidv1()}>{interproTag}</li>
						</ul>
					</Fragment>
				);
			}
		}
	}

	getSimilarity(similarities, references, accession, position) {
		let features = [];
		similarities.map((similarity) => {
			features.push(this.getActivityRegulation(similarity));
		});
		var key = 'similarity-' + accession + '-' + position;
		if (features.length > 0) {
			return (
				<Fragment>
					{/* <label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>FAMILY</b>
						</a>
					</label> */}

					<label>
						<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
							<b>Family</b>
							<ChevronDownIcon className="chevronicon" />
						</button>
					</label>
					{this.getFeatures(features, key, 'FAMILY')}
					<div>{this.getReferences(references, key)}</div>
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
					{/* <label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>DOMAINS</b>
						</a> */}
					{/* </label> */}

					<label>
						<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
							<b>Domains</b>
							<ChevronDownIcon className="chevronicon" />
						</button>
					</label>

					{this.getFeatures(features, key, 'DOMAIN')}
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
					{/* <label>
						<a onClick={(e) => this.toggleFunctionRow(key)}>
							<b>ADDITIONAL RESOURCES</b>
						</a>
					</label> */}

					<label>
						<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
							<b>Additional Resources</b>
							<ChevronDownIcon className="chevronicon" />
						</button>
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
					<label>
						<b>Gene : </b>
						{gene}
					</label>
					<label>
						<b>IntAct : </b>
						<a href={url} target="_blank">
							{interactor}
						</a>
					</label>
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
					var geneInteractor = interaction.accession2 + '(' + interaction.gene + ')';
					if (gene === null) {
						gene = geneInteractor;
					} else {
						gene = gene + ' | ' + geneInteractor;
					}
				}
			});
			let url = 'https://www.ebi.ac.uk/intact/query/' + interactor;
			if (gene !== null) {
				return (
					<Fragment>
						{/* <label>
							<a onClick={(e) => this.toggleFunctionRow(key)}>
								<b>INTERACTIONS</b>
							</a>
						</label> */}

						<label>
							<button type="button" className="collapsible" onClick={(e) => this.toggleFunctionRow(key)}>
								<b>Interactions</b>
								<ChevronDownIcon className="chevronicon" />
							</button>
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
		references,
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
				{this.getSimilarity(similarities, references, accession, position)}
				{this.getWebResources(webresources, accession, position)}
				{this.getInteractions(interactions, accession, position)}
			</Fragment>
		);
	}
	getProteinRegions(regions, references, accession, position) {
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
			references,
			position
		);
	}

	getValue(label, value) {
		if (value !== null && value !== undefined) {
			return (
				<li key={uuidv1()}>
					<b>{label}: </b>
					{value}
				</li>
			);
		}
	}

	displayGeneName(label, geneNames) {
		if (geneNames !== null && geneNames !== undefined && geneNames.length > 0) {
			var genes = [];
			geneNames.map((geneName) => {
				genes.push(
					<li key={uuidv1()}>
						<b>{label} :</b> {geneName.geneName}
					</li>
				);
				if (geneName.synonyms !== null && geneName.synonyms !== undefined) {
					genes.push(
						<li key={uuidv1()}>
							<b>Synonyms: </b> {geneName.synonyms}
						</li>
					);
				}
			});
			return genes;
		}
	}
	getProteins(regions, data) {
		return (
			<table>
				<tbody>
					<tr>
						<td>
							<ul style={{ listStyleType: 'none' }}>
								{this.getValue('Recommended Name', data.name)}
								{this.getValue('Alternative Name', data.alternativeNames)}
								{this.displayGeneName('Gene Name', data.geneNames)}
								{/* {this.getValue('Synonyms', data.geneNames[0].synonyms)} */}
								{this.getValue('Id', data.id)}
								{this.getValue('ProteinExistence', data.proteinExistence)}
								{this.getValue('Entry last updated', data.lastUpdated)}
								{this.getValue('Sequence Modified', data.sequence.modified)}
								{this.getValue('Sequence Length', data.sequence.length)}
							</ul>
						</td>
						<td className="protein-table-cell">
							{this.getProteinRegions(regions, data.dbReferences, data.accession, data.position)}
						</td>
					</tr>
				</tbody>
			</table>
		);
	}

	render() {
		const { refAA, variantAA, data, ensg, ensp } = this.props;
		const ensgUrl = 'https://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=' + ensg;
		const enspUrl = 'https://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=';
		const enstUrl = 'https://www.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=';
		var regions = [];
		var proteins = [];
		var residues = [];
		var functions = {};
		var functionText = '';
		var functionEvidences = [];
		if (data.features !== null && data.features != undefined && data.features.length > 0) {
			data.features.map((feature) => {
				// if (REGIONS[feature.type] !== undefined && feature.evidences !== null) regions.push(feature);

				// if (RESIDUES[feature.type] !== undefined && feature.evidences !== null) residues.push(feature);
				if (feature.category !== 'VARIANTS') {
					if (feature.begin === feature.end) residues.push(feature);
					else regions.push(feature);
				}
			});
			if (data.comments !== undefined && data.comments !== null) {
				data.comments.map((comment) => {
					if (comment.type === 'FUNCTION' && comment.text.length > 0) {
						functionText = comment.text[0].value;
						if (comment.text[0].evidences !== undefined && comment.text[0].evidences !== null);
						functionEvidences.push(
							<Fragment>
								<br />
								<Evidences evidences={comment.text[0].evidences} />
							</Fragment>
						);
					}
					if (PROTEINS[comment.type] !== undefined) proteins.push(comment);
				});
			}
			var translatedSequences = [];
			ensp.map((ensps) => {
				var enspsUrl = enspUrl + ensps.ensp;
				translatedSequences.push(
					<li key={uuidv1()}>
						<a href={enspsUrl} target="_blank">
							{ensps.ensp} - {ensps.ensts}
						</a>
					</li>
				);
			});
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
											<td>{this.getRegions(residues, 'residue', refAA, variantAA)}</td>
											<td>{this.getRegions(regions, 'region', refAA, variantAA)}</td>
										</tr>
									</tbody>
								</table>
								<table>
									<tbody>
										<th>protein function</th>

										<tr>
											<td>
												{functionText}
												{functionEvidences}
											</td>
										</tr>
									</tbody>
								</table>
								<table>
									<tbody>
										<tr>
											<th>Further protein information</th>
										</tr>
										<tr>
											<td>{this.getProteins(proteins, data)}</td>
										</tr>
									</tbody>
								</table>
								<table>
									<tbody>
										{/* <tr>
											<td>
												<SignificanceDataLine label="GENE" value={ensg} link={ensgUrl} />
											</td>
											<td>
												<SignificanceDataLine label="TRANSLATION" value={ensp} link={enspUrl} />
											</td>
											<td>
												<SignificanceDataLine label="TRANSCRIPT" value={enst} link={enstUrl} />
											</td>
										</tr> */}
										<tr>
											<th>Gene</th>
											<th>Translated Sequences</th>
										</tr>
										<tr>
											<td>
												<a href={ensgUrl} target="_blank">
													{ensg}
												</a>
											</td>
											<td>
												<ul>{translatedSequences}</ul>
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
							<div className="column">No functional data for this residue</div>
						</div>
					</td>
				</tr>
			);
		}
	}
}

export default FunctionalSignificance;
