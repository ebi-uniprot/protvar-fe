import RegionProteinProps from "./RegionProteinProps";
import { EmptyElement } from "../../../../constants/ConstElement";
import { INTACT_URL } from "../../../../constants/ExternalUrls";
import {IntAct, IntActComment} from "../../../../types/Comment";

interface IntActsProps extends RegionProteinProps {
  accession: string
}

function IntActs(props: IntActsProps) {
  const { expandedRegionKey, comments, toggleProteinRegion, accession } = props;
  const intActComments = comments.map(c => c as IntActComment);

  if (intActComments.length > 0 && intActComments[0].interactions && intActComments[0].interactions.length > 0) {
    let gene: string = "";
    let interactor = '';
    const key = 'interactions-' + accession;

    intActComments[0].interactions.forEach((intAct: IntAct) => {
      if (intAct.accession1 === accession) {
        interactor = intAct.interactor1;
        const geneInteractor = intAct.accession2 + '(' + intAct.gene + ')';
        if (gene === "") {
          gene = geneInteractor;
        } else {
          gene = gene + ' | ' + geneInteractor;
        }
      }
    });

    if (gene !== "") {
      const isExpanded = expandedRegionKey === key;

      return (
        <div className="protein-info-item">
          <button
            type="button"
            className="collapsible"
            onClick={() => toggleProteinRegion(key)}
            aria-expanded={isExpanded}
          >
            <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} chevron-icon`}></i>
            <span className="protein-info-title">Interactions</span>
          </button>

          {isExpanded && (
            <div className="protein-info-content">
              <div className="info-row">
                <span className="info-label">Protein(gene)</span>
                <span className="info-value">{gene}</span>
              </div>
              <div className="info-row">
                <span className="info-label">IntAct</span>
                <a href={INTACT_URL + interactor} target="_blank" rel="noreferrer" className="ext-link">
                  {interactor}
                </a>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
  return EmptyElement;
}

export default IntActs;