import React, { Fragment } from 'react';
import { v1 as uuidv1 } from 'uuid';

const Evidences = (props) => {
	function getEvidence(evidence) {
		return (
			<li key={uuidv1()}>
				<a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer">
					{evidence.id}
				</a>
			</li>
		);
	}

	function getEvidenceForEachSource(sourceName, ids) {
		return (
			// <li key={uuidv1()}>
			<Fragment>
				<b>{sourceName} :</b>
				<ul className="flatList">{ids}</ul>
			</Fragment>
			// </li>
		);
	}
	function getEvidences(evidences) {
		let evidenceList = [];
		let evidenceMap = new Map();
		let evidenceListToRet = [];
		if (evidences !== undefined && evidences !== null && evidences.length > 0) {
			evidences.forEach((evidence) => {
				if (evidence.source !== null && evidence.source !== undefined && evidence.source.id !== null) {
					// let source = evidence.source.name + '-' + evidence.source.id;

					let url = '';
					if (evidence.source.url !== null) {
						url = evidence.source.url;
					}
					let newEvidence = {
						id: evidence.source.id,
						sourceUrl: url
					};
					if (evidenceMap.get(evidence.source.name) !== undefined) {
						evidenceList = evidenceMap.get(evidence.source.name);
						evidenceList.push(newEvidence);
					} else {
						evidenceList = [];
						evidenceList.push(newEvidence);
					}
					evidenceMap.set(evidence.source.name, evidenceList);
				}
			});
			for (let [ key, value ] of evidenceMap) {
				let list = [];
				value.map((val) => list.push(getEvidence(val)));
				evidenceListToRet.push(getEvidenceForEachSource(key, list));
			}
		}
		return evidenceListToRet;
	}

	const { evidences } = props;
	return getEvidences(evidences);
};

export default Evidences;
