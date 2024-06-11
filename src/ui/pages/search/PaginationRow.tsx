import Button from '../../elements/form/Button';
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import { NextPageFun, Page } from "../../../utills/AppHelper";
import {AppContext, AppState} from "../../App";
import {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {PAGE_SIZES} from "../../../constants/const";

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
  getData: any
}
export function NewPaginationRow(props: NewPaginationRowProps) {
  const state: AppState = useContext(AppContext)
  const navigate = useNavigate();
  const { loading, getData } = props;

  function hasPrev() {
    if (state.response && state.response?.pageNo > 1) {
      return true
    }
    return false;
  }

  function hasNext() {
    if (state.response && !state.response.last) {
      return true
    }
    return false;
  }
  function prevPage() {
    const currPage = state.response?.pageNo
    if (currPage && currPage > 1) {
      const prev = currPage - 1
      changePage(prev)
    }
  }

  function nextPage() {
    if (state.response && !state.response.last) {
      const next = state.response?.pageNo + 1
      changePage(next)
    }
  }

  function changePage(p: number) {
    const resultId = state.response?.resultId;
    getData(resultId, p, state.pageSize);
    const url = p === 1
      ? `/home/result/${resultId}`
      : `/home/result/${resultId}?page=${p}`;
    navigate(url);
  }

  function changePageSize(newPageSize: any) {
    if (newPageSize !== state.pageSize) {
      state.updateState("pageSize", newPageSize);
      const resultId = state.response?.resultId;
      getData(resultId, 1, newPageSize);
      navigate(`/home/result/${resultId}`);
    }
  }

  return <table className="table-header">
    <tbody>
    <tr>
      <td >
        <Button className={'pagination-button'} onClick={prevPage} loading={loading} disabled={!hasPrev()}>
          <i className="bi bi-chevron-compact-left" /> Prev
        </Button>
      </td>
      <td>
        {state.response?.pageNo} / {state.response?.totalPages}
      </td>
      <td>
        <Button className={'pagination-button'} onClick={nextPage} loading={loading} disabled={!hasNext()}>
          Next <i className="bi bi-chevron-compact-right" />
        </Button>
      </td>
      <td>
        <Dropdown
          placeholder="Pages"
          options={addAndSort(PAGE_SIZES, state.response?.pageSize)}
          value={state.pageSize}
          onChange={(option) => changePageSize(option.value)}
        />
      </td>
    </tr>
    </tbody>
  </table>
}

function addAndSort(array: number[], num?: number | null): number[] {
  if (num != null && !array.includes(num)) {
    array.push(num);
    array.sort((a, b) => a - b);
  }
  return array;
}
// <V2
export default PaginationRow;