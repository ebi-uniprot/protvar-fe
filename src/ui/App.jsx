import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';

import gql from 'graphql-tag';
import { ApolloClient, client, InMemoryCache, ApolloProvider } from '@apollo/client';

import { defaultParser } from '../input-parser';

import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import APIErrorPage from './pages/APIErrorPage';

class App extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			searchTerm: null,
			searchResults: null,
			errors: null,
			loading: false,
			file: {},
			page: {}
		};
	}

	createFunctionalSignificance(variant) {
		var functionalSignificance = {};
		functionalSignificance.features = variant.protein.features;
		functionalSignificance.variationDetails = variant.variation.variationDetails;
		functionalSignificance.colocatedVariants = variant.variation.proteinColocatedVariants;
		return functionalSignificance;
	}

	createClinicalSignificance(variant) {
		var clinicalSignificance = {};
		if (variant.variation.clinicalSignificances !== undefined) {
			clinicalSignificance.categories = variant.variation.clinicalSignificances.split(',');
		}
		// var associations = [];
		// variant.variation.features.forEach((feature) => {
		// 	associations.push(feature.association);
		// });
		clinicalSignificance.association = variant.variation.association;
		clinicalSignificance.colocatedVariants = variant.variation.proteinColocatedVariants;
		clinicalSignificance.variationDetails = variant.variation.variationDetails;
		clinicalSignificance.colocatedVariantsCount = variant.variation.proteinColocatedVariantsCount;
		clinicalSignificance.diseaseColocatedVariantsCount =
			variant.variation.diseaseAssociatedproteinColocatedVariantsCount;

		return clinicalSignificance;
	}

	createTranscriptSignificance(variant) {
		var transcriptSignificances = [];
		var transcriptSignificance = {};
		var consequenceTerms = [];
		if (variant.variation.consequence !== undefined) {
			consequenceTerms.push(variant.variation.consequence);
		}
		transcriptSignificance.biotype = 'Protein Coding';
		transcriptSignificance.polyphenPrediction = variant.variation.variationDetails.polyphenPrediction;
		transcriptSignificance.polyphenScore = variant.variation.variationDetails.polyphenScore;
		transcriptSignificance.siftPrediction = variant.variation.variationDetails.siftPrediction;
		transcriptSignificance.siftScore = variant.variation.variationDetails.siftScore;
		transcriptSignificance.mostSevereConsequence = variant.variation.consequence;
		transcriptSignificance.consequenceTerms = consequenceTerms;
		transcriptSignificance.colocatedVariants = variant.variation.proteinColocatedVariants;
		if (variant.variation.clinicalSignificances !== undefined) {
			transcriptSignificance.pathogenicity = variant.variation.clinicalSignificances.split(',');
		}
		transcriptSignificance.variationDetails = variant.variation.variationDetails;
		transcriptSignificance.hgvsg = variant.gene.hgvsg;
		transcriptSignificance.hgvsp = variant.gene.hgvsp;
		transcriptSignificance.canonical = variant.protein.canonical;
		transcriptSignificance.codons = variant.variation.codons;
		transcriptSignificance.aminoAcids = variant.protein.variant;
		transcriptSignificance.enstId = variant.gene.enstId;
		transcriptSignificance.ensgId = variant.gene.ensgId;
		transcriptSignificance.start = variant.protein.start;
		transcriptSignificance.end = variant.protein.end;
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
		transcriptSignificances.push(transcriptSignificance);
		return transcriptSignificances;
	}

	createGenomicSignificance(variant) {
		var genomic = {};
		var consequencePrediction = {};
		consequencePrediction.polyphenPrediction = variant.variation.variationDetails.polyphenPrediction;
		consequencePrediction.polyphenScore = variant.variation.variationDetails.polyphenScore;
		consequencePrediction.siftPrediction = variant.variation.variationDetails.siftPrediction;
		consequencePrediction.siftScore = variant.variation.variationDetails.siftScore;
		consequencePrediction.caddPhred = 0.0;
		consequencePrediction.caddRaw = 0.0;

		genomic.consequencePrediction = consequencePrediction;
		genomic.variationDetails = variant.variation.variationDetails;
		genomic.populationFrequencies = variant.variation.populationFrequencies;
		// var frequencies = {};
		// if (variant.variation.populationFrequencies == null) {
		// 	return genomic;
		// }
		// variant.variation.populationFrequencies.forEach((popFreq) => {
		// 	if (
		// 		frequencies[popFreq.sourceName] === undefined &&
		// 		popFreq !== undefined &&
		// 		popFreq.frequencies.length > 0
		// 	) {
		// 		var freqUI = {};
		// 		popFreq.frequencies.forEach((freq) => {
		// 			var value = {};
		// 			value.label = freq.label;
		// 			value.value = freq.value;
		// 			freqUI[freq.label] = value;
		// 		});
		// 		frequencies[popFreq.sourceName] = freqUI;
		// 	}
		// });
		// genomic.populationFrequencies = frequencies;
		return genomic;
	}

	createStructuralSignificance(variant) {
		if (variant.structure === null) {
			return null;
		}
		var accession = Object.keys(variant.structure);
		if (variant.structure[accession].all_structures.length === 0) {
			return null;
		}
		var structuralSignificance = {};
		structuralSignificance.position = variant.protein.start;
		structuralSignificance.proteinLength = variant.structure[accession].length;
		structuralSignificance.allStructures = JSON.parse(JSON.stringify(variant.structure[accession].all_structures)); //{ ...variant.structure[accession].all_structures };
		structuralSignificance.annotations = [ variant.structure[accession].annotations ];
		structuralSignificance.ligands = variant.structure[accession].ligands.positions;
		structuralSignificance.interactions = variant.structure[accession].interactions.positions;
		structuralSignificance.structures = variant.structure[accession].structures.positions;
		structuralSignificance.accession = accession[0];

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

	createSignificances(variants) {
		var updateVariants = {
			errors: [],
			results: []
		};
		variants.forEach((variant) => {
			if (variant.errors.length > 0) {
				updateVariants.errors = variant.errors;
			}
			if (variant.variation != null) {
				var significances = {};
				var updateVariant = {};
				significances.functional = this.createFunctionalSignificance(variant);
				significances.structural = this.createStructuralSignificance(variant);
				significances.genomic = this.createGenomicSignificance(variant);
				significances.clinical = this.createClinicalSignificance(variant);
				significances.transcript = this.createTranscriptSignificance(variant);
				updateVariant.significances = significances;
				updateVariant.protein = variant.protein;
				updateVariant.gene = variant.gene;
				updateVariant.variation = variant.variation;
				updateVariants.results.push(updateVariant);
			}
		});
		return updateVariants;
	}

	readNextPageInput(uploadedFile, page) {
		event.stopPropagation();
		event.preventDefault();
		var pageNumber = page.currentPage;
		var skipRecord = (pageNumber - 1) * 3;
		var reader = new FileReader();
		var inputText = '';
		reader.onload = async (e) => {
			inputText = this.readFile(e, skipRecord, inputText, page);
			this.setState({
				searchTerm: inputText
			});
			this.handleSearch(inputText, uploadedFile, page);
		};
		reader.readAsText(uploadedFile);
	}

	fetchNextPage = (uploadedFile, page) => {
		var input = this.readNextPageInput(uploadedFile, page);
		// var input = '21 43072000 43072000 T/C . . .';
		// this.handleSearch(input, uploadedFile, page);
	};

	handleSearch = (input, uploadedFile, page) => {
		console.log('calling client');
		const { history } = this.props;
		const { file } = this.setState;
		this.setState({
			loading: true
		});
		// this.updater.enqueueForceUpdate(this);

		var inputArr = input.split('\n');
		console.log(inputArr);
		const GET_VARIANTS = gql`
			query pepvepvariant($params: [String!]) {
				pepvepvariant(pepVepInputs: $params) {
					input
					errors {
						title
						message
					}
					variants {
						errors {
							title
							message
						}
						structure
						gene {
							ensgId
							chromosome
							symbol
							source
							enstId
							ensgId
							allele
							start
							end
							exon
							strand
							hgvsg
							hgvsp
							codons
							hasENSP
							hasENST
						}
						protein {
							variant
							threeLetterCodes
							start
							end
							hgncId
							canonical
							accession
							name {
								full
								shortName
							}
							length
							type
							isoform
							canonicalAccession
							features {
								type
								typeDescription
								category
								begin
								end
								evidences {
									code
									label
									source {
										name
										id
										url
										alternativeUrl
									}
								}
								ftId
							}
						}
						variation {
							novel
							cosmicId
							dbSNPId
							codons
							clinVarIDs {
								id
								pubMedIDs
								allele
								date
								gene
								clinicalSignificances
								dbSNPId
								mim
								phenotype
								url
							}
							association {
								name
								description
								dbReferences {
									name
									id
									url
									alternativeUrl
								}
								evidences {
									code
									sourceUrl
									sourceAlternativeUrl
									label
									source {
										name
										id
										url
										alternativeUrl
									}
								}
								disease
							}
							wildType
							alternativeSequence
							consequence
							clinicalSignificances
							variationDetails {
								description
								wildType
								alternativeSequence
								clinicalSignificances
								sourceType
								ids {
									rsId
									dbSNPId
									cosmicId
									clinVarIDs {
										id
										dbSNPId
									}
								}
								association {
									name
									description
									dbReferences {
										name
										id
										url
										alternativeUrl
									}
									evidences {
										code
										label
										source {
											name
											id
											url
											alternativeUrl
										}
									}
									disease
								}
								xrefs {
									name
									id
									url
									alternativeUrl
								}
								polyphenPrediction
								polyphenScore
								siftPrediction
								siftScore
								disease
								nonDisease
								uniprot
								largeScaleStudy
								uncertain
							}
							proteinColocatedVariants {
								description
								wildType
								alternativeSequence
								clinicalSignificances
								sourceType
								association {
									name
									description
									dbReferences {
										name
										id
										url
										alternativeUrl
									}
									evidences {
										code
										label
										source {
											name
											id
											url
											alternativeUrl
										}
									}
									disease
								}
								xrefs {
									name
									id
									url
									alternativeUrl
								}
								polyphenScore
								siftScore
								disease
								nonDisease
								uniprot
								largeScaleStudy
								uncertain
							}
							genomicColocatedVariants {
								id
								pubMedIDs
							}
							populationFrequencies {
								sourceName
								frequencies {
									label
									value
								}
							}
							proteinColocatedVariantsCount
							diseaseAssociatedproteinColocatedVariantsCount
						}
					}
				}
			}
		`;

		const client = new ApolloClient({
			cache: new InMemoryCache(),
			uri: 'http://localhost:8091/graphql'
			// uri: 'http://localhost:8080/pepvep-service/graphql'
			// uri: 'http://wp-np2-ca:8080/pepvep-service/graphql'
		});

		client
			.query({
				query: GET_VARIANTS,
				variables: { params: inputArr }
			})
			.then((results) => {
				console.log(results);

				const output = {
					errors: [],
					results: {}
				};

				results.data.pepvepvariant.forEach((element) => {
					// if (element.errors.length > 0) {
					// 	output.errors = output.errors.concat(element.errors);
					// }
					if (output.results[element.input] === undefined && element.variants.length > 0) {
						// if (element.variants.errors !== undefined && element.variants.errors.length > 0) {
						// 	output.errors = output.errors.concat(element.variants.errors);
						// 	element.variants.errors = null;
						// }
						var updatedVariants = this.createSignificances(element.variants);
						output.errors = output.errors.concat(updatedVariants.errors);
						output.results[element.input] = {
							key: element.input,
							input: element.input,
							rows: updatedVariants.results
						};
					}
					console.log('output ' + output.results);
				});

				this.setState({
					searchTerm: input,
					searchResults: output.results,
					errors: output.errors,
					loading: false,
					file: uploadedFile,
					page: page
				});

				history.push('search');
			});
		console.log('calling client complete');
	};

	readFile(e, skipRecord, inputText, page) {
		var text = e.target.result;

		var lines = text.split('\n');
		var firstLine = true;
		var count = 0;
		var recordsFetched = 0;
		lines.forEach((line) => {
			if (recordsFetched >= 3) {
				var currPage = page.currentPage;
				var prevPage = page.previousPage;
				var newPage = {
					currentPage: currPage,
					nextPage: false,
					previousPage: prevPage
				};
				this.setState({
					page: newPage
				});
				return inputText;
			}
			if (!line.startsWith('#') && count > skipRecord) {
				recordsFetched++;
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
			} else {
				count++;
			}
		});
		return inputText;
	}

	getCSVRow(input, variant) {
		var isAssociatedDisease = 'No';
		var allStructures = '';
		var diseaseDetails = '';
		var featureDetails = '';
		if (variant.significances.clinical.association.length > 0) {
			isAssociatedDisease = 'Yes';
			variant.significances.clinical.association.forEach((disease) => {
				console.log(disease);
				diseaseDetails += `disease=${disease.disease}`;
				diseaseDetails += disease.name ? `,name=${disease.name.replace(/,/gi, '')}` : '';
				diseaseDetails += disease.description ? `,description=${disease.description.replace(/,/gi, '')}` : '';
				const diseaseEvidences = [];
				disease.evidences.forEach((diseaseEvidence) => {
					diseaseEvidences.push(`${diseaseEvidence.source.name}:${diseaseEvidence.source.id}`);
				});

				if (diseaseEvidences.length) {
					diseaseDetails += `,evidences=${diseaseEvidences.join(';')}`;
				}
				diseaseDetails += ',';
			});
		}

		if (variant.significances.functional != null && variant.significances.functional.features.length > 0) {
			variant.significances.functional.features.forEach((feature) => {
				featureDetails += `type=${feature.type}`;
				featureDetails += `,category=${feature.category}`;
				featureDetails += feature.description ? `,description=${feature.description.replace(/,/gi, '')}` : '';
				featureDetails += `,start=${feature.begin}`;
				featureDetails += `,end=${feature.end}`;

				if (feature.evidences != null && feature.evidences.length > 0) {
					const featureEvidences = [];
					feature.evidences.forEach((featureEvidence) => {
						featureEvidences.push(`${featureEvidence.sourceName}:${featureEvidence.sourceId}`);
					});

					if (featureEvidences.length > 0) {
						featureDetails += `,evidences=${featureEvidences.join(';')}`;
					}
				}
				featureDetails += '|';
			});
		}

		var ligands = '';
		var interactions = '';
		if (variant.significances.structural != null) {
			if (
				variant.significances.structural.ligands != undefined &&
				Object.keys(variant.significances.structural.ligands).length > 0
			) {
				variant.significances.structural.ligands.forEach((ligandObject) => {
					let result = [];

					// if (variation.threeLetterAminoAcidBase.toUpperCase() !== ligandObject.position_code) {
					// 	return output;
					// }

					ligandObject.ligands.forEach((ligand) => {
						const ligandSerilised = [
							`id:${ligand.ligand_id}`,
							`formula:${ligand.formula}`,
							`InChi:${ligand.InChi}`,
							`ligand_name:${ligand.ligand_name}`
						].join(',');

						result.push(ligandSerilised);
					});

					ligands += result.join('|') + ';';
				}, '');
			}

			if (
				variant.significances.structural.interactions != undefined &&
				variant.significances.structural.interactions.length > 0
			) {
				variant.significances.structural.interactions.forEach((interaction) => {
					// if (variation.threeLetterAminoAcidBase.toUpperCase() !== interaction.position_code) {
					// 	return output;
					// }
					var partner_name = '';
					interaction.partners.forEach((partner) => {
						partner_name += partner.name + ',';
					});
					interactions += partner_name + '|';
				}, '');
			}

			if (variant.significances.structural.allStructures != null) {
				allStructures = Object.keys(variant.significances.structural.allStructures).join(',');
			}
		}
		if (
			variant.variation.proteinColocatedVariants != 'undefined' &&
			variant.variation.proteinColocatedVariants.length > 0
		) {
			var colocated_variants = '';
			variant.variation.proteinColocatedVariants.forEach((cv) => {
				colocated_variants +=
					[
						`alternative_sequence:${cv.alternativeSequence}`,
						`clinical_significances:${cv.clinicalSignificances}`,
						`disease:${cv.disease ? 1 : 0}`,
						`large_scale_study:${cv.largeScaleStudy}`,
						`polyphen_score:${cv.polyphenScore}`,
						`sift_score:${cv.siftScore}`,
						`source_type:${cv.sourceType}`,
						`uniprot:${cv.uniprot}`,
						`wildType:${cv.wildType}`
					].join(',') + '|';
			});
		}

		return (
			'"' +
			input +
			'","' +
			variant.variation.consequence +
			'","' +
			'GRCh38' +
			'","' +
			variant.gene.chromosome +
			'","' +
			variant.gene.start +
			'","' +
			variant.gene.end +
			'","' +
			variant.gene.allele +
			'","' +
			variant.gene.allele.split('/')[1] +
			'","' +
			variant.gene.symbol +
			'","' +
			variant.gene.source +
			'","' +
			variant.protein.hgncId + // HGNC ID
			'","' +
			variant.gene.ensgId +
			'","' +
			variant.gene.enstId +
			'","' +
			variant.gene.hgvsp +
			'","' +
			'Protein Coding' + // BioType
			'","' +
			// 'Moderate' + // IMPACT
			// '","' +
			variant.variation.consequence + // CONSEQUENCE_TERMS
			'","' +
			variant.protein.accession +
			'","' +
			variant.protein.start +
			'","' +
			variant.protein.end +
			'","' +
			allStructures +
			'","' +
			ligands + // LIGANDS
			'","' +
			interactions + // STRUCTURAL_INTERACTION_PARTNERS
			'","' +
			variant.protein.variant +
			'","' +
			isAssociatedDisease +
			'","' +
			variant.variation.variationDetails.clinicalSignificances +
			'","' +
			variant.variation.variationDetails.polyphenPrediction +
			'","' +
			variant.variation.variationDetails.polyphenScore +
			'","' +
			variant.variation.variationDetails.siftPrediction +
			'","' +
			variant.variation.variationDetails.siftScore +
			'","' +
			variant.gene.strand +
			'","' +
			variant.gene.exon +
			'","' +
			variant.gene.enstId +
			'","' +
			variant.gene.hgvsp +
			'","' +
			variant.gene.hgvsg +
			'","' +
			diseaseDetails +
			'","' +
			featureDetails +
			'","' +
			colocated_variants +
			'"\n'
		);
	}
	handleDownload = () => {
		const { searchTerm, searchResults } = this.state;
		console.log(searchResults);
		var inputArr = searchTerm.split('\n');
		console.log('handle download clicked');
		var outputCsv =
			'INPUT,MOST_SEVER_CONSEQUENCE,ASSEMBLY,CHROMOSOME,' +
			'GENOMIC_START,GENOMIC_END,ALLELE_STRING,VARIANT_ALLELE,' +
			'GENE_SYMBOL,GENE_SYMBOL_SOURCE,' +
			'HGNC_ID,' +
			'GENE_ID,TRANSCRIPT_ID,TRANSLATION_ID,' +
			'BIOTYPE,' +
			// IMPACT,' +
			'CONSEQUENCE_TERMS,UNIPROT_ACCESSIONS,' +
			// 'TREMBL_ACCESSIONS,' +
			'PROTEIN_START,PROTEIN_END,STRUCTURES,LIGANDS,' +
			'STRUCTURAL_INTERACTION_PARTNERS,AMINO_ACID_CHANGE,ASSOCIATED_TO_DISEASE,' +
			'DISEASE_CATEGORIES,POLYPHEN_PREDICTION,POLYPHEN_SCORE,' +
			// 'MUTATION_TASTER_PREDICTION,MUTATION_TASTER_SCORE,LRT_PREDICTION,LRT_SCORE,FATHMM_PREDICTION,' +
			// 'FATHMM_SCORE,PROVEAN_PREDICTION,PROVEAN_SCORE,CADD_RAW,CADD_PHRED,' +
			'SIFT_PREDICTION,SIFT_SCORE,' +
			// 'MUTPRED_SCORE,BLOSUM62,APPRIS,TSL,STRAND,CODONS,CDNA_START,CDNA_END,CDS_START,CDS_END,EXON,UNIPARC_ACCESSIONS,' +
			'STRAND,EXON,HGVS_C,HGVS_P,HGVS_G,DISEASE_ASSOCIATIONS,PROTEIN_ANNOTATIONS,COLOCATED_VARIANTS\n';
		Object.keys(searchResults).forEach((inputStr) => {
			searchResults[inputStr].rows.forEach((variant) => {
				if (variant.variation != null) {
					outputCsv = outputCsv + this.getCSVRow(inputStr, variant);
				}
			});
		});
		// apiResults.data.pepvepvariant.forEach((element) => {
		// 	console.log(element.input);
		// 	element.variants.forEach((variant) => {
		// 		outputCsv = outputCsv + this.getCSVRow(element.input, variant);
		// 	});
		// });
		const url = window.URL.createObjectURL(new Blob([ outputCsv ]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'pepvep-data.csv'); // or any other extension
		document.body.appendChild(link);
		link.click();
	};

	render() {
		const appProps = {
			...this.state,
			handleSearch: this.handleSearch,
			handleDownload: this.handleDownload,
			fetchNextPage: this.fetchNextPage
		};

		return (
			<Switch>
				<Route path={`${BASE_URL}/`} exact render={() => <HomePage {...appProps} />} />
				<Route path={`${BASE_URL}/search`} render={() => <SearchResultsPage {...appProps} />} />
				<Route path={`${BASE_URL}/api-error`} render={() => <APIErrorPage {...appProps} />} />
				<Route
					component={({ location }) => (
						<h3>
							404: Can&lsquo;t find
							{location.pathname}
						</h3>
					)}
				/>
			</Switch>
		);
	}
}

App.propTypes = {
	history: PropTypes.shape({
		push: PropTypes.func
	}).isRequired
};

export default withRouter(App);
