import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_HEADERS, G2P_MAPPING_URI } from "../../../constants/const";
import MappingResponse, { ParsedInput } from "../../../types/MappingResponse";
import CaddLegendColors from "../../components/search/CaddLegendColors";
import ResultTable from "../../components/search/ResultTable";
import ResultTableButtonsLegend from "../../components/search/ResultTableButtonsLegend";
import DefaultPageLayout from "../../layout/DefaultPageLayout";
import {
  convertApiMappingToTableRecords,
  MappingRecord,
} from "../../../utills/Convertor";
import Notify from "../../elements/Notify";
import DownloadModal from "../../modal/DownloadModal";

// basic tests on query params
const chromosomeRegExp = new RegExp("[a-zA-Z0-9]+");
const positionRegExp = new RegExp("[0-9]+");
const alleleRegExp = new RegExp("[a-zA-Z]");
const accessionRegExp = new RegExp("[a-zA-Z][a-zA-Z0-9]+");
const oneletterAARegExp = new RegExp("[a-zA-Z]");
//const threeletterAARegExp = new RegExp("[a-zA-Z]{3}");

const genomicExamples = [
  "/ProtVar/q?chromosome=19&genomic_position=1010539&reference_allele=G&alternative_allele=C",
  "/ProtVar/q?chromosome=14&genomic_position=89993420&reference_allele=A&alternative_allele=G",
  "/ProtVar/q?chromosome=10&genomic_position=87933147&reference_allele=C&alternative_allele=T",
];
const proteinExamples = [
  "/ProtVar/q?accession=Q4ZIN3&protein_position=558&reference_AA=S&variant_AA=R",
  "/ProtVar/q?accession=Q9NUW8&protein_position=493&reference_AA=H&variant_AA=R",
  "/ProtVar/q?accession=P60484&protein_position=130&reference_AA=R&variant_AA=T",
  "/ProtVar/q?accession=P60484&protein_position=130&reference_AA=N&variant_AA=G",
];

const gExamples = genomicExamples.map((ex, idx) => (
  <li key={"gEx" + idx}>
    <a href={ex}>{ex}</a>
  </li>
));
const pExamples = proteinExamples.map((ex, idx) => (
  <li key={"pEx" + idx}>
    <a href={ex}>{ex}</a>
  </li>
));

const InvalidQueryContent = () => (
  <>
    <h3>Invalid Query</h3>
    <p>
      The URL request format is invalid. Examples of valid requests to access
      variant annotations using either genomic coordinates or protein accession
      and position:
    </p>
    Using genomic coordinates
    <ul>{gExamples}</ul>
    Using protein accession and position
    <ul>{pExamples}</ul>
  </>
);

const requiredGenomicParams = [
  "chromosome",
  "genomic_position",
  "reference_allele",
  "alternative_allele",
];

const requiredProteinParams = [
  "accession",
  "protein_position",
  "reference_AA",
  "variant_AA",
];

function getQueryFromUrl(location: any) {
  const params = new URLSearchParams(location.search);

  const isGenomicQuery = requiredGenomicParams.reduce(function (acc, p) {
    return acc && params.has(p);
  }, true);

  if (isGenomicQuery) {
    let chromo, pos, ref, alt;
    chromo = params.get("chromosome");
    pos = params.get("genomic_position");
    ref = params.get("reference_allele");
    alt = params.get("alternative_allele");

    if (
      chromo &&
      chromosomeRegExp.test(chromo) &&
      pos &&
      positionRegExp.test(pos) &&
      ref &&
      alleleRegExp.test(ref) &&
      alt &&
      alleleRegExp.test(alt)
    ) {
      return `${chromo} ${pos} ${ref} ${alt}`;
    }
  }

  const isProteinQuery = requiredProteinParams.reduce(function (acc, p) {
    return acc && params.has(p);
  }, true);
  if (isProteinQuery) {
    let acc, pos, ref, alt;
    acc = params.get("accession");
    pos = params.get("protein_position");
    ref = params.get("reference_AA");
    alt = params.get("variant_AA");

    if (
      acc &&
      accessionRegExp.test(acc) &&
      pos &&
      positionRegExp.test(pos) &&
      ref &&
      oneletterAARegExp.test(ref) &&
      alt &&
      oneletterAARegExp.test(alt)
    ) {
      return `${acc} ${pos} ${ref} ${alt}`;
    }
  }
  return "";
}

const QueryPageContent = () => {
  const location = useLocation();

  const [userInput, setUserInput] = useState("");
  const [searchResults, setSearchResults] = useState<MappingRecord[][][]>([]);
  const [invalidInputs, setInvalidInputs] = useState<Array<ParsedInput>>([]);

  useEffect(() => {
    const query = getQueryFromUrl(location);
    if (query) {
      setUserInput(query);
      axios
        .post<string[], AxiosResponse<MappingResponse>>(
          G2P_MAPPING_URI,
          [query],
          {
            headers: API_HEADERS,
          }
        )
        .then((response) => {
          const records = response.data.mappings.map(
            convertApiMappingToTableRecords
          );
          setSearchResults(records);
          setInvalidInputs(response.data.invalidInputs);
          if (response.data.invalidInputs.length > 0)
            Notify.err("Some input rows are not valid");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location]);

  const queryOutput = userInput ? (
    <>
      <div className="search-results">
        <div className="flex justify-content-space-between float-right">
          <DownloadModal
            pastedInputs={[userInput]}
            file={null}
            sendEmail={false}
          />
          <ResultTableButtonsLegend />
        </div>
        <ResultTable invalidInputs={invalidInputs} mappings={searchResults} />
        <CaddLegendColors />
      </div>
    </>
  ) : (
    <InvalidQueryContent />
  );

  //if (!searchResults || searchResults.length < 1) return <>Nothing!</>;

  return <>{queryOutput}</>;
};

function QueryPage() {
  return <DefaultPageLayout content={<QueryPageContent />} />;
}

export default QueryPage;
