
import React from 'react';

const ExpandedPositionalSignificance = props => {
  const { data } = props;
  return (
    <tr>
      <td colSpan="11">
        <h4>Protein Positions Affected</h4>

        <div className="significances-groups">
          <div className="column">
            <b>General Function</b>

            { data.features
                .filter(f => {
                  return ['CHAIN', 'DOMAIN', 'MUTAGEN']
                    .includes(f.type);
                })
                .map(feature => {
              return (
                <div className="significance-data-block">
                  <span className="positional-feature-type">{feature.typeDescription}:</span> <span>{feature.description}</span>

                  <div className="positional-feature-position">
                    <span>Start: {feature.begin}</span>
                    {(feature.begin !== feature.end)
                      ? <span>End: {feature.end}</span>
                      : null}
                  </div>

                  {(0 < feature.evidences.length)
                    ? (<span className="publications-label">
                        {feature.evidences.length} Publication(s)
                      </span>)
                    : null}
                </div>
              );
            })}

          </div>
          <div className="column">
            <b>Functional Sites</b>

            { data.features
                .filter(f => {
                  return [
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
                    'SIGNAL',
                    'PROPEP',
                  ].includes(f.type);
                })
                .map(feature => {
              return (
                <div className="significance-data-block">
                  <span className="positional-feature-type">{feature.typeDescription}:</span> <span>{feature.description}</span>

                  <div className="positional-feature-position">
                    <span>Start: {feature.begin}</span>
                    {(feature.begin !== feature.end)
                      ? <span>End: {feature.end}</span>
                      : null}
                  </div>

                  {(0 < feature.evidences.length)
                    ? (<span className="publications-label">
                        {feature.evidences.length} Publication(s)
                      </span>)
                    : null}
                </div>
              );
            })}
          </div>
          <div className="column">
            <b>Post Translational Modifications</b>

            { data.features
                .filter(f => {
                  return [
                    'MOD_RES',
                    'CARBOHYD',
                    'DISULFID',
                    'CROSSLINK',
                  ].includes(f.type);
                })
                .map(feature => {
              return (
                <div className="significance-data-block">
                  <span className="positional-feature-type">{feature.typeDescription}:</span> <span>{feature.description}</span>

                  <div className="positional-feature-position">
                    <span>Start: {feature.begin}</span>
                    {(feature.begin !== feature.end)
                      ? <span>End: {feature.end}</span>
                      : null}
                  </div>

                  {(0 < feature.evidences.length)
                    ? (<span className="publications-label">
                        {feature.evidences.length} Publication(s)
                      </span>)
                    : null}
                </div>
              );
            })}
          </div>
          <div className="column">
            <b>Structural Elements</b>

            { data.features
                .filter(f => {
                  return ['HELIX', 'STRAND']
                    .includes(f.type);
                })
                .map(feature => {
              return (
                <div className="significance-data-block">
                  <span className="positional-feature-type">{feature.typeDescription}:</span> <span>{feature.description}</span>

                  <div className="positional-feature-position">
                    <span>Start: {feature.begin}</span>
                    {(feature.begin !== feature.end)
                      ? <span>End: {feature.end}</span>
                      : null}
                  </div>

                  {(0 < feature.evidences.length)
                    ? (<span className="publications-label">
                        {feature.evidences.length} Publication(s)
                      </span>)
                    : null}
                </div>
              );
            })}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default ExpandedPositionalSignificance;
