import React, { Component } from 'react';
import PropTypes, { any } from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';
import gql from 'graphql-tag';
import { ApolloClient, client, InMemoryCache, ApolloProvider } from '@apollo/client';
import { defaultParser } from '../input-parser';

import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import APIErrorPage from './pages/APIErrorPage';
import { withApollo } from '@apollo/react-hoc';

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
		this.setState({
			loading: true
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
				});

				this.setState({
					searchTerm: input,
					searchResults: output,
					errors: results.data.pepvepvariant[0].errors,
					loading: false
				});

				history.push('search');
			});
		console.log('calling client complete');

		//const apiURI = `${API_URL}/parser`;
		const apiURI = 'http://localhost:8091/pepVepVariants';
		const data = defaultParser(input);
		this.setState({
			loading: false
		});

		/* axios
      .post(apiURI, { input: data })
      .then((response) => {
        const { errors, results } = response.data;
        console.log('>>> search response:', response.data.data);
        this.setState({
          searchTerm: input,
          searchResults: results,
          errors,
          loading: false,
        });

        history.push('search');
      })
      .catch((e) => {
        console.log('Got an axios error:', e);
        history.push('api-error');
      });*/
	};

	handleDownload = () => {
		const { searchTerm } = this.state;

		const apiURI = `${API_URL}/download`;
		const data = defaultParser(searchTerm);
		console.log('handle download clicked');

		axios
			.post(apiURI, {
				input: data,
				responseType: 'blob'
			})
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([ response.data ]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'pepvep-data.csv'); // or any other extension
				document.body.appendChild(link);
				link.click();
			})
			.catch((e) => {
				console.log('Got an axios error:', e);
			});
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
