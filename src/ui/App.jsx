import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { post } from 'axios';
import PapaParse from 'papaparse';

import HomePage from './pages/home/HomePage';
import SearchResultsPage from './pages/search/SearchResultPage';
import APIErrorPage from './pages/APIErrorPage';
import { API_URL } from '../constants/const';
import {convertApiMappingToTableRecords} from './components/mapping/Convertor'

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userInput: null,
			searchTerm: null,
			searchResults: null,
			errors: null,
			loading: false,
			file: {},
			isFileSelected: false,
			page: {},
			invalidInputs: []
		};
	}

	handleSearch = (inputArr, page) => {
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

		this.setState({
			isFileSelected: false,
			loading: true,
			page: newPage
		});

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
			this.fetchByVCF(inputSubArray, inputArr, null, newPage);
		}
	};

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
		const skipRecord = (pageNumber - 1) * PAGE_SIZE;
		var newPage = {
			currentPage: page.currentPage,
			previousPage: page.previousPage,
			nextPage: false,
			totalItems: page.totalItems,
			itemsPerPage: page.itemsPerPage
		};

		if (isFileSelected) this.fetchFromFile(skipRecord, page, uploadedFile, PAGE_SIZE, loading);
		else {
			this.handleSearch(inputText, newPage);
		}
	};

	fetchFromFile = (skipRecord, page, uploadedFile, pageSize, loading) => {
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
					isFileSelected: true,
					loading: loading
				});
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
						var genes = convertApiMappingToTableRecords(mapping);
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

	createCsvString(rowArr) {
		return rowArr.join(' ');
	}

	render() {
		const searchProps ={
			rows: this.state.searchResults,
			searchTerms: this.state.searchTerm,
			file: this.state.file,
			page: this.state.page,
			fetchNextPage: this.fetchNextPage,
			invalidInputs: this.state.invalidInputs,
			errors: this.state.errors
		}

		return (
			<>
				<Route path="/" exact render={() => <HomePage loading={this.state.loading} fetchResult={this.fetchResult}/>} />
				<Route path="/search" render={() => <SearchResultsPage {...searchProps} />} />
				<Route path="/api-error" render={() => <APIErrorPage />} />
			</>
		);
	}
}

export default withRouter(App);
