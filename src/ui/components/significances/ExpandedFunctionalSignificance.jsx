
import React from 'react';
import PropTypes from 'prop-types';

import ColocatedDomainsAndSitesBlock from './ColocatedDomainsAndSitesBlock';
import ColocatedVariantsBlock from './ColocatedVariantsBlock';
import ColocatedPTMsBlock from './ColocatedPTMsBlock';
import ColocatedMoleculeProcessing from './ColocatedMoleculeProcessing';

const ExpandedFunctionalSignificance = (props) => {
  const { data, detailsLink } = props;
console.log("functional props:", data);
  return (
    <tr>
      <td colSpan="16">
        <span className="expanded-section-title">Functional Protein Level Impact</span>
        {detailsLink}

        <div className="significances-groups">

          <ColocatedDomainsAndSitesBlock data={data.features} />

          <ColocatedVariantsBlock data={data} />

          <ColocatedPTMsBlock data={data.features} />

          <ColocatedMoleculeProcessing data={data.features} />

          {/* <div className="column">
            <b>General Function</b>

            { data.features
              .filter(f => [
                'CHAIN',
                'DOMAIN',
                'MUTAGEN',
                'SIGNAL',
                'PEPTIDE',
              ].includes(f.type))
              .map(feature => (
                <div
                  className="significance-data-block"
                  key={`general-function-wrapper-${feature.featureId}-${feature.description}`}
                >
                  <span className="positional-feature-type">
                    {feature.typeDescription}
                    :
                  </span>
                  {' '}
                  <span>{feature.description}</span>

                  {(feature.featureId)
                      && (
                      <div>
                        <span className="positional-feature-id">Feature ID:</span>
                        &nbsp;
                        <span>{feature.featureId}</span>
                      </div>
                      )
                    }

                  <div className="positional-feature-position">
                    <span>
                      Start:
                      {feature.begin}
                    </span>
                    {(feature.begin !== feature.end)
                      ? (
                        <span>
                          End:
                          {feature.end}
                        </span>
                      )
                      : null}
                  </div>

                  {(feature.evidences.length > 0)
                    ? (
                      <span className="publications-label">
                        {feature.evidences.length}
                        {' '}
                        Publication(s)
                      </span>
                    )
                    : null}
                </div>
              ))}

          </div> */ }

          {/* <div className="column">
            <b>Functional Sites</b>

            { data.features
              .filter(f => [
                'ACT_SITE',
                'METAL',
                'SITE',
                'INIT_MET',
                'TRANSIT',
                'TOPO_DOM',
                'TRANSMEM',
                'REPEAT',
                'CA_BIND',
                'ZN_FING',
                'DNA_BIND',
                'NP_BIND',
                'COILED',
                'MOTIF',
                'COMPBIAS',
                'BINDING',
                'LIPID',
                'NON_STD',
                'PROPEP',
              ].includes(f.type))
              .map(feature => (
                <div
                  className="significance-data-block"
                  key={`functional-sites-wrapper-${feature.featureId}-${feature.type}`}
                >
                  <span className="positional-feature-type">
                    {feature.typeDescription}
                    :
                  </span>
                  {' '}
                  <span>{feature.description}</span>

                  <div className="positional-feature-position">
                    <span>
                      Start:
                      {feature.begin}
                    </span>
                    {(feature.begin !== feature.end)
                      ? (
                        <span>
                          End:
                          {feature.end}
                        </span>
                      )
                      : null}
                  </div>

                  {(feature.evidences.length > 0)
                    ? (
                      <span className="publications-label">
                        {feature.evidences.length}
                        {' '}
                        Publication(s)
                      </span>
                    )
                    : null}
                </div>
              ))}
          </div> */}

          {/* <div className="column">
            <b>Post Translational Modifications</b>

            { data.features
              .filter(f => [
                'MOD_RES',
                'CARBOHYD',
                'DISULFID',
                'CROSSLINK',
              ].includes(f.type))
              .map(feature => (
                <div
                  className="significance-data-block"
                  key={`PTM-wrapper-${feature.featureId}`}
                >
                  <span className="positional-feature-type">
                    {feature.typeDescription}
                    :
                  </span>
                  {' '}
                  <span>{feature.description}</span>

                  <div className="positional-feature-position">
                    <span>
                      Start:
                      {feature.begin}
                    </span>
                    {(feature.begin !== feature.end)
                      ? (
                        <span>
                          End:
                          {feature.end}
                        </span>
                      )
                      : null}
                  </div>

                  {(feature.evidences.length > 0)
                    ? (
                      <span className="publications-label">
                        {feature.evidences.length}
                        {' '}
                        Publication(s)
                      </span>
                    )
                    : null}
                </div>
              ))}
          </div> */}

          {/* <div className="column">
            <b>Structural Elements</b>

            { data.features
              .filter(f => ['HELIX', 'STRAND']
                .includes(f.type))
              .map(feature => (
                <div
                  className="significance-data-block"
                  key={`structural-elements-wrapper-${feature.featureId}`}
                >
                  <span className="positional-feature-type">
                    {feature.typeDescription}
                    :
                  </span>
                  {' '}
                  <span>{feature.description}</span>

                  <div className="positional-feature-position">
                    <span>
                      Start:
                      {feature.begin}
                    </span>
                    {(feature.begin !== feature.end)
                      ? (
                        <span>
                          End:
                          {feature.end}
                        </span>
                      )
                      : null}
                  </div>

                  {(feature.evidences.length > 0)
                    ? (
                      <span className="publications-label">
                        {feature.evidences.length}
                        {' '}
                        Publication(s)
                      </span>
                    )
                    : null}
                </div>
              ))}
          </div> */}
        </div>
      </td>
    </tr>
  );
};

ExpandedFunctionalSignificance.propTypes = {
  data: PropTypes.shape({
    features: PropTypes.arrayOf(PropTypes.shape({
      begin: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string,
      end: PropTypes.string,
      evidences: PropTypes.arrayOf(PropTypes.shape({})),
      type: PropTypes.string,
      typeDescription: PropTypes.string,
    })),
  }),
  detailsLink: PropTypes.element.isRequired,
};

ExpandedFunctionalSignificance.defaultProps = {
  data: {},
};

export default ExpandedFunctionalSignificance;
