import { Loader } from "franklin-sites";
import { TOTAL_COLS } from "../../../constants/SearchResultTable";

function LoaderRow() {
  return (
    <tr className="loader-border ">
      <td colSpan={TOTAL_COLS}>
        <Loader />
      </td>
    </tr>
  );
}
export default LoaderRow;