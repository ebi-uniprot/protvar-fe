import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PERMITTED_PAGE_SIZES } from '../../../constants/const';
import { PagedMappingResponse } from '../../../types/PagedMappingResponse';
import { effectiveTotalPages, isTotalCapped, isTotalUnknown } from '../../../utills/PaginationFormat';

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
  const atFirst = disabled || (data?.page ?? 1) === 1;

  // Pagination state derives from PaginationFormat helpers, which encode the
  // three BE counting modes (exact / capped / unknown). When the total is
  // unknown (filter-only COUNT timeout), totalPages is null — we render
  // "Page N" only and rely on data.last for the Next button. When capped,
  // navigation clamps to floor(totalCap / pageSize). When exact, behaves
  // exactly as before.
  const totalPages = data ? effectiveTotalPages(data) : 0;
  const capped = data ? isTotalCapped(data) : false;
  const unknown = data ? isTotalUnknown(data) : false;
  const atLast = disabled
    || (data && data.last)
    || (data && totalPages != null && data.page >= totalPages)
    || false;

  // Hover-explanation for the disabled Next/Last buttons. Helps the user
  // understand why they can't navigate further (cap reached vs. real end).
  const lastHint = capped ? 'Showing the first 10,000 results — refine filters to see more'
                  : unknown ? 'End of available results'
                  : 'On the last page';

  return (
    <div className="pagination-row">
      <div className="pagination-nav">
        <button className="btn btn-secondary btn-sm" onClick={() => changePage(1)} disabled={atFirst}>
          <i className="bi bi-chevron-double-left" />
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => changePage(data!.page - 1)} disabled={atFirst}>
          <i className="bi bi-chevron-left" />
        </button>
        <span
          className="pagination-info"
          title={
            capped ? 'Result count capped — refine filters to narrow further' :
            unknown ? 'Total result count not available — use Next/Prev to navigate' :
            undefined
          }
        >
          {!data ? '—'
            : unknown ? `Page ${data.page}`
            : `${data.page} / ${totalPages}${capped ? '+' : ''}`}
        </span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => changePage(data!.page + 1)}
          disabled={atLast}
          title={atLast ? lastHint : undefined}
        >
          <i className="bi bi-chevron-right" />
        </button>
        {!unknown && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => changePage(totalPages!)}
            disabled={atLast}
            title={atLast ? lastHint : undefined}
          >
            <i className="bi bi-chevron-double-right" />
          </button>
        )}
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
