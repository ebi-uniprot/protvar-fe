import DefaultPageLayout from "../layout/DefaultPageLayout";
import React, {useEffect} from "react";
import {API_URL, PV_FTP, TITLE} from "../../constants/const";
import "./ReleasePage.css"
import Spaces from "../elements/Spaces";

function ReleasePageContent() {
  //var today = new Date();
  //var dd = String(today.getDate()).padStart(2, '0');
  //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //var yyyy = today.getFullYear();
  useEffect(() => {
    document.title = `Release | ${TITLE}`;
  }, []);

  return <div className="container" style={{padding: '10px'}}>

    <h5>ProtVar {process.env.REACT_APP_PV} <small>{process.env.REACT_APP_PV_REL}</small></h5>

    <div className="grid-container">
      <StatsCard main="Genomic-protein mapping" subt="169,448,264" change={<><br/><i
        className="bi bi-caret-up-fill up-col"></i> 3M+</>}/> {/*"166,077,832"*/}
      <StatsCard main="SwissProt proteins mapped" subt="19,198 (>93%)" change={<><br/><i
        className="bi bi-caret-up-fill up-col"></i> 160</>}/>  {/*"119,038 (>93%)"*/}
      <StatsCard main="Stability predictions" subt="208,792,558"/>
      <StatsCard main="Protein-protein interactions" subt="68,756"/> {/*af2complexes_interaction*/}
      <StatsCard main="Pockets" subt="547,401"/> {/*pocket_v2*/}
    </div>

    Application Versions
    <table style={{width: 'auto'}}>
      <thead>
      <tr>
        <th>App</th>
        <th>Version</th>
        <th>Last updated</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="small"><a href={process.env.PUBLIC_URL} target="_blank"
                                 rel="noreferrer">UI</a></td>
        <td className="small">{process.env.REACT_APP_UI}</td>
        <td className="small">Feb 2025</td>
      </tr>
      <tr>
        <td className="small"><a href={API_URL} target="_blank"
                                 rel="noreferrer">API</a></td>
        <td className="small">{process.env.REACT_APP_API}</td>
        <td className="small">Feb 2025</td>
      </tr>
      <tr>
        <td className="small"><a href={PV_FTP} target="_blank"
                                 rel="noreferrer">FTP</a></td>
        <td className="small">-</td>
        <td className="small">Feb 2025</td>
      </tr>
      </tbody>
    </table>


    Data Releases
    <table style={{width: 'auto'}}>
      <thead>
      <tr>
        <th>Release</th>
        <th>Data</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="small">Data Release 1.0</td>
        <td className="small">Dec 2023</td>
      </tr>
      <tr>
        <td className="small">Data Release {process.env.REACT_APP_DATA}</td>
        <td className="small">Feb 2025</td>
      </tr>
      </tbody>
    </table>

    Core mapping data
    <ul>
      <li>Affects genomic-protein coordinate mapping, genome assembly conversion, and various ID mappings.</li>
      <li>Source Versions:
        <ul>
          <li>UniProt: {process.env.REACT_APP_UNIPROT} </li>
          <li>Ensembl: {process.env.REACT_APP_ENSEMBL} </li>
        </ul>
      </li>
    </ul>

    <hr/>
    Variant Lookup <br/>

    Supports variant search using known IDs.

    <table style={{width: 'auto'}}>
      <thead>
      <tr>
        <th>Database</th>
        <th>Version</th>
        <th>Last updated</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="small">dbSNP</td>
        <td className="small">{process.env.REACT_APP_DBSNP}</td>
        <td className="small">Feb 2025</td>
      </tr>
      <tr>
        <td className="small">ClinVar</td>
        <td className="small">{process.env.REACT_APP_CLINVAR}</td>
        <td className="small">Feb 2025</td>
      </tr>
      <tr>
        <td className="small">COSMIC</td>
        <td className="small">{process.env.REACT_APP_COSMIC}</td>
        <td className="small">Feb 2025</td>
      </tr>
      <tr>
        <td className="small">gnomAD</td>
        <td className="small">{process.env.REACT_APP_GNOMAD}</td>
        <td className="small">Feb 2025</td>
      </tr>
      </tbody>
    </table>

    Scores and predictions
    <table style={{width: 'auto'}}>
      <thead>
      <tr>
        <th>Score/Prediction</th>
        <th>Version</th>
        <th>Last updated</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="small">CADD</td>
        <td className="small">{process.env.REACT_APP_CADD}</td>
        <td className="small">Feb 2025</td>
      </tr>
      <tr>
        <td className="small">AlphaMissense</td>
        <td className="small">-</td>
        <td className="small">May 2024</td>
      </tr>
      <tr>
        <td className="small">EVE</td>
        <td className="small">-</td>
        <td className="small">Dec 2022</td>
      </tr>
      <tr>
        <td className="small">ESM-1b</td>
        <td className="small">-</td>
        <td className="small">May 2024</td>
      </tr>
      <tr>
        <td className="small">Conservation</td>
        <td className="small">-</td>
        <td className="small">-</td>
      </tr>
      <tr>
        <td className="small">Stability</td>
        <td className="small">-</td>
        <td className="small">Feb 2025</td>
      </tr>
      <tr>
        <td className="small">Pockets</td>
        <td className="small">v2</td>
        <td className="small">May 28, 2024</td>
      </tr>
      <tr>
        <td className="small">Interfaces</td>
        <td className="small">v2</td>
        <td className="small">May 28, 2024</td>
      </tr>
      </tbody>
    </table>

  </div>
}

interface StatsCardProps {
  main: string;
  subt: string;
  change?: React.ReactNode;
}

function StatsCard(props: StatsCardProps) {
  return <div className="stats">
    <div className="content">
      <div className="main">{props.main}</div>
      <div className="sub">{props.subt}
        {props.change ?? <>
          <br/><Spaces count={2} />
          {props.change}
        </>}
      </div>
    </div>
  </div>
}

function ReleasePage() {
  return <DefaultPageLayout content={<ReleasePageContent/>}/>
}

export default ReleasePage;