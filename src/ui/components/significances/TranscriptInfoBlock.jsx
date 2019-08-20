import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';
import { removeSnakeAndKebabCases } from '../../other/helpers';

const TranscriptInfoBlock = (props) => {
  const {
    data,
  } = props;

  const status = (data.canonical)
    ? 'SELECT'
    : 'Isoform';

  const proteinCoding = () => {
    if (data.enspId && data.aminoAcids) {
      return 'Yes';
    } else if ((data.enspId || data.enstId) && !data.aminoAcids) {
      return 'Yes (but variant falls outside exons)';
    } else if (data.ensgId && (!data.enspId || !data.enstId) && !data.aminoAcids) {
      return 'Yes (but variant in an untranslated region)';
    }
  };

  return (
    <SignificancesColumn
      header="Transcript Info"
    >
      <SignificanceDataLine
        label="Status"
        value={`${status} Transcript`}
      />

      {/* 
      <SignificanceDataLine
        label="Protein-coding"
        value={proteinCoding()}
      />
       */}

      <SignificanceDataLine
        label="Biotype"
        value={removeSnakeAndKebabCases(data.biotype)}
      />

      <SignificanceDataLine
        label="Codon"
        value={data.codons}
      />
    </SignificancesColumn>
  );
}

TranscriptInfoBlock.propTypes = {

};

export default TranscriptInfoBlock;
