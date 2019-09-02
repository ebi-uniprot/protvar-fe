import React from 'react';
import PropTypes from 'prop-types';

import { v1 as uuidv1 } from 'uuid';

import SignificanceDataLine from './SignificanceDataLine';
import PublicationsList from '../other/PublicationsList';

const ColocatedFeatureDataBlock = (props) => {
  const { data } = props;
  const {
    begin,
    end,
    type,
    description,
    evidences,
  } = data;

  const publicationsLinks = [];

  if (evidences) {
    evidences.forEach((e) => {
      if (e.sourceUrl) {
        publicationsLinks
          .push(
            ( // this extra parans is to satisfy ESLint
              <li key={uuidv1()}>
                <a
                  href={`${e.sourceUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${e.sourceName}: ${e.sourceId}`}
                </a>
              </li>
            ),
          );
      }
    });
  }

  return (
    <div
      className="significance-data-line-group"
      key={`domain-sites-${begin}-${end}`}
    >
      <SignificanceDataLine
        label="Type"
        value={type}
      />

      <SignificanceDataLine
        label="Description"
        value={description}
        alternativeLabelStyle
      />

      <SignificanceDataLine
        label="aa position"
        value={`${begin}-${end}`}
        alternativeLabelStyle
      />

      {(publicationsLinks.length > 0) && (
      <PublicationsList
        title={`${publicationsLinks.length} Evidence(s)`}
        items={<ul>{publicationsLinks}</ul>}
      />
      )}
    </div>
  );
};

ColocatedFeatureDataBlock.propTypes = {
  data: PropTypes.shape({
    begin: PropTypes.string,
    end: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    evidences: PropTypes.arrayOf(PropTypes.shape({
      sourceName: PropTypes.string,
      sourceUrl: PropTypes.string,
    })),
  }),
};

ColocatedFeatureDataBlock.defaultProps = {
  data: {},
};

export default ColocatedFeatureDataBlock;
