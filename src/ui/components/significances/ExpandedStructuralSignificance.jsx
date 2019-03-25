import React from 'react';
import PropTypes from 'prop-types';

const ExpandedStructuralSignificance = (props) => {
  const { data } = props;
  return (
    <tr>
      <td colSpan="11">
        <span className="expanded-section-title">Structural Significances</span>
        {props.detailsLink}

        <ul className="column-list">
          {data.map(s => (
            <li>
              <a href={`https://www.ebi.ac.uk/pdbe/entry/pdb/${s.id}`} target="_blank">{s.id}</a>
            </li>
          ))}
        </ul>
      </td>
    </tr>
  );
};

ExpandedStructuralSignificance.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    method: PropTypes.string,
    range: PropTypes.arrayOf(PropTypes.number),
  })),
  detailsLink: PropTypes.element.isRequired,
};

ExpandedStructuralSignificance.defaultProps = {
  data: {},
};

export default ExpandedStructuralSignificance;
