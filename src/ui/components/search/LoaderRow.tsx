import { TOTAL_COLS } from "../../../constants/SearchResultTable";
import Loader from "../../elements/Loader";

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