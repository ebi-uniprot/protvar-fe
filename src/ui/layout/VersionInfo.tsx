import React from 'react';
import { Link } from 'react-router-dom';
import { RELEASE } from '../../constants/BrowserPaths';

const VersionInfo: React.FC = () => {
  return (
    <div className="version-info">
      <Link to={RELEASE} className="version-pill" title="View release notes">
        UI {process.env.REACT_APP_UI} · API {process.env.REACT_APP_API} · Data {process.env.REACT_APP_DATA}
      </Link>
      <div className="version-panel">
        <div className="data-header">Data release {process.env.REACT_APP_DATA}</div>
        <div>UniProt {process.env.REACT_APP_UNIPROT}</div>
        <div>Ensembl {process.env.REACT_APP_ENSEMBL}</div>
        <div>CADD {process.env.REACT_APP_CADD}</div>
        <div>popEVE {process.env.REACT_APP_POPEVE}</div>
        <div>Missense3D {process.env.REACT_APP_M3D}</div>
        <div>dbSNP {process.env.REACT_APP_DBSNP}</div>
        <div>COSMIC {process.env.REACT_APP_COSMIC}</div>
        <div>ClinVar {process.env.REACT_APP_CLINVAR}</div>
        <div>gnomAD {process.env.REACT_APP_GNOMAD}</div>
      </div>
    </div>
  );
};

export default VersionInfo;