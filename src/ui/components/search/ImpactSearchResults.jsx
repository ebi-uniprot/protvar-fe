import React, { Component } from 'react';
import Button from '../../elements/form/Button';
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import DownloadModal from '../modal/DownloadModal';
import { Redirect } from 'react-router';
import ResultTable from './ResultTable'

class ImpactSearchResults extends Component {
	constructor(props) {
		super(props);

		this.state = {
			caddLoaded: false,
		};
	}

	componentDidUnMount() {
		window.onbeforeunload = function () {
			this.onUnload();
			return <Redirect to="/home" />;
		}.bind(this);
	}

	fetchNextPage = (next) => {
		var fetchNextPage = this.props.fetchNextPage;
		var page = this.props.page;
		if (next === 1) {
			page.currentPage = page.currentPage + 1;
		} else {
			page.currentPage = page.currentPage - 1;
		}
		this.setState({
			loading: true,
			caddLoaded: false
		});
		let isFileselected = false;
		if (this.props.file !== null) isFileselected = true;
		fetchNextPage(this.props.file, page, isFileselected, true);
	};

	bulkDownload = (event) => {
		var handleBulkDownload = this.props.handleBulkDownload;
		handleBulkDownload(event, this.props.file);
	};

	getInvalidInputSection(invalidInputs) {
		if (invalidInputs !== undefined && invalidInputs !== null && invalidInputs.length > 0) {
			return (
				<div className="alert alert-danger alert-dismissible fade show">
					Few of inputs are not valid
				</div>
			);
		}
	}

	changePageSize(pageSize) {
		var fetchNextPage = this.props.fetchNextPage;
		var page = this.props.page;
		if (pageSize !== page.itemsPerPage) {
			page.itemsPerPage = pageSize.value;
			page.currentPage = 1;

			this.setState({
				loading: true,
				caddLoaded: false
			});
			let isFileselected = false;
			if (this.props.file !== null) isFileselected = true;
			fetchNextPage(this.props.file, page, isFileselected, true);
		}
	}

	render() {
		const rows = this.props.rows;
		const page = this.props.page;
		const totalPages = Math.ceil(page.totalItems / page.itemsPerPage);
		const invalidInputs = this.props.invalidInputs;
		const file = this.props.file;
		const searchTerm = this.props.searchTerm;
		let totalItems = 0;
		if (file != null) {
			totalItems = page.totalItems;
		} else {
			totalItems = searchTerm.length;
		}
		return (
			<div
				className="search-results"
				id="divRoot"
				ref={(node) => {
					this.node = node;
				}}
			>
				{this.getInvalidInputSection(invalidInputs)}

				<table className="table-header">
					<tbody>
						<tr>
							<td colSpan="1">
								<DownloadModal searchTerms={searchTerm} file={file} totalItems={totalItems} />
							</td>

							<td colSpan="1">
								{page === undefined || page.currentPage === 1 ? (
									<Button onClick={() => null} className="button-new button-disabled">
										&laquo; Previous
									</Button>
								) : (
									<Button onClick={() => this.fetchNextPage(0)}>&laquo; Previous</Button>
								)}
							</td>
							<td colSpan="1">
								{page.currentPage} of {totalPages}
							</td>
							<td colSpan="1">
								{page === undefined || !page.nextPage ? (
									<Button onClick={() => null} className="button-new button-disabled">
										Next &raquo;
									</Button>
								) : (
									<Button onClick={() => this.fetchNextPage(1)}>Next &raquo;</Button>
								)}
							</td>
							<td colSpan="1">
								<Dropdown
									placeholder="Pages"
									options={[25, 50, 100]}
									value={page.itemsPerPage}
									onChange={(value) => this.changePageSize(value)}
								/>
							</td>
						</tr>
					</tbody>
				</table>
				<ResultTable invalidInputs={this.props.invalidInputs} mappings={rows}/>
			</div>
		);
	}
}

export default ImpactSearchResults;
