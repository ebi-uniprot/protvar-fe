import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidv1 } from 'uuid';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';
import { Fragment } from 'react';

const PopulationFrequencyBlock = (props) => {
	const { data } = props;

	let gnomAD = null;
	let oneK = null;

	let dataNew = [];
	var freq1 = {};
	freq1.sourceName = '1000Genomes';
	freq1.label = 'MAF';
	freq1.value = 0.0023;
	var freq2 = {};
	freq2.sourceName = 'gnomAD';
	freq2.label = 'MAF';
	freq2.value = 0.0045;
	dataNew.push(freq2);

	if (data) {
		gnomAD =
			data.gnomAD &&
			Object.keys(data.gnomAD).reduce((all, key) => {
				if (data.gnomAD[key].value) {
					all.push(
						<li key={uuidv1()}>
							<span className="frequency-label">
								{data.gnomAD[key].label}
								:
							</span>
							{data.gnomAD[key].value}
						</li>
					);
				}

				return all;
			}, []);

		oneK =
			data['1000Genomes'] &&
			Object.keys(data['1000Genomes']).reduce((all, key) => {
				if (data['1000Genomes'][key].value) {
					all.push(
						<li key={uuidv1()}>
							<span className="frequency-label">
								{data['1000Genomes'][key].label}
								:
							</span>
							{data['1000Genomes'][key].value}
						</li>
					);
				}

				return all;
			}, []);
	}

	return (
		<Fragment>
			<b>Population Frequency</b>

			<div className="associated-disease-list">
				{dataNew.forEach((data) => {
					<li key={uuidv1()}>
						{data.sourceName} - {data.label}:{data.value}
					</li>;
				})}
			</div>
		</Fragment>
		// <SignificancesColumn header="Population Frequency">
		// 	<SignificanceDataLine label="gnomAD" value={gnomAD ? <ul>{gnomAD}</ul> : <span>Not reported</span>} />

		// 	<SignificanceDataLine
		// 		label="1000 Genomes"
		// 		value={oneK && oneK.length > 0 ? <ul>{oneK}</ul> : <span>Not reported</span>}
		// 	/>
		// </SignificancesColumn>
	);
};

PopulationFrequencyBlock.propTypes = {
	data: PropTypes.shape({
		gnomAD: PropTypes.shape({}),
		'1000Genomes': PropTypes.shape({})
	})
};

PopulationFrequencyBlock.defaultProps = {
	data: {}
};

export default PopulationFrequencyBlock;
