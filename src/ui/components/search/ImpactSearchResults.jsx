import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '../../elements/form/Button';
import ProteinReviewStatus from '../other/ProteinReviewStatus';
import { Loader } from 'franklin-sites';
import axios, { post } from 'axios';
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import DownloadModal from '../modal/DownloadModal';
import { Redirect } from 'react-router';
import ProteinIcon from '../../../icons/proteins.svg';
import StructureIcon from '../../../icons/structures-3d.svg';
import PopulationIcon from '../../../icons/human.svg';
import InvalidTableRows from './InvalidTableRows';
import { API_URL } from '../../../constants/const';
import StructuralDetail from '../structure/StructuralDetail';
import { getCaddCss, getTitle } from '../mapping/CaddHelper'
import PopulationDetail from '../population/PopulationDetail'
import FunctionalDetail from '../function/FunctionalDetail'

class ImpactSearchResults extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			expandedRow: null,
			openGroup: null,
			caddLoaded: false,
			showLoader: false,
			structureLoaded: false,
			functionLoaded: false,
			buttonText: '',
			title: '',
			pdbId: '',
			alphaFoldStructureId: '',
		};
	}

	componentDidUnMount() {
		window.onbeforeunload = function () {
			this.onUnload();
			return <Redirect to="/home" />;
		}.bind(this);
	}

	getSignificancesButton(rowKey, buttonLabel, accession) {
		if (!accession.canonical) return <td />;
		const { expandedRow } = this.state;
		let buttonCss = 'button--significances  button-new';
		let columnCss = 'fit';
		if (rowKey === expandedRow) {
			buttonCss = 'button--significances-clicked  button-new';
			columnCss = 'fit-clicked';
		}
		var buttonTag = <img src={ProteinIcon} className="button-icon" alt="protein icon" />; //<ProteinIcon className="button-icon" />;
		if (buttonLabel === 'POP') buttonTag = <img src={PopulationIcon} className="button-icon" alt="population icon" />;
		else if (buttonLabel === 'STR') buttonTag = <img src={StructureIcon} className="button-icon" alt="structure icon" />;
		return (
			<td className={columnCss}>
				<button
					onClick={() => this.toggleSignificanceRow(rowKey, buttonLabel, accession)}
					className={buttonCss}
				>
					<b>{buttonTag}</b>
				</button>
			</td>
		);
	}

	getProteinStructure(key, expandedRow, accession) {
		if (key === expandedRow) {
			return <StructuralDetail isoFormAccession={accession.isoform} aaPosition={accession.aaPos} />
		}
	}

	getPopulationObservation(key, expandedRow, accession) {
		if (key === expandedRow) {
			// if (this.state.variationLoaded) {
			//return <PopulationObservation data={accession.variation} altAA={accession.variantAA} />;
			return <PopulationDetail populationObservationsUri={accession.populationObservationsUri} variantAA={accession.variantAA} />;
			// } else {
			// return this.getLoader();
			// }
		}
	}

	getFunctionalSignificance(functionalKey, expandedRow, accession) {
		if (functionalKey === expandedRow) {
			return (
				// <FunctionalSignificance
				// 	refAA={accession.refAA}
				// 	variantAA={accession.variantAA}
				// 	data={accession.functional}
				// 	ensg={accession.ensg}
				// 	ensp={accession.ensp}
				// />
				<FunctionalDetail
					refAA={accession.refAA}
					variantAA={accession.variantAA}
					data={accession.functional}
					ensg={accession.ensg}
					ensp={accession.ensp}
					referenceFunctionUri={accession.referenceFunctionUri}
				/>
			);
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

	toggleAcessionIsoforms = (group) => {
		const { openGroup } = this.state;

		this.setState({
			openGroup: openGroup === group ? null : group
		});
	};

	toggleSignificanceRow(rowId, significanceType, row) {
		const { expandedRow } = this.state;
		const rowIdAndType = rowId;
		this.setState({ expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null });

		// if (significanceType === 'FUN') {
		// 	this.fetchFunctionalFeatures(row, rowIdAndType, expandedRow);
		// }
		// if (significanceType === 'STR') {
		// 	this.setState({ expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null });
		// }
		// if (significanceType === 'POP') {
		// 	// this.fetchVariationData(row, rowIdAndType, expandedRow);
		// 	this.setState({ expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null });
		// } else {
		// 	this.setState({
		// 		expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null
		// 	});
		// }
	}

	fetchVariationData = (row, rowIdAndType, expandedRow) => {
		const APIUrl = `${API_URL}` + row.populationObservationsUri;
		if (row.variationLoaded === false) {
			this.setState({
				variationLoaded: false,
				expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null
			});
			axios.get(APIUrl).then((response) => {
				row.variation = response.data;
				row.variationLoaded = true;
				this.setState({
					variationLoaded: true,
					showLoader: false
				});
			});
		} else {
			this.setState({
				expandedRow: rowIdAndType !== expandedRow ? rowIdAndType : null
			});
		}
	};

	fetchNextPage = (next) => {
		var fetchNextPage = this.props.fetchNextPage;
		var page = this.props.page;
		if (next === 1) {
			page.currentPage = page.currentPage + 1;
		} else {
			page.currentPage = page.currentPage - 1;
		}
		this.setState({
			loading: true,
			caddLoaded: false
		});
		let isFileselected = false;
		if (this.props.file !== null) isFileselected = true;
		fetchNextPage(this.props.file, page, isFileselected, true);
	};

	bulkDownload = (event) => {
		var handleBulkDownload = this.props.handleBulkDownload;
		handleBulkDownload(event, this.props.file);
	};
	getColumnData(data, canonical, canonicalAccession) {
		if (canonical) return data;
		if (canonicalAccession === null || canonicalAccession === undefined) return data;
		return '';
	}
	getRow = (accession, openGroup) => {
		let caddCss = getCaddCss(accession.CADD);
		let caddTitle = getTitle(accession.CADD);
		let strand = '(+)';
		if (accession.strand === true) strand = '(-)';
		if (accession.codon === undefined || accession.codon === null) {
			strand = '';
		}
		let proteinName = accession.proteinName;
		let proteinType = 'TrEMBL';
		const { expandedRow } = this.state;
		if (accession.canonical) proteinType = 'Swiss-Prot';
		if (accession.isoform === undefined) proteinType = '';
		if (accession.proteinName !== undefined && accession.proteinName.length > 20) {
			proteinName = accession.proteinName.substring(0, 20) + '..';
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

		return (
			<Fragment key={`${accession.isoform}-${accession.position}-${accession.altAllele}`}>
				<tr>
					<td>
						<a href={chromosomeUrl} target="_blank" rel="noopener noreferrer">
							{accession.chromosome}
						</a>
					</td>
					<td>
						<a href={positionUrl} target="_blank" rel="noopener noreferrer">
							{this.getColumnData(accession.position, accession.canonical, accession.canonicalAccession)}
						</a>
					</td>
					<td>{accession.id}</td>
					<td>{accession.refAllele}</td>
					<td>
						{this.getColumnData(accession.altAllele, accession.canonical, accession.canonicalAccession)}
					</td>
					<td>
						<a href={geneUrl} target="_blank" rel="noopener noreferrer">
							{accession.geneName}
						</a>
					</td>
					<td>
						{accession.codon} {strand}
					</td>
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
					{/* {this.getSignificancesButton(evolutionKey, 'EVI', accession)} */}
				</tr>

				{/* {this.getEvolutionInferenceSignificance(evolutionKey, expandedRow, accession)} */}
				{this.getPopulationObservation(populationKey, expandedRow, accession)}
				{this.getProteinStructure(structuralKey, expandedRow, accession)}
				{this.getFunctionalSignificance(functionalKey, expandedRow, accession)}
			</Fragment>
		);
	};

	getTableRows = (rows) => {
		const { openGroup } = this.state;
		let tableRows = [];
		rows.forEach((genes) => {
			genes.forEach((accessions) => {
				accessions.forEach((accession) => {
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

	fetchFunctionalFeatures(row, rowIdAndType, expandedRow) {
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
	}

	fileUpload(file) {
		// const BASE_URL = 'http://localhost:8091/uniprot/api/pepvep/download/upload';
		const BASE_URL = 'http://wwwdev.ebi.ac.uk/uniprot/api/pepvep/download/upload';
		const formData = new FormData();
		formData.append('file', file);
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		};
		return post(BASE_URL, formData, config);
	}

	getInvalidInputSection(invalidInputs) {
		if (invalidInputs !== undefined && invalidInputs !== null && invalidInputs.length > 0) {
			return (
				<div className="alert alert-danger alert-dismissible fade show">
					Few of inputs are not valid
				</div>
			);
		}
	}

	changePageSize(pageSize) {
		var fetchNextPage = this.props.fetchNextPage;
		var page = this.props.page;
		if (pageSize !== page.itemsPerPage) {
			page.itemsPerPage = pageSize.value;
			page.currentPage = 1;

			this.setState({
				loading: true,
				caddLoaded: false
			});
			let isFileselected = false;
			if (this.props.file !== null) isFileselected = true;
			fetchNextPage(this.props.file, page, isFileselected, true);
		}
	}

	render() {
		// const { rows, handleDownload } = this.props;

		const rows = this.props.rows;
		const tableRows = this.getTableRows(rows);
		const page = this.props.page;
		const totalPages = Math.ceil(page.totalItems / page.itemsPerPage);
		const invalidInputs = this.props.invalidInputs;
		const file = this.props.file;
		const searchTerm = this.props.searchTerm;
		let totalItems = 0;
		if (file != null) {
			totalItems = page.totalItems;
		} else {
			totalItems = searchTerm.length;
		}
		return (
			<div
				className="search-results"
				id="divRoot"
				ref={(node) => {
					this.node = node;
				}}
			>
				{this.getInvalidInputSection(invalidInputs)}

				<table className="table-header">
					<tbody>
						<tr>
							<td colSpan="1">
								<DownloadModal searchTerm={searchTerm} file={file} totalItems={totalItems} />
							</td>

							<td colSpan="1">
								{page === undefined || page.currentPage === 1 ? (
									<Button onClick={() => null} className="button-new button-disabled">
										&laquo; Previous
									</Button>
								) : (
									<Button onClick={() => this.fetchNextPage(0)}>&laquo; Previous</Button>
								)}
							</td>
							<td colSpan="1">
								{page.currentPage} of {totalPages}
							</td>
							<td colSpan="1">
								{page === undefined || !page.nextPage ? (
									<Button onClick={() => null} className="button-new button-disabled">
										Next &raquo;
									</Button>
								) : (
									<Button onClick={() => this.fetchNextPage(1)}>Next &raquo;</Button>
								)}
							</td>
							<td colSpan="1">
								<Dropdown
									placeholder="Pages"
									options={[25, 50, 100]}
									value={page.itemsPerPage}
									onChange={(value) => this.changePageSize(value)}
								/>
							</td>
						</tr>
					</tbody>
				</table>
				<table border="0" className="unstriped" cellPadding="0" cellSpacing="0">
					<thead>
						<tr>
							<th colSpan="5">Input</th>
							<th colSpan="3">Genomic</th>
							<th colSpan="6">Protein</th>
							<th colSpan="5">Annotations</th>
						</tr>
						<tr>
							<th>CHR</th>
							<th>Coordinate</th>
							<th>ID</th>
							<th>Ref</th>
							<th>Alt</th>
							<th>Gene</th>
							<th>Codon (Strand)</th>
							<th>CADD</th>
							<th>show alt. isoforms</th>
							<th>Isoform</th>
							<th>ProteinName</th>
							<th>AA Pos</th>
							<th>AA Change</th>
							<th>Consequences</th>
							<th>Functional</th>
							<th>Population Observation</th>
							<th>Structural</th>
							{/* <th>Evolution Inference</th> */}
						</tr>
					</thead>
					<tbody>
						{tableRows}
						<InvalidTableRows invalidInputs={this.props.invalidInputs} />
					</tbody>
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
