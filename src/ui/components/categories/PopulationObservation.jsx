import React, { Component, Fragment } from 'react';

import { v1 as uuidv1 } from 'uuid';
import Evidences from './Evidences';

class PopulationObservation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expandedRow: null,
			expandedColocatedRow: null
		};
	}

	toggleexpandedRow(rowId) {
		const { expandedRow } = this.state;
		this.setState({
			expandedRow: rowId !== expandedRow ? rowId : null
		});
	}

	toggleColocated(rowId) {
		const { expandedColocatedRow } = this.state;
		this.setState({
			expandedColocatedRow: rowId !== expandedColocatedRow ? rowId : null
		});
	}
	getReference(xref) {
		return (
			<li>
				<a href={xref.url} target="_blank">
					{xref.id}
				</a>
			</li>
		);
	}

	getReferenceForEachSource(sourceName, ids) {
		return (
			<li key={uuidv1()}>
				<b>{sourceName} :</b>
				<ul className="flatList">{ids}</ul>
			</li>
		);
	}

	getReferences(xrefs, key) {
		let expandedRow = this.state.expandedRow;
		if (key === expandedRow) {
			let xrefList = [];
			if (xrefs !== undefined && xrefs.length > 0) {
				let xrefMap = new Map();
				xrefs.map((xref) => {
					let source = [];
					if (xrefMap.get(xref.name) !== undefined) {
						source = xrefMap.get(xref.name);
					}
					source.push(this.getReference(xref));
					xrefMap.set(xref.name, source);
				});
				for (let [ key, value ] of xrefMap) {
					xrefList.push(this.getReferenceForEachSource(key, value));
				}
			}
			return <ul>{xrefList}</ul>;
		}
	}
	getAssociation(association) {
		let name = association.name;
		if (association.description !== undefined && association.description !== null)
			name = name + '-' + association.description;
		return (
			<Fragment>
				<ul>
					<li>{name}</li>
					<li>
						<Evidences evidences={association.evidences} />
					</li>
				</ul>
				<hr />
			</Fragment>
		);
	}

	getAssociations(associations, key) {
		let expandedRow = this.state.expandedRow;
		if (key === expandedRow) {
			let diseaseAssociations = [];
			associations.map((association) => {
				diseaseAssociations.push(this.getAssociation(association));
			});
			if (diseaseAssociations.length > 0) {
				return diseaseAssociations;
			}
		}
	}
	getAssociationsTag(associations, prevKey) {
		if (associations !== undefined && associations.length > 0) {
			let key = 'variant-association';
			if (prevKey !== undefined) if (prevKey) key = key + prevKey;
			return (
				<li>
					<a onClick={(e) => this.toggleexpandedRow(key)}>
						<b>Disease Associations</b>{' '}
					</a>
					{this.getAssociations(associations, key)}
				</li>
			);
		}
	}

	getPopFrequency(frequency) {
		let name = frequency.sourceName;
		let frequencies = frequency.frequencies.map((freq) => {
			return (
				<li>
					{freq.label}-{freq.value}
				</li>
			);
		});
		return (
			<Fragment>
				<ul>
					<li>{name}</li>
					<ul>
						<li>{frequencies}</li>
					</ul>
				</ul>
				<hr />
			</Fragment>
		);
	}

	getPopulationFrequencies(populationFrequencies, key) {
		let expandedRow = this.state.expandedRow;
		if (key === expandedRow) {
			let frequencies = [];
			populationFrequencies.map((popFrequency) => {
				frequencies.push(this.getPopFrequency(popFrequency));
			});
			if (frequencies.length > 0) {
				return (
					<li>
						<b>Population Freuencies:</b> {frequencies}
					</li>
				);
			}
		}
	}

	getPopulationFrequenciesTag(populationFrequencies, prevKey) {
		if (populationFrequencies !== undefined && populationFrequencies.length > 0) {
			let key = 'variant-frequency';
			if (prevKey !== undefined) if (prevKey) key = key + prevKey;
			return (
				<li>
					<a onClick={(e) => this.toggleexpandedRow(key)}>
						<b>Population Freuencies:</b>{' '}
					</a>{' '}
					{this.getPopulationFrequencies(populationFrequencies, key)}
				</li>
			);
		}
	}

	getReferenceTag(xrefs, prevKey) {
		let key = 'variant-reference';
		if (prevKey !== undefined) if (prevKey) key = key + prevKey;
		if (xrefs !== undefined && xrefs.length > 0) {
			return (
				<li>
					<a onClick={(e) => this.toggleexpandedRow(key)}>
						<b>References</b>{' '}
					</a>
					{this.getReferences(xrefs, key)}
				</li>
			);
		}
	}
	getVariant(variants) {
		if (variants.length > 0) {
			let variant = variants[0];
			let change = variant.wildType + '>' + variant.alternativeSequence;

			return (
				<ul>
					<li>
						<b>Genomic Location:</b> {variant.genomicLocation}
					</li>
					<li>
						<b>Change:</b> {change}
					</li>
					{this.getReferenceTag(variant.xrefs)}

					{this.getAssociationsTag(variant.association)}

					{this.getPopulationFrequencies(variant.populationFrequencies)}

					{/* <li>{variant.predictions}</li> */}
				</ul>
			);
		}
		return <label>No Variant to report</label>;
	}
	getColocatedVariantDetails(variant, key) {
		let expandedColocatedRow = this.state.expandedColocatedRow;
		if (key === expandedColocatedRow) {
			let change = variant.wildType + '>' + variant.alternativeSequence;
			return (
				<ul>
					<li>Change: {change}</li>
					{this.getReferenceTag(variant.xrefs, key)}

					{this.getAssociationsTag(variant.association, key)}

					{this.getPopulationFrequencies(variant.populationFrequencies, key)}
				</ul>
			);
		}
	}
	getColocatedVariant(variant) {
		let key = 'colocated-' + variant.genomicLocation;
		return (
			<li>
				<ul>
					<li>
						<a onClick={(e) => this.toggleColocated(key)}>{variant.genomicLocation}</a>
					</li>
					<li>{this.getColocatedVariantDetails(variant, key)}</li>
				</ul>
			</li>
		);
	}

	getColocatedVariants(variants) {
		if (variants.length > 0) {
			var colocatedVariants = [];
			variants.map((variant) => {
				colocatedVariants.push(this.getColocatedVariant(variant));
			});
			return <ul>{colocatedVariants}</ul>;
		}
		return <label>No Colocated Variants to report</label>;
	}

	render() {
		const { data, altAA } = this.props;

		if (data.proteinColocatedVariant != undefined && data.proteinColocatedVariant.length > 0) {
			let variant = [];
			let colocatedVariant = [];
			data.proteinColocatedVariant.map((variation) => {
				if (variation.alternativeSequence === altAA) {
					variant.push(variation);
				} else {
					colocatedVariant.push(variation);
				}
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
								<h5>Population Observation</h5>
								<table>
									<tbody>
										<tr>
											<th>Variant</th>
											<th>Colocated Variants</th>
										</tr>
										<tr>
											<td>{this.getVariant(variant, 'VARIANT')}</td>
											<td>{this.getColocatedVariants(colocatedVariant, 'COLOCATED VARIANT')}</td>
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
							<div className="column">No Population Observation to report</div>
						</div>
					</td>
				</tr>
			);
		}
	}
}

export default PopulationObservation;
