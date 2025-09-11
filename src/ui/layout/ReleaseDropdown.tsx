import React from 'react';
import './ReleaseDropdown.css';

const ReleaseDropdown: React.FC = () => {
  return (
    <div className="release-dropdown">
      <button className="release-dropdown-btn">
        ProtVar {process.env.REACT_APP_PV}{' '}
        <small>{process.env.REACT_APP_UNIPROT}</small>
      </button>
      <ul className="release-dropdown-content">
        <li>UI {process.env.REACT_APP_UI}</li>
        <li>API {process.env.REACT_APP_API}</li>
        <li className="data-release-header">Data release {process.env.REACT_APP_DATA}</li>
        <li className="data-item">UniProt {process.env.REACT_APP_UNIPROT}</li>
        <li className="data-item">Ensembl {process.env.REACT_APP_ENSEMBL}</li>
        <li className="data-item">CADD {process.env.REACT_APP_CADD}</li>
        <li className="data-item">dbSNP {process.env.REACT_APP_DBSNP}</li>
        <li className="data-item">COSMIC {process.env.REACT_APP_COSMIC}</li>
        <li className="data-item">ClinVar {process.env.REACT_APP_CLINVAR}</li>
        <li className="data-item">gnomAD {process.env.REACT_APP_GNOMAD}</li>
      </ul>
    </div>
  );
};

export default ReleaseDropdown;