import React, { Component, Fragment } from 'react';
import protvistaStructure from 'protvista-structure';
import { v1 as uuidv1 } from 'uuid';

class ProteinStructure extends Component {
	constructor(props) {
		super(props);

		if (!window.customElements.get('protvista-structure')) {
			window.customElements.define('protvista-structure', protvistaStructure);
		}

		this.state = {
			pdbId: null
		};
	}

	changeStructure(pdbid) {
		this.setState({
			pdbId: pdbid
		});
	}
	getStructureRow(str) {
		return (
			<tr className="clickable-row" onClick={(e) => this.changeStructure(str.pdb_id)}>
				<td>{str.pdb_id}</td>
				<td>{str.chain_id}</td>
				<td>
					{str.unp_start}-{str.unp_end}
				</td>
				<td>{str.resolution}</td>
				<td>{str.experimental_method}</td>
			</tr>
		);
	}

	getStructureDataTable(structural) {
		var structureRows = new Map();
		var rows = [];
		if (structural !== undefined) {
			structural.map((str) => {
				let pdbId = str.pdb_id;
				if (structureRows.get(pdbId) !== undefined) {
					let existingRow = structureRows.get(pdbId);
					existingRow.chain_id = existingRow.chain_id + ',' + str.chain_id;
					structureRows.set(pdbId, existingRow);
				} else {
					let newStr = {};
					newStr.chain_id = str.chain_id;
					newStr.pdb_id = str.pdb_id;
					newStr.unp_start = str.unp_start;
					newStr.unp_end = str.unp_end;
					newStr.resolution = str.resolution;
					newStr.experimental_method = str.experimental_method;
					structureRows.set(pdbId, newStr);
				}
			});
			structureRows.forEach((row) => {
				rows.push(this.getStructureRow(row));
			});
		}
		return rows;
	}

	getProtVistaStructure(accession, pos, pdbId) {
		let pdb = this.state.pdbId;
		if (pdb === null || pdb === undefined) {
			pdb = pdbId;
		}
		return (
			<td colSpan="13" className="expanded-row">
				<div className="significances-groups">
					<div className="column">
						<protvista-structure accession={accession} pdb-id={pdb} highlight={pos} />
					</div>
				</div>
			</td>
		);
	}
	getStructuralSignificance(structuralKey, expandedRow, accession, pdbId) {
		// var pdbId = this.state.pdbId;
		var newPos = accession.aaPos + 0;
		var hightlight = accession.aaPos + ':' + newPos;
		if (structuralKey === expandedRow) {
			return (
				<tr>
					{this.getProtVistaStructure(accession.isoform, accession.aaPos, pdbId)}
					<td colSpan="5" className="expanded-row">
						<div className="tableFixHead">
							<table>
								<thead>
									<tr>
										<th>pdb id</th>
										<th>chain</th>
										<th>Range</th>
										<th>resolution</th>
										<th>Method</th>
									</tr>
								</thead>
								<tbody>{this.getStructureDataTable(accession.structural)}</tbody>
							</table>
						</div>
					</td>
				</tr>
			);
		}
	}

	render() {
		const { structural, isoform, aaPos, pdbId } = this.props;
		if (structural !== null && structural !== undefined && structural.length > 0) {
			return (
				<tr>
					{this.getProtVistaStructure(isoform, aaPos, pdbId)}
					<td colSpan="5" className="expanded-row">
						<div className="tableFixHead">
							<table>
								<thead>
									<tr>
										<th>pdb id</th>
										<th>chain</th>
										<th>Range</th>
										<th>resolution</th>
										<th>Method</th>
									</tr>
								</thead>
								<tbody>{this.getStructureDataTable(structural)}</tbody>
							</table>
						</div>
					</td>
				</tr>
			);
		} else {
			return (
				<tr>
					{this.getProtVistaStructure(isoform, aaPos, pdbId)}
					<td colSpan="5" className="expanded-row">
						<div className="tableFixHead">No Structure to display</div>
					</td>
				</tr>
			);
		}
	}
}

export default ProteinStructure;
