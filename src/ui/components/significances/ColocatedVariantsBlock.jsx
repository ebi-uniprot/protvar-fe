import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';

const ColocatedVariantsBlock = (props) => {
  const {
    data,
  } = props;

  const DataBlock = (props) => {
    const {
      wildType,
      alternativeSequence,
      featureId,
      clinicalSignificances,
      association,
      sourceType,
      xrefs,
    } = props.colocated;

    const {
      begin,
      end,
      ids,
    } = props.meta;

    const variantIDs = {};

    xrefs.map((cr) => {
      if (!variantIDs[cr.name]) {
        variantIDs[cr.name] = {
          id: cr.id,
          url: cr.url,
        };
      }
    });

    // if (!variantIDs['UniProt'].url) {
    //   variantIDs['UniProt'].url = 
    // }

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
          el = <a href={id.url}>{id.id}</a>;
        } else {
           el = <span>{id.id}</span>;
        }

        return (index > 0)
          ? [', ', el]
          : el;
      });

    if (idList.length === 0) {
      idListComponent = undefined;
    }

    // const variantIDs = [];

    // if (ids.rsId) {
    //   variantIDs.push(ids.rsId);
    // }

    // if (ids.clinVarId) {
    //   variantIDs.push(`ClinVar: ${ids.clinVarId}`);
    // }

    // if (ids.cosmicId) {
    //   variantIDs.push(`COSMIC: ${ids.cosmicId}`);
    // }

    // if (featureId) {
    //   variantIDs.push(`UniProt: ${featureId}`);
    // }

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
          alternativeLabelStyle={true}
        />
 
        <SignificanceDataLine
          label="Description"
          value={null}
          alternativeLabelStyle={true}
        />

        <SignificanceDataLine
          label="Disease"
          value={diseaseNames}
          alternativeLabelStyle={true}
        />

        {/* <SignificanceDataLine
          label="Pathogenicity"
          value={clinicalSignificances}
          alternativeLabelStyle={true}
        /> */}

        <SignificanceDataLine
          label="source"
          value={source}
          alternativeLabelStyle={true}
        />
      </div>
    );
  }

  return (
    <SignificancesColumn
      header="Colocated Variants"
    >
      {data.colocatedVariants.map(cv => <DataBlock colocated={cv} meta={data.variationDetails}/>)}
    </SignificancesColumn>
  );
}

ColocatedVariantsBlock.propTypes = {

};

export default ColocatedVariantsBlock;