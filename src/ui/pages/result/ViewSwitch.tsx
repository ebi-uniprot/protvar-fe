import { RESULT_VIEWS, viewOf } from "../../../constants/resultColumns";
import { useResultColumns } from "./useResultColumns";
import Tool from "../../elements/Tooltip";
import { ResultLayout } from "../../../types/UserPrefs";

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

const LAYOUTS: { id: ResultLayout; label: string; tip: string }[] = [
  { id: 'rows', label: 'Rows', tip: 'One continuous table' },
  { id: 'cards', label: 'Cards', tip: 'One card per input line' },
  { id: 'compact', label: 'Compact', tip: 'Cards with tighter spacing' },
];

// Rows | Cards | Compact (cards) result layout.
export function LayoutSwitch({ layout, onChange }: { layout: ResultLayout; onChange: (l: ResultLayout) => void }) {
  return (
    <div className="view-switch" role="group" aria-label="Result layout">
      {LAYOUTS.map(l => (
        <Tool el="button" key={l.id} tip={l.tip}
              className={`view-switch-btn${layout === l.id ? ' active' : ''}`}
              aria-pressed={layout === l.id}
              onClick={() => onChange(l.id)}>
          {l.label}
        </Tool>
      ))}
    </div>
  );
}
