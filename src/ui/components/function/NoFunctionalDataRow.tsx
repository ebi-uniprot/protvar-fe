import { TOTAL_COLS } from "../../../constants/SearchResultTable";

function NoFunctionalDataRow() {
  return <tr>
    <td colSpan={TOTAL_COLS} className="expanded-row">
      {' '}
      <div className="significances-groups">
        <div className="column">No functional data for this residue</div>
      </div>
    </td>
  </tr>
}
export default NoFunctionalDataRow;