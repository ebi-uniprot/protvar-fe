import React, { Component, Fragment } from 'react';
import protvistaStructure from 'protvista-structure';
import { v1 as uuidv1 } from 'uuid';
import { ExternalLink } from 'franklin-sites';

class ProteinStructure extends Component {
	constructor(props) {
		super(props);

		if (!window.customElements.get('protvista-structure')) {
			window.customElements.define('protvista-structure', protvistaStructure);
		}

		this.state = {
			pdbId: null,
			openGroup: null,
			alphaFoldStructure: false
		};
	}

	toggleDetails = (group) => {
		const { openGroup } = this.state;

		this.setState({
			openGroup: openGroup === group ? null : group
		});
	};

	changeStructure(pdbid) {
		this.setState({
			pdbId: pdbid,
			alphaFoldStructure: false
		});
	}
	getStructureRow(str, pdbId) {
		var pdbUrl = 'https://www.ebi.ac.uk/pdbe/entry/pdb/' + str.pdb_id;
		let rowClass = 'clickable-row';
		if (pdbId === str.pdb_id) {
			rowClass = 'clickable-row active';
		}
		let chains = str.chain_id.sort();
		return (
			<Fragment>
				<tr className={rowClass} onClick={(e) => this.changeStructure(str.pdb_id)}>
					<td className="small">
						<a href={pdbUrl} target="_blank" rel="noreferrer">
							<u>{str.pdb_id}</u>
						</a>
					</td>
					<td className="small">{chains.join()}</td>
					<td className="small">
						{str.start}-{str.end}
					</td>
					<td className="small">{str.resolution}</td>
					<td className="small">{str.experimental_method}</td>
				</tr>
			</Fragment>
		);
	}

	getStructureDataTable(structural, pdbId) {
		var structureRows = new Map();
		var rows = [];
		if (structural !== undefined) {
			structural.forEach((str) => {
				let pdbId = str.pdb_id;
				if (structureRows.get(pdbId) !== undefined) {
					let existingRow = structureRows.get(pdbId);
					existingRow.chain_id.push(str.chain_id);
					structureRows.set(pdbId, existingRow);
				} else {
					let newStr = {};
					var chainId = [];
					chainId.push(str.chain_id);
					newStr.chain_id = chainId;
					newStr.pdb_id = str.pdb_id;
					newStr.unp_start = str.unp_start;
					newStr.unp_end = str.unp_end;
					newStr.resolution = str.resolution;
					newStr.experimental_method = str.experimental_method;
					newStr.start = str.start;
					newStr.end = str.end;
					structureRows.set(pdbId, newStr);
				}
			});
			structureRows.forEach((row) => {
				rows.push(this.getStructureRow(row, pdbId));
			});
		}
		return rows;
	}

	getProtVistaStructure(accession, pos, pdbId) {
		let pdb = this.state.pdbId;
		if (pdb === null || pdb === undefined) {
			pdb = pdbId;
		}
		let position = pos + ':' + pos;
		return (
			<td colSpan="13" className="expanded-row">
				<div className="significances-groups">
					<div className="column">
						<protvista-structure accession={accession} structureid={pdb} highlight={position} />
					</div>
				</div>
			</td>
		);
	}

	protvistaStructure(isoform, structural, pdbId) {
		if (structural !== null && structural !== undefined && structural.length > 0) {
			let pdb = this.state.pdbId;
			if (pdb === null || pdb === undefined) {
				pdb = pdbId;
			}
			let pdbkbUrl = 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/' + isoform;
			return (
				<Fragment>
					{/* <b>Experimental Structure : </b> */}
					<br />
					<div className="tableFixHead">
						<ExternalLink url={pdbkbUrl}>More information</ExternalLink>
						<table>
							<thead>
								<tr>
									<th colSpan="6">Experimental Structure</th>
								</tr>
								<tr>
									{/* <th>details</th> */}
									<th>pdb id</th>
									<th>chain</th>
									<th>PDB Pos</th>
									<th>resolution</th>
									<th>Method</th>
								</tr>
							</thead>
							<tbody>{this.getStructureDataTable(structural, pdb)}</tbody>
						</table>
					</div>
				</Fragment>
			);
		} else {
			return null;
		}
	}

	getStructure(isoform, aaPos, pdbId) {
		return this.getProtVistaStructure(isoform, aaPos, pdbId);
	}

	toggleAlphaFoldStructure(isoform, aaPos, alphaFoldStructureId) {
		this.setState({
			pdbId: alphaFoldStructureId,
			alphaFoldStructure: true
		});
		// return this.getProtVistaStructure(isoform, aaPos, alphaFoldStructure);
	}

	getAlphaFoldStructure(alphaFoldStructureId, aaPos, isoform, pdbId) {
		let alphaFoldUrl = 'https://alphafold.ebi.ac.uk/entry/' + isoform;
		let rowClass = 'clickable-row';
		if (alphaFoldStructureId === this.state.pdbId || pdbId === null) {
			rowClass = 'clickable-row active';
		}
		return (
			<div>
				<table>
					<tbody>
						<tr>
							<th colSpan="4">Predicted Structure</th>
						</tr>
						<tr>
							<th>Source</th>
							<th>Identifier</th>
							<th>Position</th>
						</tr>
						<tr
							className={rowClass}
							onClick={(e) => this.toggleAlphaFoldStructure(isoform, aaPos, alphaFoldStructureId)}
						>
							<td className="small">AlphaFold</td>
							<td className="small">
								<a href={alphaFoldUrl} target="_blank" rel="noreferrer">
									<u>{alphaFoldStructureId}</u>
								</a>
							</td>
							<td className="small">{aaPos}</td>
						</tr>
					</tbody>
				</table>

				{this.getModelConfidence(pdbId)}
			</div>
		);
	}

	getModelConfidence(pdbId) {
		let alphaFoldStructure = this.state.alphaFoldStructure;
		if (alphaFoldStructure || pdbId === null) {
			return (
				<div className="search-results-legends">
					<strong>Model Confidence</strong>
					<br />
					<ul>
						<li key={uuidv1()}>
							<span className="legend-icon button--legends button--legends--high" />
							Very high (pLDDT &gt; 90)
						</li>
						<li key={uuidv1()}>
							<span className="legend-icon button--legends button--legends--confident" />
							Confident (90 &gt; pLDDT &gt; 70)
						</li>
						<li key={uuidv1()}>
							<span className="legend-icon button--legends button--legends--low" />
							Low (70 &gt; pLDDT &gt; 50)
						</li>
						<li key={uuidv1()}>
							<span className="legend-icon button--legends button--legends--verylow" />
							Very low (pLDDT &lt; 50)
						</li>
					</ul>

					<p>
						AlphaFold produces a per-residue confidence score (pLDDT) between 0 and 100. Some regions with
						low pLDDT may be unstructured in isolation.
					</p>
				</div>
			);
		}
	}

	render() {
		const { structural, isoform, aaPos, pdbId, alphaFoldStructureId } = this.props;
		let structureid = pdbId;
		if (pdbId === null) {
			structureid = alphaFoldStructureId;
			// this.toggleAlphaFoldStructure(isoform, aaPos, alphaFoldStructureId);
		}

		return (
			<tr>
				{this.getProtVistaStructure(isoform, aaPos, structureid)}
				<td colSpan="5" className="expanded-row">
					{this.protvistaStructure(isoform, structural, pdbId)}
					<br />
					{this.getAlphaFoldStructure(alphaFoldStructureId, aaPos, isoform, pdbId)}
				</td>
			</tr>
		);
	}
}

export default ProteinStructure;
