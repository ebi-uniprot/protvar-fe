
import React from 'react';

const ExpandedStructuralSignificance = props => {
  const { data } = props;
  return (
    <tr>
      <td colSpan="11">
        <h4>Structural Significances</h4>
          <ul style={{ columnCount: 6}}>
            {data.map(s => {
              return <li>
                  <a href={`https://www.ebi.ac.uk/pdbe/entry/pdb/${s.id}`} target="_blank">{s.id}</a>
                </li>;
            })}
          </ul>
      </td>
    </tr>
  );
}

export default ExpandedStructuralSignificance;
