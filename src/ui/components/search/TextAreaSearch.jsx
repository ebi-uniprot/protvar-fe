import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';
import PapaParse from 'papaparse';
import About from '../categories/About';
import { v1 as uuidv1 } from 'uuid';
const NO_OF_ITEMS_PER_PAGE = 25;

class TextAreaSearch extends Component {
	state = {
		searchTerm: 'Paste variants in HGVS or VCF format below',
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
		if (searchTerm === '') {
			return;
		}
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
			// 'Paste variants in HGVS or VCF format below'
			// '21 25891796 rs124582 C/T . . .'
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
						PepVEP is an online service to interpret the effects of missense variants using protein function
						and structure. It utilises functional information from the Ensembl Variant Effect Predictor
						(VEP), the UniProt functional residue annotation (Protein function), and the PDBe structural
						residue annotation.
						<br />
					</p>
					<p className="info">
						Variants can be submitted via pasting in the box in VCF or HGVS format, uploading a file in VCF
						format or using the PepVEP API
					</p>
				</div>
				<div className="wrapper">
					<div id="search" className="card-table search">
						<div className="card">
							<section className="card__actions">
								<span className="card-header">
									<p>
										<b>Paste variants (GRCh38)</b>
									</p>
								</span>
							</section>
							<section className="card--has-hover top-row" role="button">
								<div className="card__content">
									<section className="uniprot-card">
										<section className="uniprot-card__left">
											{/* <p>
												<b>Paste variants in HGVS or VCF format below</b>
											</p> */}

											<textarea
												id="main-textarea-search-field"
												className="main-textarea-search-field"
												value={searchTerm}
												placeholder="Paste variants in HGVS or VCF format"
												onFocus={(e) => (e.target.placeholder = '')}
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
										</section>
									</section>
								</div>
							</section>
						</div>
					</div>
					<div id="upload" className="card-table upload">
						<div className="card">
							<section className="card__actions">
								<span className="card-header">
									<p>
										<b>File Upload</b>
									</p>
								</span>
							</section>
							<section className="card--has-hover" role="button">
								<div className="card__content">
									<section className="uniprot-card">
										<section className="uniprot-card__left">
											<p>
												<b>PepVEP will interpret only the first five fields of the VCF</b>
												<br />
												#CHROM POS ID REF ALT<br />
												Missing values should be specified with a dot (‘.’){' '}
												<a
													target="_blank"
													href="https://www.ebi.ac.uk/training/online/courses/human-genetic-variation-introduction/variant-identification-and-analysis/understanding-vcf-format/"
												>
													more info
												</a>
												<br />
												<br />
												<b>PepVEP also supports hgvs in below format</b>
												<br />
												NC_000010.11:g.121479868C>G<br />
												{/* SPDI - NC_000001.11:g.65567A>C<br /> */}
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
					<div id="api" className="card-table api">
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
											<b>
												PepVEP's REST API is a programmatic way to obtain information from
												PepVEP via Simple URL-based queries
											</b>
											<br />
											You can query:
											<ul>
												<li key={uuidv1()}>
													Whole genes/proteins/structures specific residue ranges in proteins
													or protein structures or{' '}
												</li>
												<li key={uuidv1()}>
													Genomic ranges in genes a list of variants using several different
													formats
												</li>
											</ul>
											Click below for all PepVEP REST API documentation
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
					<p className="info">
						Further help and explanations about the data in PepVEP can be found in the "about" section at
						the top right hand side of the page.
						<br />
						<br />
						We continually strive to make PepVEP clear and useful to our users, to contact PepVEP with
						questions or suggestions please use the "contact" link at the top of the page.
					</p>
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
	buttonLabel: 'Run',
	onSubmit: () => undefined
};

export default TextAreaSearch;
