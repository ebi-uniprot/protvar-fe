import DefaultPageLayout from "../layout/DefaultPageLayout";
import React, {useEffect} from "react";
import {API_URL, PV_FTP, TITLE} from "../../constants/const";
import "./ReleasePage.css"

function ReleasePageContent() {
  //var today = new Date();
  //var dd = String(today.getDate()).padStart(2, '0');
  //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //var yyyy = today.getFullYear();
  useEffect(() => {
    document.title = 'Release - ' + TITLE;
  }, []);

  return <div className="container" style={{padding: '10px'}}>


    <h5>ProtVar Release</h5>
    Upcoming release: UniProt 2024_03
    <table style={{width: 'auto'}}>
      <thead>
      <tr>
        <th>Component</th>
        <th>Version</th>
        <th>Last update</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="small"><a href={process.env.PUBLIC_URL} target="_blank"
                                 rel="noreferrer">UI</a></td>
        <td className="small">1.2</td>
        <td className="small">June 1, 2024</td>
      </tr>
      <tr>
        <td className="small"><a href={API_URL} target="_blank"
                                 rel="noreferrer">API</a></td>
        <td className="small">1.2</td>
        <td className="small">May 28, 2024</td>
      </tr>
      <tr>
        <td className="small"><a href={PV_FTP} target="_blank"
                                 rel="noreferrer">FTP</a></td>
        <td className="small"></td>
        <td className="small">May 28, 2024</td>
      </tr>
      </tbody>
    </table>


    <h5>Data</h5>
    <h6 title="Genomic-protein coordinate mapping">Coordinate mapping</h6>
    Last update: Dec 2023
    <table style={{width: 'auto'}}>
      <thead>
      <tr>
        <th>Sequence source</th>
        <th>Version</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="small">UniProt</td>
        <td className="small">2023_05</td>
      </tr>
      <tr>
        <td className="small">Ensembl</td>
        <td className="small">109</td>
      </tr>
      </tbody>
    </table>

    <h6>Variant ID</h6>
    <table style={{width: 'auto'}}>
      <thead>
      <tr>
        <th>Source</th>
        <th>Version</th>
        <th>Last update</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="small">dbSNP</td>
        <td className="small">155</td>
        <td className="small"></td>
      </tr>
      <tr>
        <td className="small">ClinVar</td>
        <td className="small">20230723</td>
        <td className="small">July 2023</td>
      </tr>
      <tr>
        <td className="small">COSMIC</td>
        <td className="small">rel v98</td>
        <td className="small">March 2023</td>
      </tr>
      </tbody>
    </table>

    <h6>Scores and predictions</h6>
    <table style={{width: 'auto'}}>
      <thead>
      <tr>
        <th>Algorithm</th>
        <th>Version</th>
        <th>Last update</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="small">Conservation</td>
        <td className="small"></td>
        <td className="small"></td>
      </tr>
      <tr>
        <td className="small">Stability</td>
        <td className="small"></td>
        <td className="small">May 28, 2024</td>
      </tr>
      <tr>
        <td className="small">CADD</td>
        <td className="small">v1.6</td>
        <td className="small"></td>
      </tr>
      <tr>
        <td className="small">AlphaMissense</td>
        <td className="small"></td>
        <td className="small">May 2024</td>
      </tr>
      <tr>
        <td className="small">EVE</td>
        <td className="small"></td>
        <td className="small">Dec 2022</td>
      </tr>
      <tr>
        <td className="small">ESM-1b</td>
        <td className="small"></td>
        <td className="small">May 2024</td>
      </tr>
      <tr>
        <td className="small">Pockets</td>
        <td className="small">v2</td>
        <td className="small">May 28, 2024</td>
      </tr>
      <tr>
        <td className="small">Interfaces</td>
        <td className="small">v1</td>
        <td className="small">May 28, 2024</td>
      </tr>
      </tbody>
    </table>

    <h5>Statistics</h5>

    <div className="grid-container">
      <StatsCard main="Genomic-protein mapping" subt="166,077,832"/>
      <StatsCard main="SwissProt proteins mapped" subt="19,038 (>93%)"/>
      <StatsCard main="Stability predictions" subt="208,792,558"/>
      <StatsCard main="Protein-protein interactions" subt="134,527"/>
      <StatsCard main="Pockets" subt="103,026"/>
    </div>
  </div>
}

interface StatsCardProps {
  main: string;
  subt: string;
}

function StatsCard(props: StatsCardProps) {
  return <div className="stats">
    <div className="content">
      <div className="main">{props.main}</div>
      <div className="sub">{props.subt}</div>
    </div>
  </div>
}

function ReleasePage() {
  return <DefaultPageLayout content={<ReleasePageContent/>}/>
}

export default ReleasePage;