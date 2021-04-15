import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';
import AboutSection from '../other/AboutSection';
import ExampleSection from '../other/ExampleSection';

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
		const { onSubmit } = this.props;
		var newPage = {
			currentPage: 1,
			nextPage: false,
			previousPage: false
		};
		this.setState({
			viewResultLabel: 'Loading..',
			page: newPage
		});
		e.preventDefault();
		e.stopPropagation();

		onSubmit(searchTerm, null, newPage, true);
	};

	clearForm = () => {
		this.setState({
			searchTerm: ''
		});
	};

	useExampleData = () => {
		const searchTerm = [
			'21 25891796 25891796 C/T . . .',
			'14 89993420 89993420 A/G . . .',
			'10 87933147 87933147 C/T . . .',
			'21 43072000 43072000 T/C . . .'
			// '21 43060540 43060540 C/T . . .',
			// '22 19479862 19479862 G/C . . .'
			//'22 19494512 19494512 C/G . . .',

			// '20 58909365 58909365 C/A . . .', ---issue
			//'3 165830358 165830358 T/C . . .',

			// '21 25891796 25891796 C/T',
			// '21 25891784 25891784 C/T',
			// '21 25891784 25891784 C/G',
			// '21 25891784 25891784 C/A',
			// '14 73173571 73173571 A/G',
			// '14 73173574 73173574 C/T',
			// '14 73173577 73173577 C/T',
			// '14 73173577 73173577 C/G',
			// '14 73173587 73173587 A/T',
			// '14 73173587 73173587 A/C',
			// '14 73173644 73173644 G/C',
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

	viewResult(event) {
		var file = event.target.files[0];
		var fetchNextPage = this.props.fetchNextPage;
		var page = {
			currentPage: 1,
			nextPage: true,
			previousPage: false
		};
		this.setState({
			isFileSelected: true
		});
		fetchNextPage(file, page, true, false);

		// this.onChangeFile(event);

		// const { searchTerm, file, page } = this.state;
		// this.onSubmit(inputText, file, page);
		// this.handleSubmit(event);
	}

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
												<span className="genome-assembly-text">
													Reference Genome Assembly GRCh38 (hg38): {'     '}
													<a
														href="http://www.ensembl.org/Homo_sapiens/Tools/AssemblyConverter?db=core"
														target="_blank"
														rel="noopener noreferrer"
														className="ref-link"
													>
														Ensembl's Assembly Remapping
													</a>
												</span>
												<div id="search-button-group" className="search-button-group">
													{!isLoading ? (
														<Button
															type="submit"
															onClick={this.handleSubmit}
															className="button-primary"
														>
															{buttonLabel}
														</Button>
													) : (
														<Button onClick={() => null} className="button-primary">
															Loading...
														</Button>
													)}

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
															className="button-primary"
														>
															Upload File
														</Button>
													) : (
														<Button
															onClick={() => {
																this.upload.click();
															}}
															className="button-primary"
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
					<div id="example" className="card-table">
						<ExampleSection />
					</div>
					<div id="about" className="card-table">
						<AboutSection />
					</div>
					<div id="download" className="card-table">
						<div className="card">
							<section className="card__actions">
								<span className="card-header">
									<p>
										<b>More Information</b>
									</p>
								</span>
							</section>
							<section className="card--has-hover" role="button">
								<div className="card__content">
									<section className="uniprot-card">
										<section className="uniprot-card__left">
											<span className="assemly-ref-note">
												<b>PepVEP is based upon the human Reference Genome Assembly GRch38</b>
											</span>
											<br />
											If your variants are referenced to GRCh37(hg19) you will need to remap your
											variants to the latest assembly. We recommend using: {' '}
											<a
												href="http://www.ensembl.org/Homo_sapiens/Tools/AssemblyConverter?db=core"
												target="_blank"
												rel="noopener noreferrer"
												className="ref-link"
											>
												Ensembl's Assembly Remapping
											</a>
											<br />
											<br />
											<span className="assemly-ref-note">
												<b>PepVEP REST API </b>
											</span>
											<form onSubmit={this.handleSubmit}>
												Programmatic access using multiple input formats like DbSNP, HGVS,
												Accession, Gene Name, Genomic location etc. Detailed documentation can
												be accessed using the link below.<br />
												<b>Documentation: </b>
												<a
													href="http://wwwdev.ebi.ac.uk/uniprot/api/pepvep/swagger-ui/#/"
													target="_blank"
													rel="noopener noreferrer"
													className="ref-link"
												>
													PepVEP REST API
												</a>
											</form>
										</section>
									</section>
								</div>
							</section>
						</div>
					</div>
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
