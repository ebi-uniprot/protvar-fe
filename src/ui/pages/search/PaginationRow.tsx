import Button from '../../elements/form/Button';
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import { NextPageFun, Page } from "../../../utills/AppHelper";
import {AppState} from "../../App";

interface PaginationRowProps {
  page: Page
  fetchNextPage: NextPageFun
  loading: boolean
}

function PaginationRow(props: PaginationRowProps) {
  const { page, fetchNextPage, loading } = props;
  const totalPages = Math.ceil(page.totalItems / page.itemsPerPage);

  function changePageSize(pageSize: any) {
    if (pageSize !== page.itemsPerPage) {
      page.currentPage = 1
      page.itemsPerPage = pageSize
      fetchNextPage(page);
    }
  }

  const fetchPage = (direction: number) => {
    page.currentPage = page.currentPage + direction;
    fetchNextPage(page);
  };

  return <table className="table-header">
    <tbody>
      <tr>
        <td >
          <Button className={'pagination-button'} onClick={() => fetchPage(-1)} loading={loading} disabled={page === undefined || page.currentPage === 1}>
          <i className="bi bi-chevron-compact-left" /> Prev
            </Button>
        </td>
        <td>
          {page.currentPage} / {totalPages}
        </td>
        <td>
          <Button className={'pagination-button'} onClick={() => fetchPage(1)} loading={loading} disabled={page === undefined || !page.nextPage}>
            Next <i className="bi bi-chevron-compact-right" />
          </Button>
        </td>
        <td>
          <Dropdown
            placeholder="Pages"
            options={[25, 50, 100]}
            value={page.itemsPerPage}
            onChange={(option) => changePageSize(option.value)}
          /> 
        </td>
      </tr>
    </tbody>
  </table>
}

// V2
interface NewPaginationRowProps {
  loading: boolean
  state: AppState
  getData: any
}
export function NewPaginationRow(props: NewPaginationRowProps) {

  const { loading, state, getData } = props;
  let id = ""
  let pageNo = 1
  let totalPages = 1
  let pageSize = 10

  if (state.response != null) {
    id = state.response.resultId
    pageNo = state.response.pageNo
    pageSize = state.response.pageSize
  }

  function changePageSize(newPageSize: any) {
    if (newPageSize !== pageSize) {
      getData(id, 1, newPageSize)
    }
  }

  return <table className="table-header">
    <tbody>
    <tr>
      <td >
        <Button className={'pagination-button'} onClick={() => getData(id, pageNo-1)} loading={loading} disabled={state.response == null || state.response.pageNo === 1}>
          <i className="bi bi-chevron-compact-left" /> Prev
        </Button>
      </td>
      <td>
        {pageNo} / {totalPages}
      </td>
      <td>
        <Button className={'pagination-button'} onClick={() => getData(id, pageNo+1)} loading={loading} disabled={state.response == null || state.response.last}>
          Next <i className="bi bi-chevron-compact-right" />
        </Button>
      </td>
      <td>
        <Dropdown
          placeholder="Pages"
          options={[25, 50, 100]}
          value={pageSize}
          onChange={(option) => changePageSize(option.value)}
        />
      </td>
    </tr>
    </tbody>
  </table>
}
// <V2
export default PaginationRow;