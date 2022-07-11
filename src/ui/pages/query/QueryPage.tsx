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

/* TODO: possible future acceptable short URLs
// /ProtVar/g/<chromo>/<pos>/[<ref>/]<alt>
// /ProtVar/p/<acc>/<pos>/[<ref>/]<alt>

Examples:
genomic query
/ProtVar/g/?chromosome=19&position=1010539&ref=G&alt=C
/ProtVar/g/?chromosome=14&position=89993420&ref=A&alt=G
/ProtVar/g/?chromosome=10&position=87933147&ref=C&alt=T

protein query
/ProtVar/p/?accession=Q4ZIN3&position=558&ref=S&alt=R
/ProtVar/p/?accession=Q9NUW8&position=493&ref=H&alt=R
/ProtVar/p/?accession=P60484&position=130&ref=R&alt=T
/ProtVar/p/?accession=P60484&position=130&ref=N&alt=G

const genomicSearchRegExp = new RegExp("^/g/[a-zA-Z0-9]+/[0-9]+/[a-zA-Z]/[a-zA-Z]$");
const proteinSearchRegExp = new RegExp("^/p/[a-zA-Z][a-zA-Z0-9]+/[0-9]+/[a-zA-Z]{3}/[a-zA-Z]{3}$");

function validGenomicQuery(q: string) {
    return genomicSearchRegExp.test(q);
}

function validProteinQuery(q: string) {
    return proteinSearchRegExp.test(q);
}
*/

const InvalidQueryContent = () => (
  <>
    <h3>Invalid query request...</h3>
    <p>
      The URL request format is invalid. Examples of valid requests to access
      variant annotations using either genomic coordinates or protein accession
      and position:
    </p>
    <ul>
      <li>
        <code>
          /ProtVar/g/?chromosome=1&amp;position=999&amp;ref=X&amp;alt=Y
        </code>
      </li>
      <li>
        <code>
          /ProtVar/p/?accession=ACC&amp;position=999&amp;ref=XXX&amp;alt=YYY
        </code>
      </li>
    </ul>
  </>
);

function getQueryFromUrl(location: any) {
  const params = new URLSearchParams(location.search);
  if (
    location.pathname.startsWith("/g") ||
    location.pathname.startsWith("/p")
  ) {
    let pos, ref, alt;
    pos = params.get("position");
    ref = params.get("ref");
    alt = params.get("alt");

    if (location.pathname.startsWith("/g")) {
      let chromo = params.get("chromosome");
      if (chromo && pos && ref && alt) {
        return `${chromo} ${pos} ${ref} ${alt}`;
      }
    }

    if (location.pathname.startsWith("/p")) {
      let acc = params.get("accession");
      if (acc && pos && ref && alt) {
        return `${acc} ${pos} ${ref} ${alt}`;
      }
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
    } else {
      console.log("Not true");
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
