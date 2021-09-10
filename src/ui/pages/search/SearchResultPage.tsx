import ResultTable from "../../components/search/ResultTable";
import DefaultPageLayout from "../../layout/DefaultPageLayout";
import PaginationRow from "./PaginationRow";
import Alert from '../../components/other/Alert';
import { Redirect } from 'react-router-dom'

interface SearchResultPageProps {
  searchTerms: any
  file: File | null
  page: any
  fetchNextPage: any
  rows: any
  invalidInputs: any
  errors: any
}

function SearchResultsPageContent(props: SearchResultPageProps) {
  const { searchTerms, file, page, invalidInputs, rows, fetchNextPage, errors } = props;
  if(!rows)
		return <Redirect to="/"/>

  return <>
    {errors && errors.map((e: any) => <Alert {...e} key={window.btoa(e.message)} />)}
    <div className="search-results">
      {(invalidInputs && invalidInputs.length > 0) &&
        <div className="alert alert-danger alert-dismissible fade show">Few of inputs are not valid</div>
      }
      <PaginationRow searchTerms={searchTerms} file={file} page={page} fetchNextPage={fetchNextPage} />
      <ResultTable invalidInputs={invalidInputs} mappings={rows} />
    </div>
  </>
}

function SearchResultPage(props: SearchResultPageProps) {
  return <DefaultPageLayout title="Search" content={<SearchResultsPageContent {...props} />} />
}
export default SearchResultPage;