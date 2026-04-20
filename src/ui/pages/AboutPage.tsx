import DefaultPageLayout from "../layout/DefaultPageLayout";
import React, {useEffect} from "react";
import EMBLLogo from "../../images/EMBL_logo.svg.png";
import OTLogo from "../../images/open-targets-logo.png";
import UniprotLogo from "../../images/uniprot-logo.svg";
import EnsemblLogo from "../../images/ensembl-logo.png";
import VEPGif from "../../images/vep.gif";
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
import DecipherLogo from "../../images/decipher.png";
import {TITLE} from "../../constants/const";
import {ExtLink} from "../components/common/Link";

function AboutPageContent() {
  useEffect(() => {
    document.title = `About | ${TITLE}`;
  }, []);

  return (
    <div className="container">
      <h5 className="page-header">About ProtVar</h5>

      {/* What is ProtVar */}
      <section className="about-section">
        <p>
          ProtVar is a regularly updated and maintained human variant annotation and assessment
          web tool offering flexibility and ease of accessibility and integration. It combines
          data and analysis from a range of resources to bring together genomic, protein sequence,
          structure and function as well as structural insights and predictions to better understand
          the potential effects of missense variation on humans.
        </p>
      </section>

      {/* Resources */}
      <section className="about-section">
        <h6 className="about-section-title">Resources</h6>
        <div className="about-resources">
          <a className="about-resource-card" href="https://www.youtube.com/watch?v=6dsbozAi1lk" target="_blank" rel="noreferrer">
            <i className="bi bi-play-circle about-resource-icon" />
            <span>Launch webinar</span>
          </a>
          <a className="about-resource-card" href="ProtVar_Jan_2024.pdf" target="_blank" rel="noreferrer">
            <i className="bi bi-file-pdf about-resource-icon" />
            <span>Presentation (Jan 2024)</span>
          </a>
          <a className="about-resource-card" href="ProtVar_tutorial.pdf" target="_blank" rel="noreferrer">
            <i className="bi bi-file-pdf about-resource-icon" />
            <span>Tutorial (Sep 2023)</span>
          </a>
        </div>
      </section>

      {/* How to cite */}
      <section className="about-section">
        <h6 className="about-section-title">How to cite</h6>
        <div className="about-cite-box">
          <i className="bi bi-quote about-cite-icon" />
          <p>
            James D Stephenson, Prabhat Totoo, David F Burke, Jürgen Jänes, Pedro Beltrao, Maria J Martin,
            ProtVar: mapping and contextualizing human missense variation,{' '}
            <i>Nucleic Acids Research</i>, 2024.{' '}
            <ExtLink url="https://doi.org/10.1093/nar/gkae413" text="https://doi.org/10.1093/nar/gkae413" />
          </p>
        </div>
      </section>

      {/* Development team */}
      <section className="about-section">
        <h6 className="about-section-title">Development team</h6>
        <p>
          ProtVar is developed and maintained within the{' '}
          <a href="https://www.ebi.ac.uk/about/teams/protein-function-development/" target="_blank" rel="noreferrer">
            UniProt protein function development
          </a>{' '}team at EMBL-EBI by{' '}
          <a href="https://www.ebi.ac.uk/people/person/james-stephenson" target="_blank" rel="noreferrer">James Stephenson</a>{' '}
          and{' '}
          <a href="https://www.ebi.ac.uk/people/person/prabhat-totoo" target="_blank" rel="noreferrer">Prabhat Totoo</a>.
        </p>
      </section>

      {/* Funding */}
      <section className="about-section">
        <h6 className="about-section-title">Funding</h6>
        <p>ProtVar is funded by</p>
        <div className="about-funder-logos">
          <a href="https://www.embl.de/" target="_blank" rel="noreferrer" title="EMBL">
            <img src={EMBLLogo} loading="lazy" alt="EMBL" className="about-funder-logo" />
          </a>
          <a href="https://www.opentargets.org/" target="_blank" rel="noreferrer" title="Open Targets">
            <img src={OTLogo} loading="lazy" alt="Open Targets" className="about-funder-logo" />
          </a>
        </div>
      </section>

      {/* Data & tools */}
      <section className="about-section">
        <h6 className="about-section-title">Data &amp; tools</h6>
        <p>We gratefully acknowledge the following resources whose data and tools power ProtVar.</p>
        <div className="about-ack-grid">
          <a href="https://www.uniprot.org/" target="_blank" rel="noreferrer" className="about-ack-item" title="UniProt">
            <img src={UniprotLogo} loading="lazy" alt="UniProt" />
          </a>
          <a href="https://www.ensembl.org/" target="_blank" rel="noreferrer" className="about-ack-item" title="Ensembl">
            <img src={EnsemblLogo} loading="lazy" alt="Ensembl" />
          </a>
          <a href="https://www.ensembl.org/info/docs/tools/vep/" target="_blank" rel="noreferrer" className="about-ack-item" title="Ensembl VEP">
            <img src={VEPGif} loading="lazy" alt="Ensembl VEP" />
          </a>
          <a href="https://www.ebi.ac.uk/pdbe/" target="_blank" rel="noreferrer" className="about-ack-item" title="PDBe">
            <img src={PDBeLogo} loading="lazy" alt="PDBe" />
          </a>
          <a href="https://www.deciphergenomics.org/" target="_blank" rel="noreferrer" className="about-ack-item" title="DECIPHER">
            <img src={DecipherLogo} loading="lazy" alt="DECIPHER" />
          </a>
          <a href="https://alphafold.ebi.ac.uk/" target="_blank" rel="noreferrer" className="about-ack-item" title="AlphaFold / Google DeepMind">
            <img src={GoogleDMLogo} loading="lazy" alt="Google DeepMind / AlphaFold" />
          </a>
          <a href="https://cadd.gs.washington.edu/" target="_blank" rel="noreferrer" className="about-ack-item" title="CADD">
            <img src={CADDLogo} loading="lazy" alt="CADD" />
          </a>
          <a href="https://evemodel.org/" target="_blank" rel="noreferrer" className="about-ack-item" title="EVE">
            <img src={EVELogo} loading="lazy" alt="EVE" />
          </a>
          <a href="https://foldxsuite.crg.eu/" target="_blank" rel="noreferrer" className="about-ack-item" title="FoldX">
            <img src={FoldXLogo} loading="lazy" alt="FoldX" />
          </a>
          <a href="https://cancer.sanger.ac.uk/cosmic" target="_blank" rel="noreferrer" className="about-ack-item" title="COSMIC">
            <img src={CosmicLogo} loading="lazy" alt="COSMIC" />
          </a>
          <a href="https://molstar.org/" target="_blank" rel="noreferrer" className="about-ack-item" title="Mol*">
            <img src={MolstarLogo} loading="lazy" alt="Mol*" />
          </a>
          <a href="https://www.ncbi.nlm.nih.gov/" target="_blank" rel="noreferrer" className="about-ack-item" title="NCBI (RefSeq, dbSNP, ClinVar)">
            <img src={NCBILogo} loading="lazy" alt="NCBI" />
          </a>
          <a href="https://crossmap.sourceforge.net/" target="_blank" rel="noreferrer" className="about-ack-item" title="CrossMap">
            <img src={CrossMapLogo} loading="lazy" alt="CrossMap" />
          </a>
          <a href="https://www.ebi.ac.uk/thornton-srv/databases/VarSite" target="_blank" rel="noreferrer" className="about-ack-item varsite-logo" title="VarSite">
            <img src={VarSiteLogo} loading="lazy" alt="VarSite" />
          </a>
        </div>
      </section>

      {/* Licence & legal */}
      <section className="about-section about-section--legal">
        <h6 className="about-section-title">Licence &amp; disclaimer</h6>
        <p>
          Content on this site is licensed under a{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
            Creative Commons Attribution 4.0 International (CC BY 4.0) License
          </a>{' '}
          except where otherwise noted.
        </p>
        <p>
          We make no warranties regarding the correctness of the data and disclaim liability for damages
          resulting from its use. Any medical or genetic information is provided for research and
          educational purposes only — it is not a substitute for professional medical advice.
        </p>
        <p>
          This website uses cookies and limited personal data processing in order to function. By using
          the site you agree to our{' '}
          <a href="https://www.ebi.ac.uk/data-protection/privacy-notice/embl-ebi-public-website" target="_blank" rel="noreferrer">Privacy Notice</a>
          {' '}and{' '}
          <a href="https://www.ebi.ac.uk/about/terms-of-use" target="_blank" rel="noreferrer">Terms of Use</a>.
        </p>
      </section>
    </div>
  )
}

function AboutPage() {
  return <DefaultPageLayout content={<AboutPageContent/>}/>
}

export default AboutPage;
