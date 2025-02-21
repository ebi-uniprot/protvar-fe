// StatsTable.tsx
import React from 'react';
import "./StatsTable.css"

const StatsTable: React.FC = () => {
  return (
    <>
      <section className="section">
        <h6>Application Versions</h6>
        <table className="stats-table">
          <thead>
          <tr>
            <th>App</th>
            <th>Version</th>
            <th>Last Updated</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><a href={process.env.PUBLIC_URL} target="_blank" rel="noreferrer">UI</a></td>
            <td>{process.env.REACT_APP_UI}</td>
            <td>Feb 2025</td>
          </tr>
          <tr>
            <td><a href={process.env.API_URL} target="_blank" rel="noreferrer">API</a></td>
            <td>{process.env.REACT_APP_API}</td>
            <td>Feb 2025</td>
          </tr>
          <tr>
            <td><a href={process.env.PV_FTP} target="_blank" rel="noreferrer">FTP</a></td>
            <td>-</td>
            <td>Feb 2025</td>
          </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h6>Data Releases</h6>
        <table className="stats-table">
          <thead>
          <tr>
            <th>Release</th>
            <th>Data</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Data Release 1.0</td>
            <td>Dec 2023</td>
          </tr>
          <tr>
            <td>Data Release {process.env.REACT_APP_DATA}</td>
            <td>Feb 2025</td>
          </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h6>Core Mapping Data</h6>
        <ul>
          <li>Affects genomic-protein coordinate mapping, genome assembly conversion, and various ID mappings.</li>
          <li>
            Source Versions:
            <ul>
              <li>UniProt: {process.env.REACT_APP_UNIPROT}</li>
              <li>Ensembl: {process.env.REACT_APP_ENSEMBL}</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="section">
        <h6>Variant Lookup</h6>
        <p>Supports variant search using known IDs.</p>
        <table className="stats-table">
          <thead>
          <tr>
            <th>Database</th>
            <th>Version</th>
            <th>Last Updated</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>dbSNP</td>
            <td>{process.env.REACT_APP_DBSNP}</td>
            <td>Feb 2025</td>
          </tr>
          <tr>
            <td>ClinVar</td>
            <td>{process.env.REACT_APP_CLINVAR}</td>
            <td>Feb 2025</td>
          </tr>
          <tr>
            <td>COSMIC</td>
            <td>{process.env.REACT_APP_COSMIC}</td>
            <td>Feb 2025</td>
          </tr>
          <tr>
            <td>gnomAD</td>
            <td>{process.env.REACT_APP_GNOMAD}</td>
            <td>Feb 2025</td>
          </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h6>Scores and Predictions</h6>
        <table className="stats-table">
          <thead>
          <tr>
            <th>Score/Prediction</th>
            <th>Version</th>
            <th>Last Updated</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>CADD</td>
            <td>{process.env.REACT_APP_CADD}</td>
            <td>Feb 2025</td>
          </tr>
          <tr>
            <td>AlphaMissense</td>
            <td>-</td>
            <td>May 2024</td>
          </tr>
          <tr>
            <td>EVE</td>
            <td>-</td>
            <td>Dec 2022</td>
          </tr>
          <tr>
            <td>ESM-1b</td>
            <td>-</td>
            <td>May 2024</td>
          </tr>
          <tr>
            <td>Conservation</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Stability</td>
            <td>-</td>
            <td>Feb 2025</td>
          </tr>
          <tr>
            <td>Pockets</td>
            <td>v2</td>
            <td>May 28, 2024</td>
          </tr>
          <tr>
            <td>Interfaces</td>
            <td>v1*</td>
            <td>May 28, 2024</td>
          </tr>
          </tbody>
        </table>
        *<small>reverted to v1 (from v2) - will be updated in future release</small>
      </section>
    </>
  );
};

export default StatsTable;
