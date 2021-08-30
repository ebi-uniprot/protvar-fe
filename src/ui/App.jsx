import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { post } from 'axios';
import PapaParse from 'papaparse';

import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import APIErrorPage from './pages/APIErrorPage';
import { API_URL } from '../constants/const';

class App extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			userInput: null,
			searchTerm: null,
			completeInput: null,
			searchResults: null,
			errors: null,
			loading: false,
			file: {},
			isFileSelected: false,
			page: {},
			invalidInputs: []
		};
	}

	createVariationDetails(variant) {
		var variationDetails = {};
		variationDetails.wildType = variant.variation.variant.split('/')[0];
		variationDetails.alternativeSequence = variant.variation.variant.split('/')[1];
		variationDetails.clinicalSignificances = this.getClinicalSignificance(variant.variation.clinicalSignificances);
		variationDetails.clinicalSignificance = this.getClinicalSignificanceStr(
			variant.variation.clinicalSignificances
		);
		variationDetails.sourceType = variant.variation.sourceType;
		variationDetails.association = variant.variation.association;
		variationDetails.xrefs = variant.variation.xrefs;
		variationDetails.polyphenScore = this.getPredictionScore(variant.variation.predictions, 'PolyPhen');
		variationDetails.polyphenPrediction = this.getPredictionType(variant.variation.predictions, 'PolyPhen');
		variationDetails.siftScore = this.getPredictionScore(variant.variation.predictions, 'SIFT');
		variationDetails.siftPrediction = this.getPredictionType(variant.variation.predictions, 'SIFT');
		variationDetails.disease = variant.variation.disease;
		variationDetails.nonDisease = variant.variation.nonDisease;
		variationDetails.uniprot = variant.variation.uniprot;
		variationDetails.largeScaleStudy = variant.variation.largeScaleStudy;
		variationDetails.uncertain = variant.variation.uncertain;
		variationDetails.ids = variant.variation.ids;
		variationDetails.begin = variant.variation.begin;
		variationDetails.end = variant.variation.end;
		return variationDetails;
	}

	getClinicalSignificance(clinicalSignificances) {
		var significances = [];
		clinicalSignificances.forEach((significance) => {
			significances.push(significance.type);
		});
		return significances;
	}

	getClinicalSignificanceStr(clinicalSignificances) {
		var significances = '';
		clinicalSignificances.forEach((significance) => {
			significances = significances + ',' + significance.type;
		});
		return significances;
	}

	getPredictionScore(predictions, algorithName) {
		var predScore = '';
		predictions.forEach((prediction) => {
			if (prediction.predAlgorithmNameType === algorithName) {
				predScore = prediction.score;
			}
		});
		return predScore;
	}

	getPredictionType(predictions, algorithName) {
		var predType = '';
		predictions.forEach((prediction) => {
			if (prediction.predAlgorithmNameType === algorithName) {
				predType = prediction.predictionValType;
			}
		});
		return predType;
	}

	createFunctionalSignificance(variant, variationDetails) {
		var functionalSignificance = {};
		functionalSignificance.features = variant.protein.features;
		functionalSignificance.variationDetails = variationDetails;
		// functionalSignificance.colocatedVariants = {};
		// functionalSignificance.colocatedVariantsEndpoint = variant.variation.proteinColocatedVariantsEndpoint;
		functionalSignificance.colocatedVariants = variant.variation.proteinColocatedVariants;
		return functionalSignificance;
	}

	createClinicalSignificance(variant, variationDetails) {
		var clinicalSignificance = {};
		if (variationDetails.clinicalSignificances !== undefined) {
			clinicalSignificance.categories = variationDetails.clinicalSignificances;
		}
		clinicalSignificance.association = variant.variation.association;
		// clinicalSignificance.colocatedVariants = {};
		// clinicalSignificance.colocatedVariantsEndpoint = variant.variation.proteinColocatedVariantsEndpoint;
		clinicalSignificance.colocatedVariants = variant.variation.proteinColocatedVariants;
		clinicalSignificance.variationDetails = variationDetails;
		clinicalSignificance.colocatedVariantsCount = variant.variation.proteinColocatedVariantsCount;
		clinicalSignificance.diseaseColocatedVariantsCount = variant.variation.diseaseAssociatedProtCVCount;
		return clinicalSignificance;
	}

	createTranscriptSignificance(variant, variationDetails) {
		var transcriptSignificances = [];
		var transcriptSignificance = {};
		var consequenceTerms = [];
		if (variant.variation.consequence !== undefined) {
			consequenceTerms.push(variant.variation.consequence);
		}
		transcriptSignificance.biotype = 'Protein Coding';
		transcriptSignificance.polyphenPrediction = variationDetails.polyphenPrediction;
		transcriptSignificance.polyphenScore = variationDetails.polyphenScore;
		transcriptSignificance.siftPrediction = variationDetails.siftPrediction;
		transcriptSignificance.siftScore = variationDetails.siftScore;
		transcriptSignificance.mostSevereConsequence = variant.variation.consequence;
		transcriptSignificance.consequenceTerms = consequenceTerms;
		transcriptSignificance.colocatedVariants = {};
		transcriptSignificance.colocatedVariantsEndpoint = variant.variation.proteinColocatedVariantsEndpoint;
		if (variationDetails.clinicalSignificances !== undefined) {
			transcriptSignificance.pathogenicity = variationDetails;
		}
		transcriptSignificance.variationDetails = variationDetails;
		transcriptSignificance.hgvsg = variant.gene.hgvsg;
		transcriptSignificance.hgvsp = variant.gene.hgvsp;
		transcriptSignificance.canonical = variant.protein.canonical;
		transcriptSignificance.codons = variant.variation.codons;
		transcriptSignificance.aminoAcids = variant.variation.variant;
		transcriptSignificance.enstId = variant.gene.enstId;
		transcriptSignificance.ensgId = variant.gene.ensgId;
		transcriptSignificance.start = variant.variation.begin;
		transcriptSignificance.end = variant.variation.end;
		transcriptSignificance.cosmicId = variant.variation.cosmicId;
		transcriptSignificance.dbSNPId = variant.variation.dbSNPId;
		transcriptSignificance.clinVarIds = variant.variation.clinVarIDs;
		transcriptSignificance.colocatedVariantsCount = variant.variation.proteinColocatedVariantsCount;
		transcriptSignificance.diseaseColocatedVariantsCount =
			variant.variation.diseaseAssociatedproteinColocatedVariantsCount;
		transcriptSignificance.redundantENSTs = variant.gene.redundantENSTs;
		transcriptSignificance.mutationTasterScore = '';
		transcriptSignificance.mutationTasterPrediction = '';
		transcriptSignificance.lrtPrediction = '';
		transcriptSignificance.lrtScore = 0.0;
		transcriptSignificance.caddPhred = 0.0;
		transcriptSignificances.push(transcriptSignificance);
		return transcriptSignificances;
	}

	createGenomicSignificance(variant, variationDetails) {
		var genomic = {};
		var consequencePrediction = {};
		consequencePrediction.polyphenPrediction = variationDetails.polyphenPrediction;
		consequencePrediction.polyphenScore = variationDetails.polyphenScore;
		consequencePrediction.siftPrediction = variationDetails.siftPrediction;
		consequencePrediction.siftScore = variationDetails.siftScore;
		consequencePrediction.caddPhred = 0.0;
		consequencePrediction.caddRaw = 0.0;

		genomic.consequencePrediction = consequencePrediction;
		genomic.variationDetails = variationDetails;
		genomic.populationFrequencies = variant.variation.populationFrequencies;
		return genomic;
	}

	createSignificances(variants) {
		var updateVariants = {
			errors: [],
			results: []
		};
		variants.forEach((variant) => {
			if (variant.errors !== undefined && variant.errors.length > 0) {
				updateVariants.errors = variant.errors;
			}
			if (variant.variation != null) {
				var significances = {};
				var updateVariant = {};
				var variationDetails = this.createVariationDetails(variant);

				significances.functional = this.createFunctionalSignificance(variant, variationDetails);
				significances.structural = {};
				significances.structureEndpoint = variant.structureEndpoint;
				significances.genomic = this.createGenomicSignificance(variant, variationDetails);
				significances.clinical = this.createClinicalSignificance(variant, variationDetails);
				significances.transcript = this.createTranscriptSignificance(variant, variationDetails);
				updateVariant.significances = significances;
				updateVariant.protein = variant.protein;
				updateVariant.gene = variant.gene;
				// updateVariant.variation = {};
				// updateVariant.variation.variationDetails = {};
				updateVariant.variation = variant.variation;
				// updateVariant.variation.variationDetails = variationDetails;
				updateVariants.results.push(updateVariant);
			}
		});
		return updateVariants;
	}

	handleSearch = (inputArr, uploadedFile, page, loadingFlag) => {
		var pageNumber = page.currentPage;
		const PAGE_SIZE = page.itemsPerPage;
		var skipRecord = (pageNumber - 1) * PAGE_SIZE;
		var inputSubArray = [];
		var newPage = {
			currentPage: page.currentPage,
			previousPage: page.previousPage,
			nextPage: false,
			totalItems: page.totalItems,
			itemsPerPage: page.itemsPerPage
		};

		var isFileSelectedNew = false;
		var loadingNew = true;
		if (uploadedFile && loadingFlag) {
			isFileSelectedNew = true;
			loadingNew = true;
		}
		if (uploadedFile && !loadingFlag) {
			isFileSelectedNew = true;
			loadingNew = false;
		}
		this.setState({
			isFileSelected: isFileSelectedNew,
			loading: loadingNew,
			page: newPage
		});

		// var inputArr = input.split('\n');
		let inputType = this.getInputType(inputArr);

		if (inputArr.length > skipRecord) {
			var isNextPage = false;
			if (inputArr.length > skipRecord + PAGE_SIZE) isNextPage = true;
			if (isNextPage) {
				inputSubArray = inputArr.slice(skipRecord, skipRecord + PAGE_SIZE);
				newPage = {
					currentPage: page.currentPage,
					previousPage: page.previousPage,
					nextPage: isNextPage,
					totalItems: page.totalItems,
					itemsPerPage: page.itemsPerPage
				};
			} else {
				inputSubArray = inputArr.slice(skipRecord);
			}
			if (skipRecord === 0) {
				newPage = {
					currentPage: page.currentPage,
					previousPage: page.previousPage,
					nextPage: isNextPage,
					totalItems: page.totalItems,
					itemsPerPage: page.itemsPerPage
				};
			}
			if (inputType === 'hgvs') {
				this.fetchByHGVS(inputSubArray, inputArr, uploadedFile, newPage);
			} else if (inputType === 'vcf') {
				this.fetchByVCF(inputSubArray, inputArr, uploadedFile, newPage);
			}
		}
	};

	createGenes(mapping) {
		var genes = [];
		var chr = mapping.chromosome;
		var start = mapping.geneCoordinateStart;
		var variant = mapping.variantAllele;
		var id = mapping.id;

		mapping.genes.forEach((gene) => {
			var rows = [];
			let ensg = gene.ensg;
			gene.isoforms.forEach((isoform) => {
				var record = {};
				if (isoform.canonical || isoform.canonicalAccession === null) {
					record.chromosome = chr;
					record.id = id;
					record.refAllele = gene.refAllele;
					record.geneName = gene.geneName;
					record.codon = isoform.refCodon + '/' + isoform.variantCodon;
					if (gene.caddScore === null) record.CADD = '-';
					else record.CADD = gene.caddScore;
				}
				record.position = start;
				record.altAllele = variant;
				record.proteinName = isoform.proteinName;
				record.isoform = isoform.accession;
				record.aaPos = isoform.isoformPosition;
				record.aaChange = isoform.refAA + '/' + isoform.variantAA;
				record.refAA = isoform.refAA;
				record.variantAA = isoform.variantAA;
				record.consequences = isoform.consequences;
				record.cdsPosition = isoform.cdsPosition;
				record.canonical = isoform.canonical;
				record.canonicalAccession = isoform.canonicalAccession;
				record.referenceFunctionUri = isoform.referenceFunctionUri;
				record.populationObservationsUri = isoform.populationObservationsUri;
				record.ensp = [];
				record.enst = [];
				record.strand = gene.reverseStrand;
				if (isoform.translatedSequences !== undefined && isoform.translatedSequences.length > 0) {
					var ensps = [];
					isoform.translatedSequences.forEach((translatedSeq) => {
						var translatedSequence = {};
						var ensts = [];
						translatedSeq.transcripts.map((transcript) => ensts.push(transcript.enst));
						translatedSequence.ensp = translatedSeq.ensp;
						translatedSequence.ensts = ensts.join();
						ensps.push(translatedSequence);
					});
					record.ensp = ensps;
					// record.enst = ensts;
					// isoform.translatedSequences.map;
					// if (
					// 	isoform.translatedSequences[0].transcripts !== undefined &&
					// 	isoform.translatedSequences[0].transcripts.length > 0
					// ) {
					// 	record.enst = isoform.translatedSequences[0].transcripts[0].enst;
					// }
				}
				record.ensg = ensg;
				record.functionLoaded = false;
				record.structureLoaded = false;
				record.variationLoaded = false;
				rows.push(record);
			});
			genes.push(rows);
		});
		if (genes.length === 0) {
			var rows = [];
			var record = {};
			record.chromosome = chr;
			record.position = start;
			record.id = id;
			record.refAllele = mapping.userAllele;
			record.altAllele = mapping.variantAllele;
			record.canonicalAccession = null;
			rows.push(record);
			genes.push(rows);
		}
		return genes;
	}

	getInputType(inputArr) {
		return 'vcf';
		// let firstInput = inputArr[0];
		// if (firstInput.startsWith('NC')) {
		// 	return 'hgvs';
		// } else if (!isNaN(firstInput.split(' ')[0])) {
		// 	return 'vcf';
		// } else {
		// 	return 'unknown input';
		// }
	}

	fetchResult = (uploadedFile, page, isFileSelected, loading, inputText) => {
		this.setState({
			userInput: inputText
		});
		this.fetchNextPage(uploadedFile, page, isFileSelected, loading, inputText);
	};

	fetchNextPage = (uploadedFile, page, isFileSelected, loading, input) => {
		var inputText = input;
		if (inputText === undefined || inputText === null) {
			inputText = this.state.userInput;
		}
		var pageNumber = page.currentPage;
		const PAGE_SIZE = page.itemsPerPage;
		let skipRecord = 1;
		if (pageNumber !== 1) skipRecord = (pageNumber - 1) * PAGE_SIZE;
		var newPage = {
			currentPage: page.currentPage,
			previousPage: page.previousPage,
			nextPage: false,
			totalItems: page.totalItems,
			itemsPerPage: page.itemsPerPage
		};

		if (isFileSelected) this.fetchFromFile(skipRecord, page, uploadedFile, PAGE_SIZE, isFileSelected, loading);
		else {
			this.handleSearch(inputText, null, newPage, true);
		}
	};

	fetchFromFile = (skipRecord, page, uploadedFile, pageSize, isFileSelected, loading) => {
		var count = 0;
		var recordsProcessed = 0;
		var firstLine = true;
		var inputText = [];
		var newPage = {
			currentPage: page.currentPage,
			previousPage: page.previousPage,
			nextPage: false,
			totalItems: page.totalItems,
			itemsPerPage: page.itemsPerPage
		};
		// var numberOfLinesToRead = skipRecord + PAGE_SIZE;
		PapaParse.parse(uploadedFile, {
			// preview: numberOfLinesToRead,
			step: (row, parser) => {
				if (recordsProcessed >= pageSize) {
					newPage = {
						currentPage: page.currentPage,
						previousPage: page.previousPage,
						nextPage: true,
						totalItems: page.totalItems,
						itemsPerPage: page.itemsPerPage
					};
					// this.handleSearch(inputText, uploadedFile, this.state.page, true);
					parser.abort();
				}
				if (!row.data[0].startsWith('#') && count > skipRecord) {
					recordsProcessed++;
					var newInput = this.createCsvString(row.data);
					if (newInput !== '') {
						if (firstLine) {
							inputText.push(newInput);
							firstLine = false;
						} else {
							inputText.push(newInput);
						}
					}
				} else {
					count++;
				}
			},
			complete: () => {
				this.setState({
					page: newPage,
					searchTerm: inputText,
					isFileSelected: isFileSelected,
					loading: loading
				});
				// this.handleSearch(inputText, uploadedFile, this.state.page, loading);
				this.fetchByVCF(inputText, inputText, uploadedFile, newPage);
			}
		});
	};

	fetchByVCF(inputSubArray, input, uploadedFile, newPage) {
		const BASE_URL = `${API_URL}`;
		const { history } = this.props;
		const headers = {
			'Content-Type': 'application/json',
			Accept: '*'
		};

		const uri = BASE_URL + '/variant/mapping';
		const output = {
			errors: [],
			results: {}
		};
		if (this.state.searchResults != null) {
			output.results = this.state.searchResults;
		}
		var errorFlag = false;
		var mappings = [];
		post(uri, inputSubArray, {
			headers: headers
		})
			.catch((err) => {
				errorFlag = true;
				console.log(err);
			})
			.then((response) => {
				if (!errorFlag) {
					response.data.mappings.forEach((mapping) => {
						var genes = this.createGenes(mapping);
						mappings.push(genes);
					});

					this.setState({
						searchTerm: input,
						pageInput: inputSubArray,
						searchResults: mappings,
						errors: output.errors,
						loading: false,
						isFileSelected: false,
						file: uploadedFile,
						page: newPage,
						invalidInputs: response.data.invalidInputs
					});
				}
				if (errorFlag) history.push('api-error');
				else history.push('search');
			});
	}

	fetchByHGVS(inputArr, input, uploadedFile, newPage) {
		const BASE_URL = `${API_URL}`;
		const { history } = this.props;
		const headers = {
			'Content-Type': 'application/json'
		};

		const uri = BASE_URL + '/variant/hgvs';
		const output = {
			errors: [],
			results: {}
		};
		if (this.state.searchResults != null) {
			output.results = this.state.searchResults;
		}
		post(uri, inputArr, {
			headers: headers
		}).then((response) => {
			response.data.variants.forEach((variants) => {
				var updatedVariants = this.createSignificances(variants);

				updatedVariants.results.forEach((variant) => {
					let key = variant.gene.hgvsg;
					var existingVar = output.results[key];
					if (existingVar !== undefined) {
						existingVar.rows.push(variant);
						output.results[key] = {
							key: key,
							input: key,
							rows: existingVar.rows
						};
					} else {
						let newRows = [];
						newRows.push(variant);
						output.results[key] = {
							key: key,
							input: key,
							rows: newRows
						};
					}
				});
			});

			this.setState({
				searchTerm: input,
				searchResults: output.results,
				errors: output.errors,
				loading: false,
				isFileSelected: false,
				file: uploadedFile,
				page: newPage
			});

			history.push('search');

			// this.processResponse(results, input, uploadedFile, newPage, history);
		});
	}

	processResponse(results, input, uploadedFile, newPage, history) {
		const output = {
			errors: [],
			results: {}
		};
		if (this.state.searchResults != null) {
			output.results = this.state.searchResults;
		}
		results.data.pepvepvariant.forEach((element) => {
			if (element.variants.length > 0) {
				var sortedVariants = [];
				var topRow = element.variants.filter(
					(variant) => variant.protein.canonicalAccession === variant.protein.accession
				);
				var otherRows = element.variants.filter(
					(variant) => variant.protein.accession !== variant.protein.canonicalAccession
				);
				if (otherRows !== undefined || otherRows.length > 0) {
					sortedVariants = topRow.concat(otherRows);
				} else {
					sortedVariants = topRow;
				}
				var updatedVariants = this.createSignificances(sortedVariants);
				output.errors = output.errors.concat(updatedVariants.errors);
				output.results[element.input] = {
					key: element.input,
					input: element.input,
					rows: updatedVariants.results
				};
			}
		});

		this.setState({
			searchTerm: input,
			searchResults: output.results,
			// searchResults: [ ...this.state.searchResults, ...output.results ],
			errors: output.errors,
			loading: false,
			isFileSelected: false,
			file: uploadedFile,
			page: newPage
		});

		history.push('search');
	}

	createCsvString(rowArr) {
		return rowArr.join(' ');
	}

	handleDownload = () => {};

	handleBulkDownload = (e, file) => {
		const BASE_URL = `${API_URL}`;
		this.fileUpload(file).then((response) => {
			console.log('File uploaded successfully ', response);
			let a = document.createElement('a');
			a.href = BASE_URL + '/variant/download/' + response.data + '/';
			a.download = 'pepvep.zip';
			a.click();
		});
	};

	fileUpload(file) {
		const BASE_URL = `${API_URL}`;

		const formData = new FormData();
		formData.append('file', file);
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		};
		return post(BASE_URL, formData, config);
	}

	render() {
		const appProps = {
			...this.state,
			handleSearch: this.handleSearch,
			handleDownload: this.handleDownload,
			fetchNextPage: this.fetchNextPage,
			handleBulkDownload: this.handleBulkDownload,
			fetchResult: this.fetchResult,
			history: this.props.history
		};

		return (
			<>
				<Route path="/" exact render={() => <HomePage {...appProps} />} />
				<Route path="/search" render={() => <SearchResultsPage {...appProps} />} />
				<Route path="/api-error" render={() => <APIErrorPage {...appProps} />} />
			</>
		);
	}
}

export default withRouter(App);
