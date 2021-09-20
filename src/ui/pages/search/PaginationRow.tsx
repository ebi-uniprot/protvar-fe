import Button from '../../elements/form/Button';
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import { NextPageFun, Page } from "../../../utills/AppHelper";

interface PaginationRowProps {
  page: Page
  fetchNextPage: NextPageFun
}

function PaginationRow(props: PaginationRowProps) {
  const { page, fetchNextPage } = props;
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
        <td>
          {page === undefined || page.currentPage === 1 ? (
            <Button onClick={() => null} className="button-new button-disabled">
              &laquo; Previous
            </Button>
          ) : (
            <Button onClick={() => fetchPage(-1)}>&laquo; Previous</Button>
          )}
        </td>
        <td>
          {page.currentPage} of {totalPages}
        </td>
        <td>
          {page === undefined || !page.nextPage ? (
            <Button onClick={() => null} className="button-new button-disabled">
              Next &raquo;
            </Button>
          ) : (
            <Button onClick={() => fetchPage(1)}>Next &raquo;</Button>
          )}
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
export default PaginationRow;