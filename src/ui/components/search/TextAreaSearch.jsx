import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';
import PapaParse from 'papaparse';
import AboutSection from '../other/AboutSection';
import ExampleSection from '../other/ExampleSection';
import { ButtonModal } from 'franklin-sites';

const NO_OF_ITEMS_PER_PAGE = 25;

class TextAreaSearch extends Component {
	state = {
		searchTerm: '',
		isFileSelected: false,
		fileName: 'No file selected',
		viewResultLabel: 'View Result',
		downloadLabel: 'Download Result',
		file: {}
	};

	componentWillMount() {
		this.useExampleData();
	}

	handleInputChange = (e) => {
		this.setState({
			searchTerm: e.target.value
		});
	};

	handleSubmit = (e) => {
		const { searchTerm, file, page } = this.state;

		var fetchResult = this.props.fetchResult;
		var noOfLines = searchTerm.split('\n').length;
		var pages = Math.ceil(noOfLines / NO_OF_ITEMS_PER_PAGE);
		var newPage = {
			currentPage: 1,
			nextPage: true,
			previousPage: false,
			totalItems: noOfLines,
			itemsPerPage: NO_OF_ITEMS_PER_PAGE
		};
		this.setState({
			viewResultLabel: 'Loading..',
			page: newPage
		});
		e.preventDefault();
		e.stopPropagation();
		var inputArr = searchTerm.split('\n');
		fetchResult(null, newPage, false, false, inputArr);

		// onSubmit(searchTerm, null, newPage, true);
	};

	viewResult(event) {
		var file = event.target.files[0];
		var noOfLines = 0;
		PapaParse.parse(file, {
			step: (row, parser) => {
				noOfLines = noOfLines + 1;
			},
			complete: () => {
				console.log('lines 2=>' + noOfLines);
				var pages = Math.ceil(noOfLines / NO_OF_ITEMS_PER_PAGE);
				var fetchResult = this.props.fetchResult;
				var page = {
					currentPage: 1,
					nextPage: true,
					previousPage: false,
					totalItems: noOfLines,
					itemsPerPage: NO_OF_ITEMS_PER_PAGE
				};
				this.setState({
					isFileSelected: true
				});
				fetchResult(file, page, true, false, null);
			}
		});
	}

	clearForm = () => {
		this.setState({
			searchTerm: ''
		});
	};

	useExampleData = () => {
		const searchTerm = [
			'21 25891796 rs124582 C/T . . .'
			// '14 89993420 rs37915333 A/G . . .',
			// '10 87933147 rs7565837 C/T . . .',
			// '21 43072000 . T/C . . .',
			// '1 45340254 rs36765457 T/G . . .',
			// '21 43060540 43060540 C/T . . .',
			// '22 19479862 19479862 T/C . . .',
			// '22 19494512 19494512 C/G . . .',
			// '20 58909365 58909365 C/A . . .',
			// '3 165830358 165830358 T/C . . .',
			// '14 73173644 73173644 G/A'
			// '21 25891784 25891784 C/T'
			// '21 25891784 25891784 C/G',
			// '21 25891784 25891784 C/A',
			// '14 73173571 73173571 A/G',
			// '14 73173574 73173574 C/T',
			// '14 73173577 73173577 C/T',
			// '14 73173577 73173577 C/G',
			// '14 73173587 73173587 A/T',
			// '14 73173587 73173587 A/C',
			// '14 73173644 73173644 G/C'
			// '14 73173644 73173644 G/A',
			// '14 73173665 73173665 G/T',
			// '14 73173665 73173665 G/C',
			// '14 73173665 73173665 G/A',
		].join('\n');

		this.setState({
			searchTerm
		});
	};

	handleFiles = (files) => {
		console.log('File', files);
		if (window.FileReader) {
			// FileReader are supported.
			this.getAsText(files[0]);
		}
	};

	populateVCF = () => {
		let vcfInput =
			'19 1010539 rs124582 G/C . . .\n14 89993420 rs37915333 A/G . . .\n10 87933147 rs7565837 C/T . . .';

		this.setState({
			searchTerm: vcfInput
		});
	};

	populateHGVS = () => {
		let hgvsInput = 'NC_000010.11:g.121593810C>G\nNC_000010.11:g.121479868C>G\nNC_000010.11:g.121479900C>A';

		this.setState({
			searchTerm: hgvsInput
		});
	};

	openDocumentation = () => {
		const url = 'http://wwwdev.ebi.ac.uk/uniprot/api/pepvep/swagger-ui/#/';
		window.open(url, '_blank');
	};

	getAsText(fileToRead) {
		var reader = new FileReader();
		// Read file into memory as UTF-8
		reader.readAsText(fileToRead);
		// Handle errors load
		reader.onload = this.fileReadingFinished;
		reader.onerror = this.errorHandler;
	}

