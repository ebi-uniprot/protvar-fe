// StatsTable.tsx
import React from 'react';
import "./StatsTable.css"
import {useStats} from "../../../context/StatsContext";

const StatsTable: React.FC = () => {
  const { getStat } = useStats();
  return (
    <div className="stats-main">
      <h6>Key Stats for Current Release</h6>
      <table className="stats-table">
        <thead>
        <tr>
          <th>Source</th>
          <th>Version</th>
          <th>Data type</th>
          <th>Number</th>
          <th>Last updated</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>UniProt</td>
          <td>{process.env.REACT_APP_UNIPROT}</td>
          <td>Canonical sequences</td>
          <td>{formatNumber(getStat("uniprot_canonical_count")?.value)}</td>
          <td>{formatDate(getStat("uniprot_canonical_count")?.created)}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>Alternative isoforms</td>
          <td>{formatNumber(getStat("alternative_isoform_count")?.value)}</td>
          <td></td>
        </tr>
        <tr>
          <td>Ensembl</td>
          <td>{process.env.REACT_APP_ENSEMBL}</td>
          <td>Transcript sequences</td>
          <td>{formatNumber(getStat("ensembl_transcript_count")?.value)}</td>
          <td>{formatDate(getStat("ensembl_transcript_count")?.created)}</td>
        </tr>
        <tr>
          <td>RefSeq</td>
          <td></td>
          <td>Accessions</td>
          <td>{formatNumber(getStat("refseq_id_count")?.value)}</td>
          <td>{formatDate(getStat("refseq_id_count")?.created)}</td>
        </tr>

        <tr>
          <td colSpan={5}></td>
        </tr>

        <tr>
          <td>dbSNP</td>
          <td>{process.env.REACT_APP_DBSNP}</td>
          <td>IDs</td>
          <td>{formatNumber(getStat("dbsnp_id_count")?.value)}</td>
          <td>{formatDate(getStat("dbsnp_id_count")?.created)}</td>
        </tr>
        <tr>
          <td>ClinVar</td>
          <td>{process.env.REACT_APP_CLINVAR}</td>
          <td>IDs</td>
          <td>{formatNumber(getStat("clinvar_total_count")?.value)}</td>
          <td>{formatDate(getStat("clinvar_total_count")?.created)}</td>
        </tr>
        <tr>
          <td>COSMIC</td>
          <td>{process.env.REACT_APP_COSMIC}</td>
          <td>IDs</td>
          <td>{formatNumber(getStat("cosmic_id_count")?.value)}</td>
          <td>{formatDate(getStat("cosmic_id_count")?.created)}</td>
        </tr>
        <tr>
          <td>gnomAD</td>
          <td>{process.env.REACT_APP_GNOMAD}</td>
          <td>Allele frequency</td>
          <td>{formatNumber(getStat("allele_freq_count")?.value)}</td>
          <td>{formatDate(getStat("allele_freq_count")?.created)}</td>
        </tr>

        <tr>
          <td colSpan={5}></td>
        </tr>


        <tr>
          <td>AlphaMissense</td>
          <td>May 2024</td>
          <td>Score</td>
          <td>{formatNumber(getStat("alphamissense_count")?.value)}</td>
          <td>{formatDate(getStat("alphamissense_count")?.created)}</td>
        </tr>

        <tr>
          <td>EVE</td>
          <td>Dec 2022</td>
          <td>Score</td>
          <td>{formatNumber(getStat("eve_count")?.value)}</td>
          <td>{formatDate(getStat("eve_count")?.created)}</td>
        </tr>

        <tr>
          <td>ESM-1b</td>
          <td></td>
          <td>Score</td>
          <td>{formatNumber(getStat("esm_count")?.value)}</td>
          <td>{formatDate(getStat("esm_count")?.created)}</td>
        </tr>

        <tr>
          <td>Conservation</td>
          <td></td>
          <td>Score</td>
          <td>{formatNumber(getStat("conservation_count")?.value)}</td>
          <td>{formatDate(getStat("conservation_count")?.created)}</td>
        </tr>

        <tr>
          <td colSpan={5}></td>
        </tr>

        <tr>
          <td>CADD</td>
          <td>{process.env.REACT_APP_CADD}</td>
          <td>Prediction</td>
          <td>{formatNumber(getStat("coding_cadd")?.value)}</td>
          <td>{formatDate(getStat("coding_cadd")?.created)}</td>
        </tr>

        <tr>
          <td>Stability</td>
          <td>May 2024</td>
          <td>Prediction</td>
          <td>{formatNumber(getStat("foldx_total")?.value)}</td>
          <td>{formatDate(getStat("foldx_total")?.created)}</td>
        </tr>

        <tr>
          <td>Pockets</td>
          <td>May 2024</td>
          <td>Prediction</td>
          <td>{formatNumber(getStat("pocket_total")?.value)}</td>
          <td>{formatDate(getStat("pocket_total")?.created)}</td>
        </tr>

        <tr>
          <td>Interfaces</td>
          <td>May 2024</td>
          <td>Prediction</td>
          <td>{formatNumber(getStat("interaction_total")?.value)}</td>
          <td>{formatDate(getStat("interaction_total")?.created)}</td>
        </tr>

        </tbody>
      </table>
    </div>
  );
};


// Helper function to format numbers with commas
export const formatNumber = (number?: number) => {
  return number ? new Intl.NumberFormat().format(number) : '';
};

const formatDate = (dateString?: string) => {
  if (!dateString)
    return ''
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(date);
};

export default StatsTable;
