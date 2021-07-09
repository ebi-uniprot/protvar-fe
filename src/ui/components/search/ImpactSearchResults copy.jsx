import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';
import ExpandedFunctionalSignificance from '../significances/ExpandedFunctionalSignificance';
import ExpandedTranscriptSignificance from '../significances/ExpandedTranscriptSignificance';
import ExpandedClinicalSignificance from '../significances/ExpandedClinicalSignificance';
import ExpandedStructuralSignificance from '../significances/ExpandedStructuralSignificance';
import ExpandedGenomicSignificance from '../significances/ExpandedGenomicSignificance';
import ProteinReviewStatus from '../other/ProteinReviewStatus';
import SearchResultsLegends from '../other/SearchResultsLegends';
import { Loader } from 'franklin-sites';
import axios, { post } from 'axios';

class ImpactSearchResults extends Component {
	state = {
		expandedRow: null,
		showAllIsoforms: false,
		openGroup: null,
		loading: false,
		colocatedVariantLoaded: false,
		structureLoaded: false,
		caddLoaded: false,
		showLoader: false
	};

	getSignificancesButton(rowKey, row, significanceType, buttonCss, buttonTag) {
		// const significanceType = 'functional';
		const rowIdAndType = `${rowKey}:${significanceType}`;
		const { expandedRow } = this.state;
		if (rowIdAndType === expandedRow) {
			var css = `${buttonCss} ${buttonCss}--border`;
			console.log('css' + css);
			return (
				<button
					onClick={() => this.toggleSignificanceRow(rowKey, significanceType, row)}
					className={'button--significances ' + css}
				>
					<u>
						<b>{buttonTag}</b>
					</u>
				</button>
			);
		} else {
			return (
				<button
					onClick={() => this.toggleSignificanceRow(rowKey, significanceType, row)}
					className={'button--significances ' + buttonCss}
				>
					{buttonTag}
				</button>
			);
		}
	}

	getCaddPrediction(transcript) {
		if (this.state.caddLoaded) {
			const caddColour = transcript.caddPhred <= 30 ? 'green' : 'red';
			if (transcript.caddPhred === '-') {
				return <span />;
			} else {
				return (
					<span
						className={`label warning cadd-score cadd-score--${caddColour}`}
						title={`Likely ${transcript.caddPhred < 30 ? 'Benign' : 'Deleterious'}`}
					>
						{transcript.caddPhred}
					</span>
				);
			}
		}
		// else {
		// 	return <span>'-'</span>;
		// }
	}
	createStructuralSignificance(variant, structures) {
		if (Object.keys(structures).length === 0) {
			return structuralSignificance;
		}
		var accession = variant.protein.accession;
		var position = variant.variation.begin;
		var structure = structures[position];
		var structuralSignificance = {};

		if (Object.keys(structure[accession].all_structures).length === 0) {
			return structuralSignificance;
		}

		structuralSignificance.position = position;
		structuralSignificance.proteinLength = structure[accession].length;
		structuralSignificance.allStructures = JSON.parse(JSON.stringify(structure[accession].all_structures)); //{ ...variant.structure[accession].all_structures };
		structuralSignificance.annotations = [ structure[accession].annotations ];
		structuralSignificance.ligands = structure[accession].ligands.positions;
		structuralSignificance.interactions = structure[accession].interactions.positions;
		structuralSignificance.structures = structure[accession].structures.positions;
		structuralSignificance.accession = accession;
		if (Object.keys(structuralSignificance.allStructures).length > 0) {
			Object.keys(structuralSignificance.allStructures).forEach((key) => {
				var allStructure = structuralSignificance.allStructures[key];
				allStructure.forEach((structure) => {
					var residue = structure['residue_range'].split('-');
					structure['start'] = parseInt(residue[0], 10);
					structure['end'] = parseInt(residue[1], 10);
				});
			});
		}
		return structuralSignificance;
	}

