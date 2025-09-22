import React from 'react';
import './VersionInfo.css';

const VersionInfo: React.FC = () => {
  return (
    <div className="version-info">
      <button className="version-trigger">
        <span>ProtVar {process.env.REACT_APP_PV}</span>
        <small>{process.env.REACT_APP_UNIPROT}</small>
      </button>
      <div className="version-panel">
        <div>UI {process.env.REACT_APP_UI}</div>
        <div>API {process.env.REACT_APP_API}</div>
        <hr />
        <div className="data-header">Data Release {process.env.REACT_APP_DATA}</div>
        <div>UniProt {process.env.REACT_APP_UNIPROT}</div>
        <div>Ensembl {process.env.REACT_APP_ENSEMBL}</div>
        <div>CADD {process.env.REACT_APP_CADD}</div>
        <div>dbSNP {process.env.REACT_APP_DBSNP}</div>
        <div>COSMIC {process.env.REACT_APP_COSMIC}</div>
        <div>ClinVar {process.env.REACT_APP_CLINVAR}</div>
        <div>gnomAD {process.env.REACT_APP_GNOMAD}</div>
      </div>
    </div>
  );
};

export default VersionInfo;