import React from 'react';

const SearchResultsLegends = () => (
  <div className="search-results-legends">
    <ul>
      <li>
        <div className="cadd-score cadd-score--green">
            29
        </div>
        <span>CADD Score: Likely Benign</span>
      </li>

      <li>
        <div className="cadd-score cadd-score--red">
            30
        </div>
        <span>CADD Score: Likely Deleterious</span>
      </li>
    </ul>

    <ul>
      <li>
        <div className="legend-icon button--significances button--transcript">
            T
        </div>
        <span>Transcript Impact</span>
      </li>

      <li>
        <div className="legend-icon button--significances button--structural">
            S
        </div>
        <span>Structural Impact</span>
      </li>

      <li>
        <div className="legend-icon button--significances button--positional">
            F
        </div>
        <span>Functional Impact</span>
      </li>

      <li>
        <div className="legend-icon button--significances button--clinical">
            C
        </div>
        <span>Clinical Impact</span>
      </li>

      <li>
        <div className="legend-icon button--significances button--genomic">
            G
        </div>
        <span>Genomic Impact</span>
      </li>
    </ul>
  </div>
);

export default SearchResultsLegends;