	updateCADDPrediction(inputArr) {
		console.log('CADD Prediction called ' + inputArr);
		const headers = {
			'Content-Type': 'application/json'
		};

		var errorFlag = false;
		// const BASE_URL = 'http://localhost:8091/uniprot/api/pepvep/variant/prediction/';
		const BASE_URL = 'http://wwwdev.ebi.ac.uk/uniprot/api/pepvep/variant/prediction/';
		axios
			.post(BASE_URL, inputArr, {
				headers: headers
			})
			.catch(function(error) {
				if (error.response) {
					errorFlag = true;
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log('Error', error.message);
				}
				console.log(error.config);
			})
			.then((response) => {
				if (errorFlag) {
					inputArr.forEach((input) => {
						var variantRows = this.props.rows[input].rows;
						variantRows.forEach((variant) => {
							variant.significances.transcript[0].caddPhred = 'failed';
						});
					});
					this.setState({
						caddLoaded: true
					});
				} else {
					Object.keys(this.props.rows).forEach((input) => {
						var variantRows = this.props.rows[input].rows;
						var feature = response.data[input];

						variantRows.forEach((variant) => {
							variant.significances.transcript[0].caddPhred = '-';

							if (feature !== undefined) {
								variant.significances.genomic.consequencePrediction.caddPhred = feature;
							}
						});

						if (feature !== undefined) {
							variantRows[0].significances.transcript[0].caddPhred = feature;
							variantRows[0].significances.genomic.consequencePrediction.caddPhred = feature;
						} else {
							variant.significances.transcript[0].caddPhred = '-';
						}
					});
					this.setState({
						caddLoaded: true
					});
				}
			});
	}
	componentDidUpdate() {
		var inputArr = [];
		Object.keys(this.props.rows).forEach((input) => {
			var variantRows = this.props.rows[input].rows;
			if (variantRows[0].significances.transcript[0].caddPhred === 0.0) {
				variantRows[0].significances.transcript[0].caddPhred = 'Loading';
				inputArr.push(input);
			}
		});
		if (inputArr.length > 0) {
			this.updateCADDPrediction(inputArr);
		}
	}
	componentDidMount() {
		var inputArr = Object.keys(this.props.rows);
		this.updateCADDPrediction(inputArr);
		var options = {
			root: null,
			rootMargin: '0px',
			threshold: 1.0
		};
		const target = document.querySelector('#scrollTarget');
		this.observer = new IntersectionObserver(this.handleObserver.bind(this), options);
		this.observer.observe(target);
	}

	handleObserver(entities, observer) {
		const page = this.props.page;
		if (entities[0].isIntersecting === true) {
			if (page.nextPage) {
				// alert('Calling next page');
				this.fetchNextPage(1);
			} else {
				// alert('End of result');
			}
		}
		// let target = document.querySelector('#scrollTarget');
	}

	toggleAllIsoforms = () => {
		const { showAllIsoforms } = this.state;

		this.setState({
			showAllIsoforms: !showAllIsoforms,
			openGroup: null
		});
	};

	getStructuralSignificance(structural, detailsPageLink) {
		if (this.state.structureLoaded) {
			return <ExpandedStructuralSignificance data={structural} detailsLink={detailsPageLink} />;
		} else {
			return this.getLoader();
		}
	}

	getClinicalSignificance(clinical, variation, detailsPageLink) {
		// if (this.state.colocatedVariantLoaded) {
		return <ExpandedClinicalSignificance data={clinical} variation={variation} detailsLink={detailsPageLink} />;
		// } else {
		// 	return this.getLoader();
		// }
	}

	getLoader() {
		return (
			<tr className="loader-border ">
				<td />
				<td />
				<td />
				<td />
				<td />
				<td />
				<td>
					<Loader />
				</td>
				<td />
				<td />
				<td />
				<td />
				<td />
				<td />
			</tr>
		);
	}

