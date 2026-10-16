import { ColumnGroup, ColumnId, inGroup, RESULT_COLUMNS } from "../../../constants/resultColumns";
import { useResultColumns } from "./useResultColumns";
import ViewSwitch from "./ViewSwitch";

const GROUPS: { group: ColumnGroup; title: string }[] = [
  { group: 'genomic', title: 'Genomic' },
  { group: 'protein', title: 'Protein' },
];

// Drawer content: choose which result-table columns to show. Changes apply immediately and are remembered.
export default function ColumnChooser() {
  const { ids, setIds, reset } = useResultColumns();

  const toggle = (id: ColumnId) =>
    setIds(ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);

  return (
    <div className="column-chooser">
      <h3>Table columns</h3>
      <p className="column-chooser-hint">Start from a view, then add or remove columns.</p>
      <ViewSwitch />
      {GROUPS.map(({ group, title }) => (
        <div key={group} className="column-chooser-group">
          <strong>{title}</strong>
          {inGroup(RESULT_COLUMNS, group).map(c => (
            <label key={c.id} className="column-chooser-item">
              <input type="checkbox"
                     checked={c.locked || ids.includes(c.id)}
                     disabled={c.locked}
                     onChange={() => toggle(c.id)} />
              {' '}{c.label}
            </label>
          ))}
        </div>
      ))}
      <button className="btn btn-secondary" onClick={reset}>Reset to default</button>
      <p className="column-chooser-note">Downloads always include all columns.</p>
    </div>
  );
}
