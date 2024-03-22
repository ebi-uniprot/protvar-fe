import DefaultPageLayout from "../layout/DefaultPageLayout";
import React, {useEffect} from "react";
import EMBLLogo from "../../images/EMBL_logo.jpg";
import OTLogo from "../../images/OT_logo.png";
import UniprotLogo from "../../images/uniprot-logo.svg";
import EnsemblLogo from "../../images/ensembl-logo.png";
import PDBeLogo from "../../images/pdbe-logo.png";
import CADDLogo from "../../images/cadd-logo.png";
import EVELogo from "../../images/eve-logo.svg";
import GoogleDMLogo from "../../images/Google_DeepMind_Logo_new.png";
import FoldXLogo from "../../images/FoldX-logo.png";
import CrossMapLogo from "../../images/crossmap.png";
import CosmicLogo from "../../images/cosmic.png";
import MolstarLogo from "../../images/molstar.png";
import NCBILogo from "../../images/NCBILogo.png";
import VarSiteLogo from "../../images/VarSiteLogo.png";
import {TITLE} from "../../constants/const";

function AboutPageContent() {
  //var today = new Date();
  //var dd = String(today.getDate()).padStart(2, '0');
  //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //var yyyy = today.getFullYear();
  useEffect(() => {
    document.title = 'About - ' + TITLE;
  }, []);

  return <div className="container">
    <h4>About</h4>
    <div className="text">
      <p>Watch the <a href="https://www.youtube.com/watch?v=6dsbozAi1lk" target="_blank" rel="noreferrer">ProtVar launch webinar</a>.
        <br/>
        <iframe id="ytplayer" title="Launch webinar video" width="360" height="202.5"
                src="https://www.youtube.com/embed/6dsbozAi1lk"
                frameBorder="0" allowFullScreen />
      </p>

      <p>
        ProtVar is a regularly updated and maintained human variant annotation and assessment web tool which offers
        users flexibility and ease of accessibility and integration. It combines the data and analysis from a plethora
        of resources to bring together genomic, protein sequence, structure and function as well as structural insights
        and predictions to better understand the potential effects of missense variation on humans.
      </p>

      <h5>Funding</h5>
      <p>
        ProtVar is funded by <br/>
        EMBL <a href="https://www.embl.de/" target="_blank" rel="noreferrer"><img
        src={EMBLLogo}
        loading="lazy"
        alt=""
        width="80"
      /></a>
        Open Targets <a href="https://www.opentargets.org/" target="_blank" rel="noreferrer"><img
        src={OTLogo}
        loading="lazy"
        alt=""
        width="60"
      /></a>
      </p>

      <h5>Acknowledgements</h5>
      We would like to thank the following resources for the data used in ProtVar <br/>

      <div className="grid-container">
        <div><a href="https://www.uniprot.org/" target="_blank" rel="noreferrer"><img
          src={UniprotLogo}
          loading="lazy"
          alt="UniProt"
          width="120"
        /></a></div>
        <div><a href="https://www.ensembl.org/" target="_blank" rel="noreferrer"><img
          src={EnsemblLogo}
          loading="lazy"
          alt="Ensembl"
          width="140"
        /></a></div>
        <div><a href="https://www.ebi.ac.uk/pdbe/" target="_blank" rel="noreferrer"><img
          src={PDBeLogo}
          loading="lazy"
          alt="PDBe"
          width="50"
        /></a></div>
        <div><a href="https://www.deepmind.com/" target="_blank" rel="noreferrer"><img
          src={GoogleDMLogo}
          loading="lazy"
          alt="Google DeepMind"
          width="120"
        /></a>
        <br/>
        <a href="https://alphafold.ebi.ac.uk/" target="_blank" rel="noreferrer">AlphaFold</a></div>
        <div><a href="https://www.ncbi.nlm.nih.gov/" target="_blank" rel="noreferrer"><img
          src={NCBILogo}
          loading="lazy"
          alt="NCBI"
          width="100"
        /></a><br/>
        <a href="https://www.ncbi.nlm.nih.gov/refseq/" target="_blank" rel="noreferrer">RefSeq</a>&nbsp;
        <a href="https://www.ncbi.nlm.nih.gov/snp/" target="_blank" rel="noreferrer">dbSNP</a>&nbsp;
        <a href="https://www.ncbi.nlm.nih.gov/clinvar/" target="_blank" rel="noreferrer">ClinVar</a></div>
        <div>
          <a href="https://cancer.sanger.ac.uk/cosmic" target="_blank" rel="noreferrer"><img
            src={CosmicLogo}
            loading="lazy"
            alt=""
            width="120"
        /></a>&nbsp;&nbsp;
        <a href="https://alphafold.ebi.ac.uk/" target="_blank" rel="noreferrer">AlphaFold</a>&nbsp;&nbsp;
        <a href="https://www.deepmind.com/" target="_blank" rel="noreferrer"><img
            src={DMLogo}
            loading="lazy"
            alt=""
            width="120"
        /></a>&nbsp;&nbsp;
        <a href="https://foldxsuite.crg.eu/" target="_blank" rel="noreferrer"><img
            src={FoldXLogo}
            loading="lazy"
            alt=""
            width="80"
        /></a>
      </p>
      {/*
      <p>
        If you found ProtVar useful for your work please cite: <br/>
        EMBL-EBI ({yyyy}). <em>ProtVar: A tool to contextualise and interpret missense variation. </em>
        Available at <a href="http://www.ebi.ac.uk/ProtVar" target="_blank" rel="noreferrer">http://www.ebi.ac.uk/ProtVar</a>.
        [Accessed {dd + '/' + mm + '/' + yyyy}].
      </p>
      */}
    </div>

  </div>
}

function AboutPage() {
  return <DefaultPageLayout content={<AboutPageContent />} />
}

export default AboutPage;