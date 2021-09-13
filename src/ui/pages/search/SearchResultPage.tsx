import ResultTable from "../../components/search/ResultTable";
import DefaultPageLayout from "../../layout/DefaultPageLayout";
import PaginationRow from "./PaginationRow";
import { Redirect } from 'react-router-dom'
import { NextPageFun, Page } from "../../../utills/AppHelper";
import { MappingRecord } from "../../../utills/Convertor";
import { ParsedInput } from "../../../types/MappingResponse";

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
  if(!rows || rows.length < 1)
		return <Redirect to="/"/>

  return <>
    <div className="search-results">
      {(invalidInputs && invalidInputs.length > 0) &&
        <div className="alert alert-danger alert-dismissible fade show">Few of inputs are not valid</div>
      }
      <PaginationRow pastedInputs={pastedInputs} file={file} page={page} fetchNextPage={fetchNextPage} />
      <ResultTable invalidInputs={invalidInputs} mappings={rows} />
    </div>
  </>
}

function SearchResultPage(props: SearchResultPageProps) {
  return <DefaultPageLayout content={<SearchResultsPageContent {...props} />} />
}
export default SearchResultPage;