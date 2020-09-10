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
			loading: false
		};
	}

	handleSearch = (input) => {
		console.log('calling client');
		const { history } = this.props;
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
						significances {
							functional {
								features {
									type
									description
									category
									begin
									end
									evidences {
										sourceName
										code
										sourceId
										sourceUrl
										sourceAlternativeUrl
										label
										source {
											id
											url
											alternativeUrl
										}
									}
									ftId
								}
								variationDetails {
									begin
									end
									ids {
										rsId
										dbSNPId
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
										cosmicId
									}
								}
								colocatedVariants {
									description
									wildType
									alternativeSequence
									clinicalSignificances
									sourceType
									polyphenScore
									siftScore
									disease
									nonDisease
									uniprot
									largeScaleStudy
									uncertain
								}
							}
							transcript {
								biotype
								impact
								polyphenPrediction
								polyphenScore
								siftPrediction
								siftScore
								mostSevereConsequence
								consequenceTerms
								pathogenicity
								variationDetails {
									begin
									end
									ids {
										rsId
										dbSNPId
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
										cosmicId
									}
								}
								hgvsg
								hgvsp
								canonical
								codons
								aminoAcids
								enstId
								ensgId
								start
								end
								cosmicId
								dbSNPId
								clinVarIds {
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
								colocatedVariantsCount
								redundantENSTs
								diseaseColocatedVariantsCount
								mutationTasterScore
								mutationTasterPrediction
								lrtPrediction
								lrtScore
							}
							clinical {
								categories
								association {
									name
									description
									dbReferences {
										name
										id
										url
									}
									evidences {
										code
										source {
											name
											id
											url
											alternativeUrl
										}
									}
									disease
								}
								colocatedVariants {
									description
									wildType
									alternativeSequence
									clinicalSignificances
									sourceType
									xrefs {
										name
										id
										url
									}
									polyphenScore
									siftScore
									disease
									nonDisease
									uniprot
									largeScaleStudy
									uncertain
								}
								variationDetails {
									begin
									end
									ids {
										rsId
										dbSNPId
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
										cosmicId
									}
								}
								colocatedVariantsCount
								diseaseColocatedVariantsCount
							}
							structural
							genomic {
								consequencePrediction {
									polyphenPrediction
									polyphenScore
									siftPrediction
									siftScore
									caddPhred
									caddRaw
								}
								variationDetails {
									begin
									end
									ids {
										rsId
										dbSNPId
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
										cosmicId
									}
								}
							}
						}
						gene {
							ensgId
							chromosome
							symbol
							source
							enstId
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
						}
						variation {
							novel
							cosmicId
							dbSNPId
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
								populationFrequencies {
									sourceName
									frequencies {
										label
										value
									}
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
			// uri: 'http://localhost:8091/graphql'
			// uri: 'http://localhost:8080/pepvep-service/graphql'
			uri: 'http://wp-np2-ca:8080/pepvep-service/graphql'
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
					if (element.errors.length > 0) {
						output.errors.push(element.errors);
					}
					if (output.results[element.input] === undefined && element.variants.length > 0) {
						if (element.variants.errors !== undefined && element.variants.errors.length > 0) {
							output.errors.push(element.variants.errors);
							element.variants.errors = null;
						}
						output.results[element.input] = {
							key: element.input,
							input: element.input,
							rows: element.variants
						};
					}
					console.log('output ' + output.results);
					// this.props.loading = false;
				});

				this.setState({
					searchTerm: input,
					searchResults: output.results,
					errors: output.errors,
					loading: false
				});

				history.push('search');
			});
		console.log('calling client complete');
	};

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
		if (variant.significances.structural != null && variant.significances.structural.ligands.length > 0) {
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

		var interactions = '';
		if (variant.significances.structural != null && variant.significances.structural.interactions.length > 0) {
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

		if (variant.significances.structural != null) {
			allStructures = Object.keys(variant.significances.structural.allStructures).join(',');
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
				outputCsv = outputCsv + this.getCSVRow(inputStr, variant);
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
			handleDownload: this.handleDownload
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