	getFunctionalSignificance(functional, variation, detailsPageLink) {
		// if (this.state.colocatedVariantLoaded) {
		return <ExpandedFunctionalSignificance data={functional} variation={variation} detailsLink={detailsPageLink} />;
		// } else {
		// 	return this.getLoader();
		// }
	}

	toggleAcessionIsoforms = (group) => {
		const { openGroup } = this.state;

		this.setState({
			openGroup: openGroup === group ? null : group
		});
	};

	toggleSignificanceRow(rowId, significanceType, row) {
		const { expandedRow } = this.state;
		const rowIdAndType = `${rowId}:${significanceType}`;
		// const BASE_URL = 'http://localhost:8091/uniprot/api/pepvep';
		const BASE_URL = 'http://wwwdev.ebi.ac.uk/uniprot/api/pepvep';
		if (significanceType === 'structural') {
			if (Object.keys(row.significances.structural).length === 0) {
				this.setState({
					structureLoaded: false,
					expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null
				});
				axios.get(BASE_URL + row.significances.structureEndpoint).then((response) => {
					row.significances.structural = this.createStructuralSignificance(row, response.data);
					this.setState({ structureLoaded: true });
					this.setState({ showLoader: false });
				});
			} else {
				this.setState({
					expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null
				});
			}
		} else {
			this.setState({
				expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null
			});
		}
	}

	fetchNextPage = (next) => {
		var fetchNextPage = this.props.fetchNextPage;
		var loading = this.props.loading;

		var page = this.props.page;
		if (next === 1) {
			page.currentPage = page.currentPage + 1;
		} else {
			page.currentPage = page.currentPage - 1;
		}
		this.setState({
			loading: true
		});
		fetchNextPage(this.props.file, page, false, true);
	};

	bulkDownload = (event) => {
		var handleBulkDownload = this.props.handleBulkDownload;
		handleBulkDownload(event, this.props.file);
	};

