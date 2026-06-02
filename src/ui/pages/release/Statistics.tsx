// Statistics.tsx
import React from 'react';
import StatsTable from "./StatsTable";
import {StatsDisplayGroup} from "./StatsDisplay";
import {Stats} from "../../../types/Stats";

const Statistics: React.FC = () => {
  return (
    <div className="statistics">
      <h5>
        ProtVar {process.env.REACT_APP_PV}
      </h5>

      <StatsGrid />
      <StatsTable/>
      <StatsDisplayGroup groupBy={"type" as keyof Stats} />
    </div>
  );
};

export function StatsGrid() {
  return <div className="grid-container">
    <StatsCard label="Genomic–protein mapping" value="169,448,264" change="3M+" /> {/*"166,077,832"*/}
    <StatsCard label="SwissProt proteins mapped" value="19,198" sub=">93% coverage" change="160" /> {/*"119,038"*/}
    <StatsCard label="Variant IDs" value="1,005,152,518" sub="dbSNP · ClinVar · COSMIC" change="40M+" />
    <StatsCard label="gnomAD allele frequencies" value="52,176,766" sub="coding SNV and multi-SNV" />
    <StatsCard label="Stability predictions" value="208,792,558" />
    <StatsCard label="Protein–protein interactions" value="68,756" /> {/*af2complexes_interaction*/}
    <StatsCard label="Pocket predictions" value="109,599 / 547,401" sub="high confidence / total" /> {/*pocket_v2*/}
  </div>
}

interface StatsCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  change?: React.ReactNode;
}

export function StatsCard({label, value, sub, change}: StatsCardProps) {
  return <div className="stat-card">
    <div className="stat-card-label">{label}</div>
    <div className="stat-card-value">{value}</div>
    {sub && <div className="stat-card-sub">{sub}</div>}
    {change && <div className="stat-card-change"><i className="bi bi-caret-up-fill" /> {change}</div>}
  </div>;
}

export default Statistics;