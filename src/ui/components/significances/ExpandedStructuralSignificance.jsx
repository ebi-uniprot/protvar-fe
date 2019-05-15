import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExpandedStructuralSignificance extends Component {

  state = {
    structure: null,
  };

  structureChange = ({ target }) => {
    this.setState({
      structure: target.value,
    });
  };

  render() {
    const { structure } = this.state;
    const { data, detailsLink } = this.props;
    let imageUrl;

    const bestStructures = data.structures
      .reduce((all, current) => {
        return all.concat(current.best_structures);
      },[]);

    const ligands = data.ligands
      .reduce((all, current) => {
        return all.concat(current.ligands);
      },[]);

    const interactions = data.interactions
      .reduce((all, current) => {
        return all.concat(current.partners);
      },[]);

    if (!structure && bestStructures.length > 0) {
      imageUrl = `https://www.ebi.ac.uk/pdbe/static/entry/${bestStructures[0]}_single_entity_1_image-200x200.png`;
    } else if (structure) {
      imageUrl = `https://www.ebi.ac.uk/pdbe/static/entry/${structure}_single_entity_1_image-200x200.png`;
    }

    return (
      <tr>
        <td colSpan="11">
          <span className="expanded-section-title">Structural Significances</span>
          {detailsLink}

          <div className="significances-groups">
            <div className="column">
              <i className="icon icon-functional structural-icon" data-icon="4"></i>
              <div><b>2D Image</b></div>
              {(imageUrl) && <img src={imageUrl} />}
            </div>

            <div className="column">
              <i className="icon icon-conceptual summary-icon structural-icon" data-icon="s"></i>
              <b>Structures ({bestStructures.length})</b>
              {(bestStructures.length > 0) && <select multiple size="5" onChange={e => this.structureChange(e)}>
                {bestStructures.map((s) => {
                    return <option value={s}>{s}</option>
                  })
                };
              </select>}
            </div>

            <div className="column">
              <i className="icon icon-conceptual summary-icon structural-icon" data-icon="b"></i>
              <b>Ligands ({ligands.length})</b>
              {(ligands.length > 0) && <ul data-columns="2">
                {ligands.map(l => <li>{`${l.ligand_name} [${l.ligand_id}]`}</li>)}
              </ul>}
            </div>

            <div className="column">
              <i className="icon icon-conceptual summary-icon structural-icon" data-icon="y"></i>
              <b>Interactions ({interactions.length})</b>
              {(interactions.length > 0) && <ul data-columns="2">
                {interactions.map(i => <li>{i}</li>)}
              </ul>}
            </div>
          </div>
        </td>
      </tr>
    );
  }
};

ExpandedStructuralSignificance.propTypes = {
  data: PropTypes.shape({
    allStructures: PropTypes.objectOf(PropTypes.arrayOf(
      PropTypes.shape({
        chain_id: PropTypes.string,
        residue_range: PropTypes.string,
      }),
    )),
    annotations: PropTypes.arrayOf(PropTypes.shape({
      count_data_resource: PropTypes.number,
      data_resource: PropTypes.arrayOf(PropTypes.string),
      position: PropTypes.number,
      position_code: PropTypes.string,
    })),
    interactions: PropTypes.arrayOf(PropTypes.shape({
      count_partners: PropTypes.number,
      partners: PropTypes.arrayOf(PropTypes.string),
      position: PropTypes.number,
      position_code: PropTypes.string,
    })),
    ligands: PropTypes.arrayOf(PropTypes.shape({
      count_ligands: PropTypes.number,
      ligands: PropTypes.arrayOf(PropTypes.shape({
        ligand_id: PropTypes.string,
        ligand_name: PropTypes.string,
      })),
      position: PropTypes.number,
      position_code: PropTypes.string,
    })),
    structures: PropTypes.arrayOf(PropTypes.shape({
      count_best_structures: PropTypes.number,
      best_structures: PropTypes.arrayOf(PropTypes.string),
      position: PropTypes.number,
      position_code: PropTypes.string,
    })),
  }),
  detailsLink: PropTypes.element.isRequired,
};

ExpandedStructuralSignificance.defaultProps = {
  data: {},
};

export default ExpandedStructuralSignificance;
