import React, { Component, Fragment } from 'react';

import { v1 as uuidv1 } from 'uuid';
import Button from '../../elements/form/Button';
import Modal from '../modal/Modal';
import axios, { post } from 'axios';
import PapaParse from 'papaparse';
import FileSaver from 'file-saver';

class DownloadModel extends Component {
	state = {
		name: '',
		email: '',
		jobName: '',
		function: false,
		variation: false,
		jobSubmitted: false,
		modal: false
	};

	handleChange = (e) => {
		console.log('inside handle change');
		const target = e.target;
		const name = target.name;
		const value = target.value;

		this.setState({
			[name]: value
		});
	};

	handleCheckBox = (e) => {
		console.log('inside handle change');
		const target = e.target;
		const name = target.name;
		const value = target.checked;
		this.setState({
			[name]: value
		});
	};

	handleSubmit = (e) => {
		console.log('inside handle submit');
		this.setState({ name: this.state.modalInputName });
		this.modalClose();
		let totalItems = this.props.totalItems;
		let sendEmail = false;
		if (totalItems > 5) {
			sendEmail = true;
		}
		if (sendEmail) this.sendEmail();
		else this.download();
	};

	download() {
		const file = this.props.file;
		if (file !== null) {
			let inputArr = [];
			PapaParse.parse(file, {
				step: (row, parser) => {
					inputArr.push(row);
				},
				complete: () => {
					// call
				}
			});
		} else {
			const inputArr = this.props.searchTerm;
			const APIUrl =
				`${API_URL}` +
				'/download/download?function=' +
				this.state.function +
				'&variation=' +
				this.state.variation;

			const headers = {
				'Content-Type': 'application/json',

				Accept: '*'
			};

			post(APIUrl, inputArr, {
				headers: headers
			}).then((response) => {
				console.log('response -> ' + response.data);
				// var blob = new Blob(response.data, { type: 'text/csv;charset=utf-8' });
				let blob = new Blob([ response.data ], {
					type: 'application/csv'
				});
				// var file = new File(response.data, 'pepvep.csv', { type: 'text/csv;charset=utf-8' });

				FileSaver.saveAs(blob, 'pepvep.csv');
			});
		}
	}
	sendEmail() {
		const inputArr = this.props.searchTerm;
		const file = this.props.file;
		if (file !== null) {
			const APIUrl =
				`${API_URL}` +
				'/download/file?email=' +
				this.state.email +
				'&name=' +
				this.state.name +
				'&jobName=' +
				this.state.jobName +
				'&function=' +
				this.state.function +
				'&variation=' +
				this.state.variation;

			const formData = new FormData();
			formData.append('file', file);
			const config = {
				headers: {
					'content-type': 'multipart/form-data'
				}
			};
			post(APIUrl, formData, {
				headers: config
			}).then((response) => {
				console.log('response -> ' + response.data);
			});
		} else {
			const APIUrl =
				`${API_URL}` +
				'/download/search?email=' +
				this.state.email +
				'&name=' +
				this.state.name +
				'&jobName=' +
				this.state.jobName +
				'&function=' +
				this.state.function +
				'&variation=' +
				this.state.variation;

			const headers = {
				'Content-Type': 'application/json',
				Accept: '*'
			};
			post(APIUrl, inputArr, {
				headers: headers
			}).then((response) => {
				console.log('response -> ' + response.data);
				response.data.forEach((mapping) => {
					var genes = this.createGenes(mapping);
					mappings.push(genes);
				});
			});
		}
	}
	modalOpen = () => {
		this.setState({ modal: true });
	};

	handleClick = () => {
		if (!this.state.modal) {
			document.addEventListener('click', this.handleOutsideClick, false);
		} else {
			document.removeEventListener('click', this.handleOutsideClick, false);
		}

		this.setState((prevState) => ({
			modal: !prevState.modal
		}));
	};

	modalClose() {
		this.setState({
			modal: false
		});
	}

	handleOutsideClick = (e) => {
		if (!this.node.contains(e.target)) this.handleClick();
	};

	render() {
		let totalItems = this.props.totalItems;
		let sendEmail = false;
		if (totalItems > 5) {
			sendEmail = true;
		}
		return (
			<div
				id="divDownload"
				ref={(node) => {
					this.node = node;
				}}
			>
				<Button onClick={(e) => this.handleClick(e)}>Download</Button>
				<Modal show={this.state.modal} handleClose={(e) => this.handleClick(e)}>
					<h5>Enter Details</h5>
					<div className="form-group">
						<div>
							<ul>
								<li key={uuidv1()} className="new-select">
									<input
										key="function1"
										type="checkbox"
										name="function"
										value={this.state.function}
										onChange={(e) => this.handleCheckBox(e)}
										checked={this.state.function}
									/>
									<label id="item1">Reference Function</label>
								</li>
								<li key={uuidv1()} className="new-select">
									<input
										key="variation1"
										type="checkbox"
										value={this.state.variation}
										name="variation"
										onChange={(e) => this.handleCheckBox(e)}
										checked={this.state.variation}
									/>
									<label id="item2">Population Observation</label>
								</li>
							</ul>

							{sendEmail ? (
								<Fragment>
									<label>
										Name:
										<input
											type="text"
											value={this.state.name}
											name="name"
											onChange={(e) => this.handleChange(e)}
										/>
									</label>
									<label>
										Email:
										<input
											type="text"
											value={this.state.email}
											name="email"
											onChange={(e) => this.handleChange(e)}
										/>
									</label>
									<label>
										Job Name:
										<input
											type="text"
											value={this.state.jobName}
											name="jobName"
											onChange={(e) => this.handleChange(e)}
										/>
									</label>
								</Fragment>
							) : (
								<div />
							)}
						</div>
					</div>

					<Button onClick={(e) => this.handleSubmit(e)} type="button">
						Submit
					</Button>
					<Button onClick={(e) => this.handleClick(e)} type="button">
						close
					</Button>
				</Modal>
			</div>
		);
	}
}

export default DownloadModel;
