import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StructuralPosition from '../other/StructuralPosition';

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
    const {
      structures,
      allStructures,
      proteinLength,
      ligands,
      position,
    } = data;

    Object.keys(allStructures)
      .forEach((pdbeId) => {
        allStructures[pdbeId]
          .forEach((s) => {
            const [start, end] = s.residue_range
              .split('-');

            s.start = parseInt(start, 10);
            s.end = parseInt(end, 10);
          });
      });

    const bestStructures = structures
      .reduce((all, current) => all.concat(current.best_structures), []);

    const allLigands = ligands
      .reduce((all, current) => all.concat(current.ligands), []);

    const currentStructure = (!structure && bestStructures.length > 0)
      ? bestStructures[0]
      : structure;

    if (structure === null && bestStructures.length === 0) {
      return null;
    }

    const currentStructureDetails = allStructures[currentStructure][0];
    const imageUrl = `https://www.ebi.ac.uk/pdbe/static/entry/${currentStructure}_single_entity_${currentStructureDetails.entity_id}_image-200x200.png`;

    return (
      <tr>
        <td colSpan="11">
          <span className="expanded-section-title">Structural Significances</span>
          {detailsLink}

          <div className="significances-groups">
            <div className="column">
              <i className="icon icon-functional structural-icon" data-icon="4" />
              <div><b>2D Image</b></div>
              {(imageUrl) && <img src={imageUrl} alt="" />}

              <StructuralPosition
                proteinLength={proteinLength}
                position={position}
                structureStart={currentStructureDetails.start}
                structureEnd={currentStructureDetails.end}
              />
            </div>

            <div className="column">
              <i className="icon icon-conceptual summary-icon structural-icon" data-icon="s" />
              <b>
                Structures (
                {bestStructures.length}
                )
              </b>
              {(bestStructures.length > 0) && (
              <select multiple size="5" onChange={e => this.structureChange(e)}>
                {bestStructures
                  .map(s => <option key={`best-structure-${s}`} value={s}>{s}</option>)
                }
                ;
              </select>
              )}
            </div>

            <div className="column">
              <i className="icon icon-conceptual summary-icon structural-icon" data-icon="b" />
              <b>
                Ligands (
                {allLigands.length}
                )
              </b>
              {(allLigands.length > 0) && (
              <ul data-columns="2">
                {allLigands.map(l => <li>{`${l.ligand_name} [${l.ligand_id}]`}</li>)}
              </ul>
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  }
}

ExpandedStructuralSignificance.propTypes = {
  data: PropTypes.shape({
    allStructures: PropTypes.objectOf(PropTypes.arrayOf(
      PropTypes.shape({
        chain_id: PropTypes.string,
        entity_id: PropTypes.string,
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
