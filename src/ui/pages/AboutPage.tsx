import DefaultPageLayout from "../layout/DefaultPageLayout";
import React from "react";
import EMBLEBILogo from "../../images/embl-ebi-logo.svg";
import openTargetsLogo from "../../images/open-targets-logo.png";
import UniprotLogo from "../../images/uniprot-logo.svg";
import EnsemblLogo from "../../images/ensembl-logo.png";
import PDBeLogo from "../../images/pdbe-logo.png";
import CADDLogo from "../../images/cadd-logo.png";
import EVELogo from "../../images/eve-logo.svg";
import DMLogo from "../../images/dm-logo.png";
import FoldXLogo from "../../images/FoldX-logo.png";

function AboutPageContent() {
  return <div className="container">
    <h4>About</h4>
    <div className="text">
      <p>
        ProtVar is a regularly updated and maintained human variant annotation and assessment web tool which offers
        users flexibility and ease of accessibility and integration. It combines the data and analysis from a plethora
        of resources to bring together genomic, protein sequence, structure and function as well as structural insights
        and predictions to better understand the potential effects of missense variation on humans.
      </p>

      <p>
          It is funded by <img
            src={EMBLEBILogo}
            loading="lazy"
            alt=""
            width="130"
            height="50"
        /> and <img
            src={openTargetsLogo}
            loading="lazy"
            alt=""
            width="130"
            height="50"
        />
      </p>

      <p>
        The ProtVar team consists of:<br/>
        <a href="https://www.ebi.ac.uk/people/person/james-stephenson/" target="_blank" rel="noreferrer">James Stephenson</a> - ProtVar lead<br/>
        <a href="https://www.ebi.ac.uk/people/person/prabhat-totoo/" target="_blank" rel="noreferrer">Prabhat Totoo</a> - Lead developer<br/>
      </p>

      <p>
        We would like to thank the following resources for the data used in ProtVar <br/>
        <a href="https://www.uniprot.org/" target="_blank" rel="noreferrer"><img
            src={UniprotLogo}
            loading="lazy"
            alt=""
            width="120"
        /></a>&nbsp;&nbsp;
        <a href="https://www.ensembl.org/" target="_blank" rel="noreferrer"><img
            src={EnsemblLogo}
            loading="lazy"
            alt=""
            width="140"
        /></a>&nbsp;&nbsp;
        <a href="https://www.ebi.ac.uk/pdbe/" target="_blank" rel="noreferrer"><img
            src={PDBeLogo}
            loading="lazy"
            alt=""
            width="50"
        /></a>&nbsp;&nbsp;
        <a href="https://cadd.gs.washington.edu/" target="_blank" rel="noreferrer"><img
            src={CADDLogo}
            loading="lazy"
            alt=""
            width="60"
        /></a>&nbsp;&nbsp;
        <a href="https://evemodel.org/" target="_blank" rel="noreferrer"><img
            src={EVELogo}
            loading="lazy"
            alt=""
            width="120"
        /></a>&nbsp;&nbsp;
        <a href="https://alphafold.ebi.ac.uk/" target="_blank" rel="noreferrer"><img
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

      <p>
        If you found ProtVar useful for your work please cite:
      </p>
    </div>

  </div>
}

function AboutPage() {
  return <DefaultPageLayout content={<AboutPageContent />} />
}
export default AboutPage;