import DefaultPageLayout from "../layout/DefaultPageLayout";
import {ENSEMBL_ASML_URL, HUMSAVAR_URL} from "../../constants/ExternalUrls";
import React from "react";

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
    </div>

  </div>
}

function AboutPage() {
  return <DefaultPageLayout content={<AboutPageContent />} />
}
export default AboutPage;