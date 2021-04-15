import React from 'react';
import PropTypes from 'prop-types';

import PopulationFrequencyBlock from './PopulationFrequencyBlock';
import ConsequencePredictionBlock from './ConsequencePredictionBlock';
import VariantDetailsBlock from './VariantDetailsBlock';
import PublicationsList from '../other/PublicationsList';
import {
	detailsLinkPropTypes,
	detailsLinkDefaultProps,
	variationIDsPropTypes,
	variationPropTypes,
	variationDefaultProps
} from '../../other/sharedProps';
import { DropdownButton } from 'franklin-sites';

const ExpandedGenomicSignificance = (props) => {
	const { data, variation, detailsLink, gene } = props;
	var frequencyList = [];
	if (data.populationFrequencies != null) {
		frequencyList = data.populationFrequencies.map((l) => (
			<li key="{l.sourceName}">
				<b>{l.sourceName}</b> - {l.frequencies[0].label}:{l.frequencies[0].value}
			</li>
		));
	}

	return (
		<tr>
			<td colSpan="16">
				<span className="expanded-section-title">Genome Level Impact</span>
				{detailsLink}

				<div className="significances-groups" key="genomic-significances-group-wrapper">
					{/* Starts here */}
					<div className="column">
						<b>Population Frequency</b>
						<div className="associated-disease-list">
							<div className="associated-disease">
								<br />

								<PublicationsList
									title={`${frequencyList.length} Frequencies(s)`}
									items={<ul>{frequencyList}</ul>}
								/>
							</div>
						</div>
					</div>
					{/* Ends here */}
					{/* <PopulationFrequencyBlock data={data.populationFrequencies} /> */}
					<ConsequencePredictionBlock data={data.consequencePrediction} />
					<VariantDetailsBlock data={data} variation={variation} gene={gene} />
				</div>
			</td>
		</tr>
	);
};

ExpandedGenomicSignificance.propTypes = {
	detailsLink: detailsLinkPropTypes,
	data: PropTypes.shape({
		populationFrequencies: PropTypes.arrayOf(PropTypes.shape({})),
		consequencePrediction: PropTypes.shape({}),
		variationDetails: variationIDsPropTypes
	}),
	variation: variationPropTypes,
	gene: PropTypes.shape({
		ensgId: PropTypes.string
	})
};

ExpandedGenomicSignificance.defaultProps = {
	data: {},
	variation: variationDefaultProps,
	detailsLink: detailsLinkDefaultProps,
	gene: {}
};

export default ExpandedGenomicSignificance;
