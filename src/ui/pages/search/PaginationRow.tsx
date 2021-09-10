import DownloadModal from "../../modal/DownloadModal";
import Button from '../../elements/form/Button';
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';

interface PaginationRowProps {
  searchTerms: any
  file: File | null
  page: any
  fetchNextPage: any
}

function PaginationRow(props: PaginationRowProps) {
  const { searchTerms, file, page, fetchNextPage } = props;
  const totalPages = Math.ceil(page.totalItems / page.itemsPerPage);
  const totalItems = file == null ? searchTerms.length : page.totalItems;

  const isFileSelected = file !== null;
  function changePageSize(pageSize: any) {
    if (pageSize !== page.itemsPerPage) {
      fetchNextPage(file, { ...page, currentPage: 1, itemsPerPage: pageSize }, isFileSelected, true);
    }
  }

  const fetchPage = (direction: number) => {
    page.currentPage = page.currentPage + direction;
    fetchNextPage(file, page, isFileSelected, true);
  };

  return <table className="table-header">
    <tbody>
      <tr>
        <td colSpan={1}>
          <DownloadModal searchTerms={searchTerms} file={file} totalItems={totalItems} />
        </td>

        <td colSpan={1}>
          {page === undefined || page.currentPage === 1 ? (
            <Button onClick={() => null} className="button-new button-disabled">
              &laquo; Previous
            </Button>
          ) : (
            <Button onClick={() => fetchPage(-1)}>&laquo; Previous</Button>
          )}
        </td>
        <td colSpan={1}>
          {page.currentPage} of {totalPages}
        </td>
        <td colSpan={1}>
          {page === undefined || !page.nextPage ? (
            <Button onClick={() => null} className="button-new button-disabled">
              Next &raquo;
            </Button>
          ) : (
            <Button onClick={() => fetchPage(1)}>Next &raquo;</Button>
          )}
        </td>
        <td colSpan={1}>
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