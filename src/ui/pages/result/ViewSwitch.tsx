import { RESULT_VIEWS, viewOf } from "../../../constants/resultColumns";
import { useResultColumns } from "./useResultColumns";
import Tool from "../../elements/Tooltip";

// Genomic | Genomic + protein | Protein column presets; shows "Custom" when the columns match none.
export default function ViewSwitch() {
  const { ids, setIds } = useResultColumns();
  const current = viewOf(ids);

  return (
    <div className="view-switch" role="group" aria-label="Table view">
      {RESULT_VIEWS.map(v => (
        <Tool el="button" key={v.id} tip={v.tip}
              className={`view-switch-btn${current === v.id ? ' active' : ''}`}
              aria-pressed={current === v.id}
              onClick={() => setIds(v.columns)}>
          {v.label}
        </Tool>
      ))}
      {!current && (
        <Tool el="span" className="view-switch-custom" tip="Your own column selection (change it under Columns)">
          Custom
        </Tool>
      )}
    </div>
  );
}
