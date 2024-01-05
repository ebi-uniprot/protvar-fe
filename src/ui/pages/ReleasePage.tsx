import DefaultPageLayout from "../layout/DefaultPageLayout";
import React, {useEffect} from "react";
import {TITLE} from "../../constants/const";

function ReleasePageContent() {
  //var today = new Date();
  //var dd = String(today.getDate()).padStart(2, '0');
  //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //var yyyy = today.getFullYear();
  useEffect(() => {
    document.title = 'Release - ' + TITLE;
  }, []);

  return <div className="container">
    <h4>Release info and statistics</h4>

    <div className="text">
      <table>
      <tbody>
        <tr>
          <td>UniProt Release</td>
          <td>{process.env.REACT_APP_UNIPROT_RELEASE}</td>
        </tr>
        <tr>
          <td>Ensembl Release</td>
          <td>{process.env.REACT_APP_ENSEMBL_RELEASE}</td>
        </tr>
        <tr>
          <td>CADD Version</td>
          <td>{process.env.REACT_APP_CADD_VERSION}</td>
        </tr>
        <tr>
          <td>dbSNP Build</td>
          <td>{process.env.REACT_APP_DBSNP_BUILD}</td>
        </tr>
        <tr>
          <td colSpan={2}><b>Statistics</b></td>
        </tr>
        <tr>
          <td>166,077,832</td>
          <td>genomic-to-protein mappings</td>
        </tr>
        <tr>
          <td>19,038</td>
          <td>SwissProt proteins mapped (&gt93%)</td>
        </tr>
        <tr>
          <td>134,527</td>
          <td>protein interactions</td>
        </tr>
        <tr>
          <td>103,026</td>
          <td>pockets</td>
        </tr>
        <tr>
          <td>208,792,558</td>
          <td>Foldx predictions</td>
        </tr>
        <tr>
          <td>2023.03.09</td>
          <td>COSMIC</td>
        </tr>
        <tr>
          <td>2022.12.07</td>
          <td>EVE</td>
        </tr>
        <tr>
          <td>2023.07.23</td>
          <td>ClinVar</td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
}

function ReleasePage() {
  return <DefaultPageLayout content={<ReleasePageContent />} />
}
export default ReleasePage;