	render() {
		// const { rows, handleDownload } = this.props;

		const rows = this.props.rows;
		const page = this.props.page;
		const file = this.props.file;
		const nextPage = this.props.page.nextPage;
		const handleDownload = this.props.handleDownload;
		const handleBulkDownload = this.props.handleBulkDownload;
		const loading = this.props.loading;
		const { expandedRow, showAllIsoforms, openGroup } = this.state;
		const noLoading = false;
		const significanceLoading = this.state.colocatedVariantLoaded;

		let counter = 0;

		return (
			<div className="search-results" id="divRoot">
				<SearchResultsLegends />
				<div className="results-and-counter">
					{file == null ? (
						<Button onClick={handleDownload}>Download</Button>
					) : (
						<Button onClick={this.bulkDownload}>Download</Button>
					)}
					<Button onClick={this.toggleAllIsoforms}>
						{showAllIsoforms ? 'Hide ' : 'Show '}
						Isoforms
					</Button>
				</div>
				{noLoading ? (
					<table>
						<tbody>
							<tr className="loader-border">
								<td>
									<Loader />
								</td>
							</tr>
						</tbody>
					</table>
				) : (
					<table border="0" className="unstriped" cellPadding="0" cellSpacing="0">
						<tbody>
							<tr>
								{/* <th colSpan="2" rowSpan="2">
									Gene Name
								</th> */}
								<th colSpan="4">Input</th>
								<th colSpan="4">Genomic</th>
								<th colSpan="5">Protein</th>
								<th colSpan="5">Impact</th>
							</tr>

							<tr>
								<th>ID</th>
								<th>Coordinate</th>
								<th>Ref</th>
								<th>Alt</th>
								<th>Gene</th>
								<th>Codon</th>
								<th>CADD</th>
								<th>MS</th>
								<th>Protein</th>
								<th>Isoform(CAN)</th>
								<th>AA Pos</th>
								<th>AA Change</th>
								<th>Consequence</th>
								<th>C</th>
								<th>G</th>
								<th>T</th>
								<th>F</th>
								<th>S</th>
							</tr>

							{Object.keys(rows).map((key) => {
								const group = rows[key];

								return (
									<Fragment key={`${group.key}`}>
										<tr>
											<td colSpan="7" className="query-row">
												<Button
													onClick={() => this.toggleAcessionIsoforms(group.key)}
													className="button button--toggle-isoforms"
												>
													{!showAllIsoforms && openGroup !== group.key ? '+' : null}
													{showAllIsoforms || openGroup === group.key ? '- ' : null}
												</Button>
												Query:
												{group.input}
											</td>
											<td className="query-row">
												{group.rows[0] &&
													group.rows[0].variation &&
													group.rows[0].variation.dbSNPId}
											</td>
											<td colSpan="6" className="query-row">
												HGVSg: {group.rows[0] && group.rows[0].gene.hgvsg}
											</td>
										</tr>
										{group.rows.map((row, i) => {
											const { protein, gene, significances, variation } = row;

											if (!showAllIsoforms && !protein.canonical && openGroup !== group.key) {
												return null;
											}

											const proteinPosition =
												variation.begin === variation.end
													? variation.begin
													: `${variation.begin}-${variation.end}`;

											const geneLocation =
												gene.start === gene.end
													? `${gene.chromosome}:g.${gene.start}`
													: `${gene.chromosome}:${gene.start}-${gene.end}`;

											const rowKey = `${group.key}-${i}`;

											let detailsPageLink = null;

											if (variation.begin && variation.variant) {
												const varSTRes = variation.variant
													.split('/')
													.join(variation.begin.toString());

												const detailsPageURL = `https://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/DisaStr/GetPage.pl?uniprot_acc=${protein.accession.toUpperCase()}&template=resreport.html&res=${varSTRes}`;
												detailsPageLink = (
													<a
														className="details-page-link"
														href={detailsPageURL}
														target="_blank"
														rel="noopener noreferrer"
													>
														View Details
													</a>
												);
											}
											const caddColour =
												significances.transcript[0].caddPhred <= 30 ? 'green' : 'red';

											let { accession } = protein;

											if (protein.canonical) {
												accession = protein.canonicalAccession;
											} else if (protein.isoform) {
												accession = protein.isoform;
											}

											counter += 1;

											const noSignificance = <span className="no-significances">-</span>;

											const transcriptSignificancesButton = this.getSignificancesButton(
												rowKey,
												row,
												'transcript',
												'button--transcript',
												'T'
											);

											const functionalSignificancesButton = this.getSignificancesButton(
												rowKey,
												row,
												'functional',
												'button--positional',
												'F'
											);

											const clinicalSignificancesButton = this.getSignificancesButton(
												rowKey,
												row,
												'clinical',
												'button--clinical',
												'C'
											);

											const structuralSignificancesButton = this.getSignificancesButton(
												rowKey,
												row,
												'structural',
												'button--structural',
												'S'
											);

											const genomicSignificancesButton = this.getSignificancesButton(
												rowKey,
												row,
												'genomic',
												'button--genomic',
												'G'
											);

											return (
												<Fragment key={`${rowKey}-${counter}`}>
													<tr key={rowKey}>
														<td className="fit">
															{significances.transcript &&
															significances.transcript[0].caddPhred ? (
																this.getCaddPrediction(significances.transcript[0])
															) : (
																<span
																	style={{
																		background: 'lightblue'
																	}}
																>
																	Loading...
																</span>
															)}
														</td>
														<td>{gene.symbol}</td>
														<td>
															{protein.length && proteinPosition ? (
																<Fragment>
																	<ProteinReviewStatus type={protein.type} />
																	{accession}
																</Fragment>
															) : (
																'-'
															)}
														</td>
														<td>{proteinPosition || '-'}</td>
														<td>
															<span title={variation.variant || '-'}>
																{variation.threeLetterCodes || '-'}
															</span>
														</td>
														<td>{geneLocation}</td>
														<td>{gene.allele}</td>
														<td>{group.rows[0] && group.rows[0].variation.dbSNPId}</td>
														<td className="fit">
															{significances.clinical ? (
																clinicalSignificancesButton
															) : (
																noSignificance
															)}
														</td>
														<td className="fit">
															{significances.genomic ? (
																genomicSignificancesButton
															) : (
																noSignificance
															)}
														</td>
														<td className="fit">
															{significances.transcript ? (
																transcriptSignificancesButton
															) : (
																noSignificance
															)}
														</td>
														<td className="fit">
															{significances.functional ? (
																functionalSignificancesButton
															) : (
																noSignificance
															)}
														</td>
														<td className="fit">
															{significances.structureEndpoint !== null ? (
																structuralSignificancesButton
															) : (
																noSignificance
															)}
														</td>
													</tr>

													{`${rowKey}:functional` === expandedRow ? (
														this.getFunctionalSignificance(
															significances.functional,
															variation,
															detailsPageLink
														)
													) : null}

													{`${rowKey}:clinical` === expandedRow ? (
														this.getClinicalSignificance(
															significances.clinical,
															variation,
															detailsPageLink
														)
													) : null}

													{`${rowKey}:transcript` === expandedRow ? (
														<ExpandedTranscriptSignificance
															data={significances.transcript}
															variation={variation}
															detailsLink={detailsPageLink}
														/>
													) : null}

													{`${rowKey}:structural` === expandedRow ? (
														this.getStructuralSignificance(
															significances.structural,
															detailsPageLink
														)
													) : null}

													{`${rowKey}:genomic` === expandedRow ? (
														<ExpandedGenomicSignificance
															data={significances.genomic}
															variation={variation}
															detailsLink={detailsPageLink}
															gene={gene}
														/>
													) : null}
												</Fragment>
											);
										})}
									</Fragment>
								);
							})}
						</tbody>
					</table>
				)}
				<span id="scrollTarget" />
				{loading ? (
					<table>
						<tbody>
							<tr className="loader-border">
								<td>
									<Loader />
								</td>
							</tr>
						</tbody>
					</table>
				) : (
					<span />
				)}

				{!nextPage ? (
					<table>
						<tbody>
							<tr className="loader-border">
								<td>
									<span>No more data to fetch</span>
								</td>
							</tr>
						</tbody>
					</table>
				) : (
					<span />
				)}
			</div>
		);
	}
}

