
import React from 'react';

const ExpandedPositionalSignificance = props => {
  const { data } = props;
  return (
    <tr>
      <td colSpan="11">
        <h4>Positional Significances</h4>
        <br />
        { data.features.map(feature => {
          return (
            <div>
              <b>Type:</b> <span>{feature.type}</span>
              <br />
              <b>Category:</b> <span>{feature.category}</span>
              <br />
              <b>Begin/End:</b> <span>{feature.begin} / {feature.end}</span>
              <br />
              <p><b>Description:</b> {feature.description}</p>
              {(0 < feature.evidences.length)
                ? (<div>
                    <b>Evidences:</b>
                      <ul>
                        {feature.evidences.map(e => <li>ID: {e.sourceId} [{e.sourceName}]</li>)}
                      </ul>
                    </div>)
                : null}
              <hr />
            </div>
          );
        })}
      </td>
    </tr>
  );
}

export default ExpandedPositionalSignificance;
