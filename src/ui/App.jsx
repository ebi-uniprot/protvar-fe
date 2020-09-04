
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
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
    };
  }

 handleSearch = (input) => {
		console.log('calling client');
		const { history } = this.props;
		this.setState({
			loading: true
		});
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
								mostSevereConsequence
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
									xrefs {
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
							variationDetails {
								description
								wildType
								alternativeSequence
								clinicalSignificances
								sourceType
								association {
									name
									description
									xrefs {
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
							proteinColocatedVariants {
								description
								wildType
								alternativeSequence
								clinicalSignificances
								sourceType
								association {
									name
									description
									xrefs {
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
			uri: 'http://localhost:8091/graphql'
		});

		client
			.query({
				query: GET_VARIANTS,
				variables: { params: inputArr }
			})
			.then((results) => {
				console.log(results);

				const output = {
					errors: {},
					results: {}
				};

				const searchResultArr = [];

				results.data.pepvepvariant.forEach((element) => {
					if (output.results[element.input] === undefined) {
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
					searchResults: output,
					apiResults: results,
					errors: results.data.pepvepvariant[0].errors,
					loading: false
				});

				history.push('search');
			});
		console.log('calling client complete');
		this.setState({
			loading: false
		});
	};

	getCSVRow(input, variant) {
		var isAssociatedDisease = 'No';
		var allStructures = '';
		if (variant.significances.clinical.association.length > 0) {
			isAssociatedDisease = 'Yes';
		}
		if (variant.significances.structural != null) {
			allStructures = Object.keys(variant.significances.structural.allStructures).join(',');
		}
		return (
			'"' +
			input +
			'","' +
			'consequences' +
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
			'HGNCID' + // HGNC ID
			'","' +
			variant.gene.ensgId +
			'","' +
			variant.gene.enstId +
			'","' +
			'Protein Coding' + // BioType
			'","' +
			'Moderate' + // IMPACT
			'","' +
			'Missense Variant' + // CONSEQUENCE_TERMS
			'","' +
			variant.protein.accession +
			'","' +
			variant.protein.accession + // Trembl accession
			'","' +
			variant.protein.start +
			'","' +
			variant.protein.end +
			'","' +
			allStructures +
			'","' +
			'' + // LIGANDS
			'","' +
			'' + // STRUCTURAL_INTERACTION_PARTNERS
			'","' +
			variant.protein.variant +
			'","' +
			'","' +
			'"\n'
		);
	}
	handleDownload = () => {
		const { searchTerm, apiResults } = this.state;
		var inputArr = searchTerm.split('\n');
		console.log('handle download clicked');
		var outputCsv =
			'INPUT,MOST_SEVER_CONSEQUENCE,ASSEMBLY,CHROMOSOME,' +
			'GENOMIC_START,GENOMIC_END,ALLELE_STRING,VARIANT_ALLELE,' +
			'GENE_SYMBOL,GENE_SYMBOL_SOURCE,HGNC_ID,GENE_ID,TRANSCRIPT_ID,' +
			'TRANSLATION_ID,BIOTYPE,IMPACT,CONSEQUENCE_TERMS,SWISSPROT_ACCESSIONS,' +
			'TREMBL_ACCESSIONS,PROTEIN_START,PROTEIN_END,STRUCTURES,LIGANDS,' +
			'STRUCTURAL_INTERACTION_PARTNERS,AMINO_ACID_CHANGE,ASSOCIATED_TO_DISEASE,' +
			'DISEASE_CATEGORIES,POLYPHEN_PREDICTION,POLYPHEN_SCORE,MUTATION_TASTER_PREDICTION,' +
			'MUTATION_TASTER_SCORE,LRT_PREDICTION,LRT_SCORE,FATHMM_PREDICTION,' +
			'FATHMM_SCORE,PROVEAN_PREDICTION,PROVEAN_SCORE,CADD_RAW,CADD_PHRED,SIFT_PREDICTION,' +
			'SIFT_SCORE,MUTPRED_SCORE,BLOSUM62,APPRIS,TSL,STRAND,CODONS,CDNA_START,CDNA_END,CDS_START,' +
			'CDS_END,EXON,UNIPARC_ACCESSIONS,HGVS_C,HGVS_P,HGVS_G,DISEASE_ASSOCIATIONS,PROTEIN_ANNOTATIONS,COLOCATED_VARIANTS\n';
		apiResults.data.pepvepvariant.forEach((element) => {
			console.log(element.input);
			element.variants.forEach((variant) => {
				outputCsv = outputCsv + this.getCSVRow(element.input, variant);
			});
		});
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
    };

    return (
      <Switch>
        <Route path={`${BASE_URL}/`} exact render={() => <HomePage {...appProps} />} />
        <Route path={`${BASE_URL}/search`} render={() => <SearchResultsPage {...appProps} />} />
        <Route path={`${BASE_URL}/api-error`} render={() => <APIErrorPage {...appProps} />} />
        <Route component={({ location }) => (
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
    push: PropTypes.func,
  }).isRequired,
};

export default withRouter(App);
