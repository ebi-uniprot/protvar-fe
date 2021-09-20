import { TOTAL_COLS } from "../../../constants/SearchResultTable";

function NoPopulationDataRow() {
  return <tr>
    <td colSpan={TOTAL_COLS} className="expanded-row">
      {' '}
      <div className="significances-groups">
        <div className="column">
          <b>No Population Observation to report</b>
        </div>
      </div>
    </td>
  </tr>
}
export default NoPopulationDataRow;