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

		onSubmit(searchTerm, null, newPage, false);
	};

	clearForm = () => {
		this.setState({
			searchTerm: ''
		});
	};

	useExampleData = () => {
		const searchTerm = [
			'14 89993420 89993420 A/G . . .',
			'10 87933147 87933147 C/T . . .',
			'21 43072000 43072000 T/C . . .'
			//'21 43060540 43060540 C/T . . .',
			//'22 19479862 19479862 G/C . . .',
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
		fetchNextPage(file, page, true);

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

	onChangeFile(event) {
		event.stopPropagation();
		event.preventDefault();
		var file = event.target.files[0];
		const { onSubmit } = this.props;
		console.log(file);
		var text = '';
		var page = {
			currentPage: 1,
			nextPage: true,
			previousPage: false
		};
		this.setState({
			isFileSelected: true,
			fileName: file.name,
			file: file,
			page: page,
			isFileSelected: true
		});
		var reader = new FileReader();
		reader.onload = async (e) => {
			text = e.target.result;
			var inputText = '';
			var lines = text.split('\n');
			var firstLine = true;
			var count = 0;
			var breakLoop = false;
			for (let line of lines) {
				// lines.forEach((line) => {
				if (breakLoop) {
					break;
				}
				if (count >= 3) {
					breakLoop = true;
					console.log(inputText);
					this.setState({
						searchTerm: inputText
					});
					console.log('calling onsubmit');
					onSubmit(inputText, file, page, false);
					return;
				}
				if (!line.startsWith('#')) {
					count++;
					var cols = line.split('\t');
					var pos = cols[1].split('_');
					var start = pos[0];
					var end = pos[0];
					if (pos.length > 1) {
						end = pos[1];
					}
					if (firstLine) {
						inputText += cols[0] + ' ' + start + ' ' + end + ' ' + cols[3] + '/' + cols[4] + ' ' + '. . .';
						firstLine = false;
					} else {
						inputText +=
							'\n' + cols[0] + ' ' + start + ' ' + end + ' ' + cols[3] + '/' + cols[4] + ' ' + '. . .';
					}
				}
			}
			console.log(inputText);
			this.setState({
				searchTerm: inputText
			});
		};
		reader.readAsText(event.target.files[0]);

		// this.setState({ fileName }); /// if you want to upload latter
	}

	render() {
		const { searchTerm, isFileSelected, fileName, viewResultLabel, downloadLabel } = this.state;
		const { buttonLabel, isLoading } = this.props;
		return (
			<Fragment>
				<div>
					<h3 className="black-color margin-bottom-none vf-section-header__heading">
						<div className="inline-block">About PEPVEP</div>
					</h3>

					<p>
						PepVEP is an intuitive web resource for scientists to interpret the effects per residue of
						genomic variants on protein function or structure. It unites existing genomic and protein
						EMBL-EBI expertise; providing functional information from the Variant Effect Predictor (VEP),
						UniProt functional residue annotation (Protein function), and PDBe structural residue annotation
						in an integrated platform. PepVEP can be used as an interactive service or computationally via
						it's API.
					</p>
				</div>
				<div className="wrapper">
					<div id="example" className="card-table">
						<ExampleSection />
					</div>
					<div id="about" className="card-table">
						<AboutSection />
					</div>
					<div id="search" className="card-table">
						<div className="card">
							<section className="card__actions">
								<span className="card-header">
									<p>
										<b>Search</b>
									</p>
								</span>
							</section>
							<section className="card--has-hover" role="button">
								<div className="card__content">
									<section className="uniprot-card">
										<section className="uniprot-card__left">
											{/* <div className="text-area-search"> */}
											<form onSubmit={this.handleSubmit}>
												<textarea
													id="main-textarea-search-field"
													className="main-textarea-search-field"
													value={searchTerm}
													onChange={this.handleInputChange}
												/>

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

													{/* {searchTerm ? (
														<Button onClick={this.clearForm} className="button-primary">
															Clear Input
														</Button>
													) : (
														<Button
															onClick={this.useExampleData}
															className="button-primary"
														>
															Use Example Input
														</Button>
													)} */}
												</div>
											</form>
											{/* </div> */}
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
											<form onSubmit={this.handleSubmit}>
												<p>
													<b>What:</b> Extended REST API service that unites data from
													Genomic, Protein, Variation and PDBe services and provides users
													with impacts and consequences of variants. <br />
													<b>Why:</b> Access data sets mapped to UniProt and integrated
													through a single service.<br />
													<b>
														Documentation:
													</b>http://wwwdev.ebi.ac.uk/uniprot/pepvep/api/#docs/ <br />
												</p>

												{/* <p className="file-selected">
													<b>{fileName}</b>
												</p>
												<div id="search-button-group" className="search-button-group">
													<input
														id="myInput"
														type="file"
														style={{ display: 'none' }}
														ref={(ref) => (this.upload = ref)}
														onChange={this.onChangeFile.bind(this)}
													/>
													<Button
														onClick={() => {
															this.upload.click();
														}}
														className="button-primary"
													>
														Select File
													</Button>
													{isFileSelected ? (
														<Button
															type="submit"
															onClick={this.handleSubmit}
															className="button-primary"
														>
															{viewResultLabel}
														</Button>
													) : (
														<Button onClick={() => null} className="button-disabled">
															{viewResultLabel}
														</Button>
													)}
													{isFileSelected ? (
														<Button onClick={() => null} className="button-primary">
															Download Result
														</Button>
													) : (
														<Button onClick={() => null} className="button-disabled">
															Download Result
														</Button>
													)} */}
												{/* </div> */}
											</form>
										</section>
									</section>
								</div>
							</section>
						</div>
					</div>
					{/* <div>
						<span className="assemly-ref-note">
							<b>Reference Genome Assembly: GRCh38 (hg38) </b>
						</span>

						<a
							href="http://www.ensembl.org/Homo_sapiens/Tools/AssemblyConverter?db=core"
							target="_blank"
							rel="noopener noreferrer"
						>
							Open Ensembl Assembly Remapping
						</a>
					</div> */}
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
