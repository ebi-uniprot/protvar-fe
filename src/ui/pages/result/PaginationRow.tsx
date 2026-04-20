import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PERMITTED_PAGE_SIZES } from '../../../constants/const';
import { PagedMappingResponse } from '../../../types/PagedMappingResponse';

interface PaginationRowProps {
  loading: boolean;
  data: PagedMappingResponse | null;
}

function PaginationRow({ loading, data }: PaginationRowProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  function changePage(p: number) {
    if (!data) return;
    searchParams.delete('annotation');
    if (p === DEFAULT_PAGE) searchParams.delete('page');
    else searchParams.set('page', p.toString());
    navigate(`${location.pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`);
  }

  function changePageSize(newPageSize: number) {
    if (!data) return;
    searchParams.delete('page');
    searchParams.delete('annotation');
    if (newPageSize === DEFAULT_PAGE_SIZE) searchParams.delete('pageSize');
    else searchParams.set('pageSize', newPageSize.toString());
    navigate(`${location.pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`);
  }

  const disabled = loading || data === null;
  const atFirst = disabled || data.page === 1;
  const atLast = disabled || data.last;

  return (
    <div className="pagination-row">
      <div className="pagination-nav">
        <button className="btn btn-secondary btn-sm" onClick={() => changePage(1)} disabled={atFirst}>
          <i className="bi bi-chevron-double-left" />
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => changePage(data!.page - 1)} disabled={atFirst}>
          <i className="bi bi-chevron-left" />
        </button>
        <span className="pagination-info">
          {data ? `${data.page} / ${data.totalPages}` : '—'}
        </span>
        <button className="btn btn-secondary btn-sm" onClick={() => changePage(data!.page + 1)} disabled={atLast}>
          <i className="bi bi-chevron-right" />
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => changePage(data!.totalPages)} disabled={atLast}>
          <i className="bi bi-chevron-double-right" />
        </button>
      </div>
      <select
        className="pagination-page-size"
        value={data?.pageSize ?? DEFAULT_PAGE_SIZE}
        onChange={e => changePageSize(Number(e.target.value))}
        disabled={disabled}
      >
        {PERMITTED_PAGE_SIZES.map(s => (
          <option key={s} value={s}>{s} per page</option>
        ))}
      </select>
    </div>
  );
}

export default PaginationRow;