	render() {
		const { searchTerm, isFileSelected, fileName, viewResultLabel, downloadLabel } = this.state;
		const { buttonLabel, isLoading } = this.props;
		return (
			<Fragment>
				<div>
					<p>
						PepVEP is an online service to interpret the{' '}
						<b>effects of variants on protein function and structure</b>. It utilises functional information
						from the Ensembl Variant Effect Predictor (VEP), the UniProt functional residue annotation
						(Protein function), and the PDBe structural residue annotation.
					</p>
				</div>
				<div className="wrapper">
					<div id="search" className="card-table">
						<div className="card">
							<section className="card__actions">
								<span className="card-header">
									<p>
										<b>Search</b>
									</p>
								</span>
							</section>
							<section className="card--has-hover top-row" role="button">
								<div className="card__content">
									<section className="uniprot-card">
										<section className="uniprot-card__left">
											<form onSubmit={this.handleSubmit}>
												<textarea
													id="main-textarea-search-field"
													className="main-textarea-search-field"
													value={searchTerm}
													onChange={this.handleInputChange}
												/>

												<table className="table-input">
													<tbody>
														<tr>
															<td>
																<b>Examples:</b>
															</td>
															<td>
																<a onClick={this.populateVCF}>VCF</a>
															</td>
															<td>
																<a onClick={this.populateHGVS}>HGVS</a>
															</td>
														</tr>
													</tbody>
												</table>
												<span className="genome-assembly-text">
													<p>
														Reference Genome Assembly GRCh38 (hg38): {'     '}
														<a
															href="http://www.ensembl.org/Homo_sapiens/Tools/AssemblyConverter?db=core"
															target="_blank"
															rel="noopener noreferrer"
															className="ref-link"
														>
															Ensembl's Assembly Remapping
														</a>
													</p>
												</span>

												<div id="search-button-group" className="search-button-group">
													{!isLoading ? (
														<Button
															type="submit"
															onClick={this.handleSubmit}
															className="button-primary button-bottom"
														>
															{buttonLabel}
														</Button>
													) : (
														<Button
															onClick={() => null}
															className="button-primary button-bottom"
														>
															Loading...
														</Button>
													)}
												</div>
											</form>
										</section>
									</section>
								</div>
							</section>
						</div>
					</div>
					<div id="download" className="card-table">
						<div className="card">
							<section className="card__actions">
								<span className="card-header">
									<p>
										<b>Upload VCF</b>
									</p>
								</span>
							</section>
							<section className="card--has-hover" role="button">
								<div className="card__content">
									<section className="uniprot-card">
										<section className="uniprot-card__left">
											<p>
												<b>Upload a VCF FILE to view or download result</b>
												<br />
												<br />
												<b>VCF FILE Format</b>
												<br />
												#CHROM POS ID REF ALT QUAL FILTER INFO<br />
												21 25891796 rs124582 C T . . . <br />
												14 73173574 . C T . . . <br />
												15 19965080 . C G . . . <br />
											</p>

											<div id="search-button-group" className="search-button-group">
												<input
													id="myInput"
													type="file"
													style={{ display: 'none' }}
													ref={(ref) => (this.upload = ref)}
													onChange={this.viewResult.bind(this)}
												/>
												{!isFileSelected ? (
													<Button
														onClick={() => {
															this.upload.click();
														}}
														className="button-primary button-bottom"
													>
														Upload File
													</Button>
												) : (
													<Button
														onClick={() => {
															this.upload.click();
														}}
														className="button-primary button-bottom"
													>
														Loading...
													</Button>
												)}
											</div>
										</section>
									</section>
								</div>
							</section>
						</div>
					</div>
					<div id="download" className="card-table">
						<div className="card">
							<section className="card__actions">
								<span className="card-header">
									<p>
										<b>PepVEP REST API</b>
									</p>
								</span>
							</section>
							<section className="card--has-hover" role="button">
								<div className="card__content">
									<section className="uniprot-card">
										<section className="uniprot-card__left">
											<b>Programmatic access using multiple input formats like</b>

											<ul>
												<li>DbSNP</li>
												<li>HGVS</li>
												<li>Accession</li>
												<li>Gene Name</li>
												<li>Genomic location</li>
											</ul>
											<div id="search-button-group" className="search-button-group">
												<Button
													onClick={() =>
														window.open(
															'http://wwwdev.ebi.ac.uk/uniprot/api/pepvep/swagger-ui/#/',
															'_blank'
														)}
													className="button-bottom"
												>
													PepVEP REST API
												</Button>
											</div>
										</section>
									</section>
								</div>
							</section>
						</div>
					</div>
				</div>
				<div>
					<br />
				</div>
			</Fragment>
		);
	}
}

TextAreaSearch.propTypes = {
	buttonLabel: PropTypes.string,
	onSubmit: PropTypes.func,
	isLoading: PropTypes.bool.isRequired
};

TextAreaSearch.defaultProps = {
	buttonLabel: 'Search',
	onSubmit: () => undefined
};

export default TextAreaSearch;
