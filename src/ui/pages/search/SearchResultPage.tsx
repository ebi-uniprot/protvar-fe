import ResultTable from "../../components/search/ResultTable";
import DefaultPageLayout from "../../layout/DefaultPageLayout";
import PaginationRow from "./PaginationRow";
import { Redirect } from 'react-router-dom'
import { NextPageFun, Page } from "../../../utills/AppHelper";
import { MappingRecord } from "../../../utills/Convertor";
import { ParsedInput } from "../../../types/MappingResponse";
import DownloadModal from "../../modal/DownloadModal";
import { MAX_IN_PLACE_DOWNLOAD_WITHOUT_EMAIL } from "../../../constants/const";
import CaddLegendColors from "../../components/search/CaddLegendColors";

interface SearchResultPageProps {
  pastedInputs: string[]
  file: File | null
  page: Page
  fetchNextPage: NextPageFun
  rows: MappingRecord[][][]
  invalidInputs: Array<ParsedInput>
}

function SearchResultsPageContent(props: SearchResultPageProps) {
  const { pastedInputs, file, page, invalidInputs, rows, fetchNextPage } = props;
  if (!rows || rows.length < 1)
    return <Redirect to="/" />

  return <>
    <div className="search-results">
      {(invalidInputs && invalidInputs.length > 0) &&
        <div className="alert alert-danger alert-dismissible fade show">Few of inputs are not valid</div>
      }
      <div className="flex">
        <PaginationRow page={page} fetchNextPage={fetchNextPage} />
        <DownloadModal pastedInputs={pastedInputs} file={file} sendEmail={page.totalItems > MAX_IN_PLACE_DOWNLOAD_WITHOUT_EMAIL} />
      </div>
      <ResultTable invalidInputs={invalidInputs} mappings={rows} />
      <PaginationRow page={page} fetchNextPage={fetchNextPage} />
      <CaddLegendColors />
    </div>
  </>
}

function SearchResultPage(props: SearchResultPageProps) {
  return <DefaultPageLayout content={<SearchResultsPageContent {...props} />} />
}
export default SearchResultPage;