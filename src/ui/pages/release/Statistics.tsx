// Statistics.tsx
import React from 'react';
import Spaces from "../../elements/Spaces";
import StatsTable from "./StatsTable";
import {StatsDisplayGroup} from "./StatsDisplay";
import {Stats} from "../../../types/Stats";

const Statistics: React.FC = () => {
  return (
    <div className="statistics">
      <h5>
        ProtVar {process.env.REACT_APP_PV} <small>{process.env.REACT_APP_UNIPROT}</small>
      </h5>

      <h6>Highlights</h6>
      <ul>
        <li>Genomic-Protein Mapping Entries: 170M genomic coordinates mapped to protein position</li>
        <li>SwissProt Protein Coverage: &gt;93%</li>
        <li>New Variant IDs: 40 million+ (dbSNP, ClinVar, COSMIC) lookups</li>
        <li>gnomAD Allele Frequencies: 52 million+ coding variants (SNV and multi-SNV)</li>
      </ul>
      <StatsGrid />
      <StatsTable/>
      <StatsDisplayGroup groupBy={"type" as keyof Stats} />
    </div>
  );
};

export function StatsGrid() {
  return <div className="grid-container">
    <StatsCard main={<>Genomic-protein mapping</>} subt="169,448,264" change={<><br/><i
      className="bi bi-caret-up-fill up-col"></i> 3M+</>}/> {/*"166,077,832"*/}
    <StatsCard main={<>SwissProt proteins mapped</>} subt="19,198 (>93%)" change={<><br/><i
      className="bi bi-caret-up-fill up-col"></i> 160</>}/> {/*"119,038 (>93%)"*/}
    <StatsCard main={<>Stability predictions</>} subt="208,792,558"/>
    <StatsCard main={<>Protein-protein interactions</>} subt="68,756"/> {/*af2complexes_interaction*/}
    <StatsCard main={<>Pocket predictions</>} subt={<>109,599 / 547,401<br/><small>High
      Confidence / Total</small></>}/> {/*pocket_v2*/}
  </div>
}

interface StatsCardProps {
  main: React.ReactNode;
  subt: React.ReactNode;
  change?: React.ReactNode;
}

export function StatsCard(props: StatsCardProps) {
  return <div className="stats">
    <div className="content">
      <div className="main">{props.main}</div>
      <div className="sub">{props.subt}
        {props.change ?? <>
          <br/><Spaces count={2}/>
          {props.change}
        </>}
      </div>
    </div>
  </div>
}

export default Statistics;