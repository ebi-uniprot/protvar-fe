import DownloadModal from "../../modal/DownloadModal";
import Button from '../../elements/form/Button';
import { Dropdown } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import { NextPageFun, Page } from "../../../utills/AppHelper";
import { MAX_IN_PLACE_DOWNLOAD_WITHOUT_EMAIL } from "../../../constants/const";

interface PaginationRowProps {
  pastedInputs: string[]
  file: File | null
  page: Page
  fetchNextPage: NextPageFun
}

function PaginationRow(props: PaginationRowProps) {
  const { pastedInputs, file, page, fetchNextPage } = props;
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
        <td colSpan={1}>
          <DownloadModal pastedInputs={pastedInputs} file={file} sendEmail={page.totalItems > MAX_IN_PLACE_DOWNLOAD_WITHOUT_EMAIL} />
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