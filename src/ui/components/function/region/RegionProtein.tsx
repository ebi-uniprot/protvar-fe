import RegionProteinProps from "./RegionProteinProps";
import { EmptyElement } from '../../../../constants/ConstElement';
import {Comment} from "../../../../types/Comment";
import React from "react";

function RegionProtein(props: RegionProteinProps & {
  title: string;
  detailComponentGenerator: (comment: Comment) => React.JSX.Element;
}) {
  const { expandedRegionKey, comments, toggleProteinRegion, detailComponentGenerator, title } = props;
  const components = comments.map(detailComponentGenerator).filter(element => element !== EmptyElement);

  if (components.length <= 0) {
    return EmptyElement;
  }

  const isExpanded = expandedRegionKey === title;

  return (
    <div className="protein-info-item">
      <button
        type="button"
        className="collapsible"
        onClick={() => toggleProteinRegion(title)}
        aria-expanded={isExpanded}
      >
        <i className="bi bi-chevron-right chevron-icon"></i>
        <span className="protein-info-title">{title}</span>
        <span className="count-badge">{components.length}</span>
      </button>

      <div className={`collapsible-anim${isExpanded ? ' open' : ''}`}>
        <div className="protein-info-content">
          {components}
        </div>
      </div>
    </div>
  );
}

export default RegionProtein;