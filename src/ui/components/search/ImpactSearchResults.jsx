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
import { Loader, ButtonModal, SearchInput, InPageNav } from 'franklin-sites';
import axios, { post } from 'axios';
import FunctionalSignificance from '../categories/FunctionalSignificance';
import Modal from '../modal/Modal';

class ImpactSearchResults extends Component {
	state = {
		expandedRow: null,
		openGroup: null,
		caddLoaded: false,
		showLoader: false,
		modal: false,
		name: '',
		email: '',
		jobName: '',
		jobSubmitted: false,
		structureLoaded: false,
		functionLoaded: false,
		function: false,
		variation: false,
		buttonText: '',
		title: ''
	};

	getSignificancesButton(rowKey, buttonTag, accession) {
		const { expandedRow } = this.state;
		let buttonCss = 'button--significances  button-new';
		let columnCss = 'fit';
		if (rowKey === expandedRow) {
			buttonCss = 'button--significances-clicked  button-new';
			columnCss = 'fit-clicked';
		}

		return (
			<td className={columnCss}>
				<button onClick={() => this.toggleSignificanceRow(rowKey, buttonTag, accession)} className={buttonCss}>
					<b>{buttonTag}</b>
				</button>
			</td>
		);
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
	}

	updateCADDPrediction(inputArr) {
		console.log('CADD Prediction called ' + inputArr);
		const headers = {
			'Content-Type': 'application/json'
		};

		var errorFlag = false;
		const BASE_URL = 'http://localhost:8091/uniprot/api/pepvep/variant/prediction';
		// const BASE_URL = 'http://wwwdev.ebi.ac.uk/uniprot/api/pepvep/variant/prediction/';
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
					this.setState({
						caddLoaded: true
					});
				} else {
					response.data.forEach((data) => {
						var variantRows = this.props.rows;
						variantRows.map((genes, geneId) => {
							genes.map((accessions, accessionId) => {
								accessions.map((accession, index) => {
									if (
										(accession.canonical || accession.canonicalAccession === null) &&
										accession.chromosome === data.chromosome &&
										accession.position === data.position &&
										accession.altAllele === data.altAllele &&
										data.score !== 0
									) {
										accession.CADD = data.score;
									}
								});
							});
						});
					});
					this.setState({
						caddLoaded: true
					});
				}
			});
	}
	componentDidUpdate() {
		if (this.state.caddLoaded !== true) {
			let inputArr = this.props.searchTerm;
			if (inputArr.length > 0) {
				this.updateCADDPrediction(inputArr);
			}
		}
	}
	componentDidMount() {
		if (this.state.caddLoaded !== true) {
			let inputArr = this.props.searchTerm;
			if (inputArr.length > 0) {
				this.updateCADDPrediction(inputArr);
			}
		}
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

	getFunctionalSignificance(functionalKey, expandedRow, accession) {
		if (functionalKey === expandedRow) {
			if (this.state.functionLoaded) {
				return (
					<FunctionalSignificance
						data={accession.functional}
						ensg={accession.ensg}
						ensp={accession.ensp}
						enst={accession.enst}
					/>
				);
			} else {
				return this.getLoader();
			}
		}
	}

	getLoader() {
		return (
			<tr className="loader-border ">
				<td colSpan="20">
					<Loader />
				</td>
			</tr>
		);
	}

	getExperimentalSignificance(experimentalKey, expandedRow, accession) {
		if (experimentalKey === expandedRow) {
			return (
				<tr>
					<td colspan="19" className="expanded-row">
						<div className="significances-groups">
							<div className="column">
								<b>Experimental Protein Level Impact</b>

								<section>
									Colocated Domains/Sites<br />
									Variant Details<br />
									Colocated Molecule Processing<br />
									Domain Sites details here
								</section>
							</div>
						</div>
					</td>
				</tr>
			);
		}
	}

	getEvolutionInferenceSignificance(evolutionKey, expandedRow, accession) {
		if (evolutionKey === expandedRow) {
			return (
				<tr>
					<td colspan="19" className="expanded-row">
						<div className="significances-groups">
							<div className="column">
								<b>Evolution Inference</b>

								<section>
									Evolution Inference<br />
									Variant Details<br />
									Colocated Molecule Processing<br />
									Domain Sites details here
								</section>
							</div>
						</div>
					</td>
				</tr>
			);
		}
	}

	getPopulationObservationSignificance(popObservationKey, expandedRow, accession) {
		if (popObservationKey === expandedRow) {
			return (
				<tr>
					<td colspan="19" className="expanded-row">
						<div className="significances-groups">
							<div className="column">
								<b>Population Observation</b>

								<section>
									Population Observation<br />
									Variant Details<br />
									Colocated Molecule Processing<br />
									Domain Sites details here
								</section>
							</div>
						</div>
					</td>
				</tr>
			);
		}
	}

	getStructuralSignificance(structuralKey, expandedRow, accession) {
		if (structuralKey === expandedRow) {
			return (
				<tr>
					<td colspan="19" className="expanded-row">
						<div className="significances-groups">
							<div className="column">
								<b>Structural Significance</b>

								<section>
									Structural Observation<br />
									Variant Details<br />
									Colocated Molecule Processing<br />
									Domain Sites details here
								</section>
							</div>
						</div>
					</td>
				</tr>
			);
		}
	}

	toggleAcessionIsoforms = (group) => {
		const { openGroup } = this.state;

		this.setState({
			openGroup: openGroup === group ? null : group
		});
	};

	toggleSignificanceRow(rowId, significanceType, row) {
		const { expandedRow } = this.state;
		const rowIdAndType = rowId;

		if (significanceType === 'FUN') {
			const APIUrl = `${API_URL}` + row.referenceFunctionUri;
			if (row.functionLoaded === false) {
				this.setState({
					functionLoaded: false,
					expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null
				});
				axios.get(APIUrl).then((response) => {
					row.functional = response.data;
					row.functionLoaded = true;
					this.setState({
						functionLoaded: true,
						showLoader: false
					});
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

	getRow = (accession, openGroup) => {
		let caddColour = '';
		let caddCss = '';
		let caddTitle = '';
		let proteinName = accession.proteinName;
		let proteinType = 'TrEMBL';
		const { expandedRow } = this.state;
		if (accession.canonical) proteinType = 'Swiss-Prot';
		if (accession.isoform === undefined) proteinType = '';
		if (accession.proteinName !== undefined && accession.proteinName.length > 20) {
			proteinName = accession.proteinName.substring(0, 25) + '...';
		}
		if (accession.CADD === undefined || accession.CADD === '-') {
			caddCss = '';
		} else {
			if (accession.CADD <= 30) {
				caddColour = 'green';
				caddTitle = 'Likely Benign';
			} else {
				caddColour = 'red';
				caddTitle = 'Likely Deleterious';
			}
			caddCss = `label warning cadd-score cadd-score--${caddColour}`;
		}

		const chromosomeUrl = 'https://www.ensembl.org/Homo_sapiens/Location/Chromosome?r=' + accession.chromosome;
		const positionUrl =
			'https://www.ensembl.org/Homo_sapiens/Location/View?r=' +
			accession.chromosome +
			':' +
			accession.position +
			'-' +
			accession.position;
		const geneUrl = 'https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=' + accession.geneName;
		const accessionUrl = 'https://www.uniprot.org/uniprot/' + accession.isoform;
		const caddUrl = 'https://cadd.gs.washington.edu/info';
		const toggleOpenGroup = accession.canonicalAccession + '-' + accession.position + '-' + accession.altAllele;
		const expandedGroup = accession.isoform + '-' + accession.position + '-' + accession.altAllele;
		const functionalKey = 'functional-' + expandedGroup;

		const structuralKey = 'structural-' + expandedGroup;
		const populationKey = 'population-' + expandedGroup;
		const evolutionKey = 'evolution-' + expandedGroup;

		const noSignificance = <span className="no-significances">-</span>;

		return (
			<Fragment>
				<tr key={`${accession.isoform}-${accession.position}-${accession.altAllele}`}>
					<td>
						<a href={chromosomeUrl} target="_blank" rel="noopener noreferrer">
							{accession.chromosome}
						</a>
					</td>
					<td>
						<a href={positionUrl} target="_blank" rel="noopener noreferrer">
							{accession.position}
						</a>
					</td>
					<td>{accession.id}</td>
					<td>{accession.refAllele}</td>
					<td>{accession.altAllele}</td>
					<td>
						<a href={geneUrl} target="_blank" rel="noopener noreferrer">
							{accession.geneName}
						</a>
					</td>
					<td>{accession.codon}</td>
					<td>
						<span className={caddCss} title={caddTitle}>
							<a href={caddUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
								{accession.CADD}
							</a>
						</span>
					</td>
					{accession.canonical ? (
						<td>
							<Button
								onClick={() => this.toggleAcessionIsoforms(toggleOpenGroup)}
								className="button button--toggle-isoforms"
							>
								{openGroup !== toggleOpenGroup ? '+' : null}
								{openGroup === toggleOpenGroup ? '- ' : null}
							</Button>
						</td>
					) : (
						<td />
					)}

					<td>
						<ProteinReviewStatus type={proteinType} />
						<a href={accessionUrl} target="_blank" rel="noopener noreferrer">
							{accession.isoform}
						</a>
					</td>
					<td>
						<span title={accession.proteinName}>{proteinName}</span>
					</td>
					<td>{accession.aaPos}</td>
					<td>{accession.aaChange}</td>
					<td>{accession.consequences}</td>
					{this.getSignificancesButton(functionalKey, 'FUN', accession)}
					{this.getSignificancesButton(populationKey, 'POP', accession)}
					{this.getSignificancesButton(structuralKey, 'STR', accession)}
					{this.getSignificancesButton(evolutionKey, 'EVI', accession)}
				</tr>

				{this.getEvolutionInferenceSignificance(evolutionKey, expandedRow, accession)}
				{this.getPopulationObservationSignificance(populationKey, expandedRow, accession)}
				{this.getStructuralSignificance(structuralKey, expandedRow, accession)}
				{this.getFunctionalSignificance(functionalKey, expandedRow, accession)}
			</Fragment>
		);
	};

	getTableRows = (rows) => {
		const { openGroup } = this.state;
		let tableRows = [];
		rows.map((genes, geneId) => {
			genes.map((accessions, accessionId) => {
				accessions.map((accession, index) => {
					let currentGroup =
						accession.canonicalAccession + '-' + accession.position + '-' + accession.altAllele;
					if (currentGroup === openGroup) {
						let row = this.getRow(accession, openGroup);
						tableRows.push(row);
					} else if (accession.canonical || accession.canonicalAccession === null) {
						let row = this.getRow(accession, openGroup);
						tableRows.push(row);
					}
				});
			});
		});
		return tableRows;
	};

	handleChange = (e) => {
		console.log('inside handle change');
		const target = e.target;
		const name = target.name;
		const value = target.value;

		this.setState({
			[name]: value
		});
	};

	handleCheckBox = (e) => {
		console.log('inside handle change');
		const target = e.target;
		const name = target.name;
		const value = target.checked;
		this.setState({
			[name]: value
		});
	};

	handleSubmit = (e) => {
		console.log('inside handle submit');
		const inputArr = this.props.searchTerm;
		this.setState({ name: this.state.modalInputName });
		console.log(this.state.email);
		console.log(this.state.name);
		console.log(this.state.jobName);
		console.log(this.state.function);
		console.log(this.state.variation);
		const headers = {
			'Content-Type': 'application/json',
			Accept: '*'
		};
		const APIUrl =
			`${API_URL}` +
			'/download?email=' +
			this.state.email +
			'&name=' +
			this.state.name +
			'&jobName=' +
			this.state.jobName +
			'&function=' +
			this.state.function +
			'&variation=' +
			this.state.variation;

		this.modalClose();

		post(APIUrl, inputArr, {
			headers: headers
		}).then((response) => {
			console.log('response -> ' + response.data);
			response.data.forEach((mapping) => {
				var genes = this.createGenes(mapping);
				mappings.push(genes);
			});
		});
	};

	modalOpen = () => {
		this.setState({ modal: true });
	};

	handleClick = () => {
		if (!this.state.modal) {
			document.addEventListener('click', this.handleOutsideClick, false);
		} else {
			document.removeEventListener('click', this.handleOutsideClick, false);
		}

		this.setState((prevState) => ({
			modal: !prevState.modal
		}));
	};

	modalClose() {
		this.setState({
			modal: false
		});
	}

	handleOutsideClick = (e) => {
		if (!this.node.contains(e.target)) this.handleClick();
	};

	render() {
		// const { rows, handleDownload } = this.props;

		const rows = this.props.rows;
		const tableRows = this.getTableRows(rows);

		return (
			<div
				className="search-results"
				id="divRoot"
				ref={(node) => {
					this.node = node;
				}}
			>
				<Button onClick={(e) => this.handleClick(e)}>Download</Button>
				<Modal show={this.state.modal} handleClose={(e) => this.handleClick(e)}>
					<h5>Enter Details</h5>
					<div className="form-group">
						<div>
							<ul>
								<li key="function" className="new-select">
									<input
										key="function1"
										type="checkbox"
										name="function"
										value={this.state.function}
										onChange={(e) => this.handleCheckBox(e)}
										checked={this.state.function}
									/>
									<label id="item1">Reference Function</label>
								</li>
								<li key="variation" className="new-select">
									<input
										key="variation1"
										type="checkbox"
										value={this.state.variation}
										name="variation"
										onChange={(e) => this.handleCheckBox(e)}
										checked={this.state.variation}
									/>
									<label id="item2">Population Observation</label>
								</li>
							</ul>

							<label>
								Name:
								<input
									type="text"
									value={this.state.name}
									name="name"
									onChange={(e) => this.handleChange(e)}
								/>
							</label>
							<label>
								Email:
								<input
									type="text"
									value={this.state.email}
									name="email"
									onChange={(e) => this.handleChange(e)}
								/>
							</label>
							<label>
								Job Name:
								<input
									type="text"
									value={this.state.jobName}
									name="jobName"
									onChange={(e) => this.handleChange(e)}
								/>
							</label>
						</div>
					</div>

					<Button onClick={(e) => this.handleSubmit(e)} type="button">
						Save
					</Button>
					<Button onClick={(e) => this.handleClick(e)} type="button">
						close
					</Button>
				</Modal>
				<table border="0" className="unstriped" cellPadding="0" cellSpacing="0">
					<thead>
						<tr>
							<th colSpan="5">Input</th>
							<th colSpan="3">Genomic</th>
							<th colSpan="6">Protein</th>
							<th colSpan="5">Impact</th>
						</tr>
						<tr>
							<th>CHR</th>
							<th>Coordinate</th>
							<th>ID</th>
							<th>Ref</th>
							<th>Alt</th>
							<th>Gene</th>
							<th>Codon</th>
							<th>CADD</th>
							<th />
							<th>Isoform</th>
							<th>Name</th>
							<th>AA Pos</th>
							<th>AA Change</th>
							<th>Consequences</th>
							<th>Function</th>
							<th>Population Observation</th>
							<th>Structure</th>
							<th>Evolution Inference</th>
						</tr>
					</thead>
					<tbody>{tableRows}</tbody>
				</table>
			</div>
		);
	}
}

ImpactSearchResults.propTypes = {
	// rows: PropTypes.objectOf(
	// 	PropTypes.shape({
	// 		key: PropTypes.string,
	// 		input: PropTypes.string,
	// rows: PropTypes.arrayOf(
	// 	PropTypes.shape({
	// 		gene: PropTypes.shape({
	// 			hgvsg: PropTypes.string
	// 		}),
	// 		variation: PropTypes.shape({
	// 			dbSNPId: PropTypes.string
	// 		}),
	// 		map: PropTypes.func
	// 	})
	// ),
	// gene: PropTypes.shape({
	// 	allele: PropTypes.string,
	// 	chromosome: PropTypes.string,
	// 	codons: PropTypes.string,
	// 	end: PropTypes.number,
	// 	ensgId: PropTypes.string,
	// 	enstId: PropTypes.string,
	// 	hgvsg: PropTypes.string,
	// 	hgvsp: PropTypes.string,
	// 	source: PropTypes.string,
	// 	start: PropTypes.number,
	// 	symbol: PropTypes.string
	// }),
	// protein: PropTypes.shape({
	// 	accession: PropTypes.string,
	// 	isoform: PropTypes.string,
	// 	canonical: PropTypes.bool,
	// 	canonicalAccession: PropTypes.string,
	// 	end: PropTypes.number,
	// 	length: PropTypes.number,
	// 	name: PropTypes.shape({
	// 		full: PropTypes.string,
	// 		short: PropTypes.string
	// 	}),
	// 	start: PropTypes.number,
	// 	threeLetterCodes: PropTypes.string,
	// 	variant: PropTypes.string,
	// 	enspId: PropTypes.string
	// }),
	// 		significances: PropTypes.shape({})
	// 	})
	// ),
	handleDownload: PropTypes.func.isRequired
};

// ImpactSearchResults.defaultProps = {
// 	rows: {}
// };

export default ImpactSearchResults;
