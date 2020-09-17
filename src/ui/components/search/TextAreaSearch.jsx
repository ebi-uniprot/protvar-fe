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
		downloadLabel: 'Download Result'
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
		const { searchTerm } = this.state;
		const { onSubmit } = this.props;
		this.setState({
			viewResultLabel: 'Loading..'
		});
		e.preventDefault();
		e.stopPropagation();

		onSubmit(searchTerm);
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
		console.log(file);
		var text = '';
		this.setState({
			isFileSelected: true,
			fileName: file.name
		});
		var reader = new FileReader();
		reader.onload = async (e) => {
			text = e.target.result;
			console.log(text);
			this.setState({
				searchTerm: text
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
				<div className="wrapper">
					<div className="card-table">
						<ExampleSection />
					</div>
					<div className="card-table">
						<AboutSection />
					</div>
					<div className="card-table">
						<div className="card">
							<section className="card__actions">
								<span className="card-header">
									<p>
										<b>Interactive Search</b>
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

													{searchTerm ? (
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
													)}
												</div>
											</form>
											{/* </div> */}
										</section>
									</section>
								</div>
							</section>
						</div>
					</div>

					<div className="card-table">
						<div className="card">
							<section className="card__actions">
								<span className="card-header">
									<p>
										<b>Download</b>
									</p>
								</span>
							</section>
							<section className="card--has-hover" role="button">
								<div className="card__content">
									<section className="uniprot-card">
										<section className="uniprot-card__left">
											<form onSubmit={this.handleSubmit}>
												<p>
													Only vcf file containing below input format is accepted<br /> 14
													89993420 89993420 A/G . . .<br />
													10 87933147 87933147 C/T . . .<br />
												</p>

												<p className="file-selected">
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
													)}
												</div>
											</form>
										</section>
									</section>
								</div>
							</section>
						</div>
					</div>
					<div>
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
