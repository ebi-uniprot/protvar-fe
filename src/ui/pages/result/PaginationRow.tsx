import Button from '../../elements/form/Button';
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {PAGE_SIZE, PAGE_SIZES} from "../../../constants/const";
import {PagedMappingResponse} from "../../../types/PagedMappingResponse";

interface PaginationRowProps {
  loading: boolean
  data: PagedMappingResponse | null
}
function PaginationRow(props: PaginationRowProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pageSize = searchParams.get("pageSize")
  const { loading, data } = props;

  function prevPage() {
    if (data) {
      changePage(data.page-1)
    }
  }

  function nextPage() {
    if (data) {
      changePage(data.page + 1)
    }
  }

  function changePage(p: number) {
    if (data) {
      //loadData(data.id, assembly, p, pageSize);
      if (p === 1)
        searchParams.delete("page");
      else
        searchParams.set("page", p.toString());

      const url = `${location.pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ``}`
      navigate(url);
    }
  }

  function changePageSize(newPageSize: any) {
    if (data && newPageSize !== pageSize) {
      //setPageSize(newPageSize);
      //loadData(data.id, assembly, 1, newPageSize);// go back to page 1
      searchParams.delete("page"); // reset to page 1

      if (newPageSize === PAGE_SIZE)
        searchParams.delete("pageSize");
      else
        searchParams.set("pageSize", newPageSize.toString());

      const url = `${location.pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ``}`
      navigate(url);
    }
  }

  return <table className="table-header">
    <tbody>
    <tr>
      <td>
        <Button className={'pagination-button'} onClick={prevPage} loading={loading} disabled={loading || data === null || data.page === 1}>
          <i className="bi bi-chevron-compact-left"/> Prev
        </Button>
      </td>
      <td>
        {data && `${data.page} / ${data.totalPages}`}
      </td>
      <td>
        <Button className={'pagination-button'} onClick={nextPage} loading={loading} disabled={loading || data === null || data.last}>
          Next <i className="bi bi-chevron-compact-right"/>
        </Button>
      </td>
      <td>
        <Dropdown
          placeholder="Pages"
          options={PAGE_SIZES}
          value={data?.pageSize}
          onChange={(option) => changePageSize(option.value)}
          disabled={loading || data === null}
        />
      </td>
    </tr>
    </tbody>
  </table>
}

export default PaginationRow;