ImpactSearchResults.propTypes = {
	rows: PropTypes.objectOf(
		PropTypes.shape({
			key: PropTypes.string,
			input: PropTypes.string,
			rows: PropTypes.arrayOf(
				PropTypes.shape({
					gene: PropTypes.shape({
						hgvsg: PropTypes.string
					}),
					variation: PropTypes.shape({
						dbSNPId: PropTypes.string
					}),
					map: PropTypes.func
				})
			),
			gene: PropTypes.shape({
				allele: PropTypes.string,
				chromosome: PropTypes.string,
				codons: PropTypes.string,
				end: PropTypes.number,
				ensgId: PropTypes.string,
				enstId: PropTypes.string,
				hgvsg: PropTypes.string,
				hgvsp: PropTypes.string,
				source: PropTypes.string,
				start: PropTypes.number,
				symbol: PropTypes.string
			}),
			protein: PropTypes.shape({
				accession: PropTypes.string,
				isoform: PropTypes.string,
				canonical: PropTypes.bool,
				canonicalAccession: PropTypes.string,
				end: PropTypes.number,
				length: PropTypes.number,
				name: PropTypes.shape({
					full: PropTypes.string,
					short: PropTypes.string
				}),
				start: PropTypes.number,
				threeLetterCodes: PropTypes.string,
				variant: PropTypes.string,
				enspId: PropTypes.string
			}),
			significances: PropTypes.shape({})
		})
	),
	handleDownload: PropTypes.func.isRequired
};

ImpactSearchResults.defaultProps = {
	rows: {}
};

export default ImpactSearchResults;
