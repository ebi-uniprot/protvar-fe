import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { v1 as uuidv1 } from 'uuid';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';

const ColocatedVariantsBlock = (props) => {
  const {
    data,
  } = props;

  const DataBlock = (dataProps) => {
    const { colocated, meta } = dataProps;

    const {
      wildType,
      alternativeSequence,
      featureId,
      association,
      sourceType,
      xrefs,
    } = colocated;

    const {
      begin,
      end,
    } = meta;

    const variantIDs = {};

    xrefs.forEach((cr) => {
      if (!variantIDs[cr.name]) {
        variantIDs[cr.name] = {
          id: cr.id,
          url: cr.url,
        };
      }
    });

    const idList = [];

    if (variantIDs.UniProt) {
      idList.push(variantIDs.UniProt);
    }

    if (variantIDs.ClinVar) {
      idList.push(variantIDs.ClinVar);
    }

    if (variantIDs.dbSNP) {
      idList.push(variantIDs.dbSNP);
    }

    let idListComponent = idList
      .map((id, index) => {
        let el;

        if (id.url) {
          el = (
            <a
              key={id.url}
              href={id.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {id.id}
            </a>
          );
        } else {
          el = <span key={id.id}>{id.id}</span>;
        }

        const comma = <Fragment key={uuidv1()}>, </Fragment>;

        return (index > 0)
          ? [comma, el]
          : el;
      });

    if (idList.length === 0) {
      idListComponent = undefined;
    }

    const diseaseNames = association && association
      .map(a => a.name)
      .join(',');

    let source;

    if (featureId) {
      source = (sourceType === 'mixed' || sourceType === 'large_scale_study')
        ? 'UniProt, Large Scale Study'
        : 'UniProt';
    } else {
      source = 'Large Scale Study';
    }

    return (
      <div className="significance-data-line-group">
        <SignificanceDataLine
          label="aa change and position"
          value={`${wildType}>${alternativeSequence}, ${begin}-${end}`}
        />

        <SignificanceDataLine
          label="ID"
          value={idListComponent}
          alternativeLabelStyle
        />

        <SignificanceDataLine
          label="Description"
          value={null}
          alternativeLabelStyle
        />

        <SignificanceDataLine
          label="Disease"
          value={diseaseNames}
          alternativeLabelStyle
        />

        <SignificanceDataLine
          label="source"
          value={source}
          alternativeLabelStyle
        />
      </div>
    );
  };

  DataBlock.propTypes = {
    colocated: PropTypes.shape({}),
    meta: PropTypes.shape({}),
  };

  DataBlock.defaultProps = {
    colocated: {},
    meta: {},
  };

  return (
    <SignificancesColumn
      header="Colocated Variants"
    >
      {data.colocatedVariants
        .map(cv => <DataBlock key={uuidv1()} colocated={cv} meta={data.variationDetails} />)
      }
    </SignificancesColumn>
  );
};

ColocatedVariantsBlock.propTypes = {
  data: PropTypes.shape({
    colocatedVariants: PropTypes.arrayOf(PropTypes.shape({})),
    variationDetails: PropTypes.shape({}),
  }),
};

ColocatedVariantsBlock.defaultProps = {
  data: {},
};

export default ColocatedVariantsBlock;
