import DefaultPageLayout from "../layout/DefaultPageLayout";
import React, {useEffect} from "react";
import {TITLE} from "../../constants/const";
import "./ReleasePage.css"

function ReleasePageContent() {
  //var today = new Date();
  //var dd = String(today.getDate()).padStart(2, '0');
  //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //var yyyy = today.getFullYear();
  useEffect(() => {
    document.title = 'Release - ' + TITLE;
  }, []);

  return <div className="container">
    <h5>ProtVar App</h5>

    <div className="grid-container">
      <StatsCard main="ProtVar UI v1.2" subt="Last updated: May 2024"/>
      <StatsCard main="ProtVar API v1.2" subt="Last updated: May 2024"/>
    </div>

    <h5>Data Release</h5>
    <h6>Coordinate mapping</h6>
    <div className="grid-container">
      <StatsCard main="Genomic-protein mapping" subt="Last updated: Dec 2023"/>
    </div>

    <h6>ID mapping</h6>
    <div className="grid-container">
      <StatsCard main="dbSNP" subt={process.env.REACT_APP_DBSNP_BUILD!}/>
      <StatsCard main="ClinVar" subt="2023.07.23"/>
      <StatsCard main="COSMIC" subt="2023.03.09"/>
    </div>

    <h6>Sequence sources</h6>
    <div className="grid-container">
      <StatsCard main="UniProt" subt={process.env.REACT_APP_UNIPROT_RELEASE!}/>
      <StatsCard main="Ensembl" subt={process.env.REACT_APP_ENSEMBL_RELEASE!}/>
    </div>


    <h5>Statistics</h5>

    <h6>Mapping</h6>
    <div className="grid-container">
      <StatsCard main="Genomic-protein" subt="166,077,832"/>
      <StatsCard main="SwissProt proteins mapped" subt="19,038 (>93%)"/>
    </div>

    <h6>Scores and predictions</h6>
    <div className="grid-container">
      <StatsCard main="CADD" subt={process.env.REACT_APP_CADD_VERSION!} />
      <StatsCard main="EVE" subt="2022.12.07"/>
      <StatsCard main="Protein-protein interactions" subt="134,527"/>
      <StatsCard main="Pockets" subt="103,026"/>
      <StatsCard main="Foldx predictions" subt="208,792,558"/>
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