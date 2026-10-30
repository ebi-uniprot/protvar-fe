import { useContext, useState } from "react";
import { ColumnGroup, ColumnId, inGroup, RESULT_COLUMNS } from "../../../constants/resultColumns";
import { useResultColumns } from "./useResultColumns";
import ViewSwitch, { LayoutSwitch } from "./ViewSwitch";
import { ResultLayout } from "../../../types/UserPrefs";
import { AppContext } from "../../App";

const GROUPS: { group: ColumnGroup; title: string }[] = [
  { group: 'genomic', title: 'Genomic' },
  { group: 'protein', title: 'Protein' },
];

// Drawer content: how the results look — layout, columns and colours. Changes apply immediately and are remembered.
export default function ColumnChooser({ layout, onLayoutChange }: {
  layout: ResultLayout; onLayoutChange: (l: ResultLayout) => void;
}) {
  const { ids, setIds, reset } = useResultColumns();
  const appState = useContext(AppContext);
  // the drawer's element is created once, so it keeps its own copy of the layout
  const [current, setCurrent] = useState(layout);
  const changeLayout = (l: ResultLayout) => { setCurrent(l); onLayoutChange(l); };

  const toggle = (id: ColumnId) =>
    setIds(ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);

  return (
    <div className="column-chooser">
      <h3>View</h3>
      <strong className="column-chooser-section">Layout</strong>
      <LayoutSwitch layout={current} onChange={changeLayout} />
      <strong className="column-chooser-section">Columns</strong>
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
      <button className="btn btn-secondary" onClick={reset}>Reset columns</button>
      <p className="column-chooser-note">Downloads always include all columns.</p>
      <strong className="column-chooser-section">Colours</strong>
      <label className="toggle-switch" title="Toggle between ProtVar standardised and original source colours">
        <input type="checkbox" checked={appState.stdColor}
               onChange={() => appState.updateState("stdColor", !appState.stdColor)} />
        <span className="toggle-track"><span className="toggle-thumb"></span></span>
        <span className="toggle-label">ProtVar colours</span>
      </label>
    </div>
  );
}
