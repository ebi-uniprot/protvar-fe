import { useContext } from "react";
import { AppContext } from "../../App";
import { useStorage } from "../../../context/StorageContext";
import { ColumnId, columnIdsFromPref, columnIdsToPref, DEFAULT_COLUMN_IDS } from "../../../constants/resultColumns";

// Visible result-table column ids: the live choice (AppState), else saved prefs, else defaults.
export function useResultColumns() {
  const appState = useContext(AppContext);
  const { getPrefs, setPrefs } = useStorage();
  const ids = appState.resultColumns ?? columnIdsFromPref(getPrefs().resultColumns);

  const setIds = (next: ColumnId[]) => {
    appState.updateState('resultColumns', next);
    setPrefs({ resultColumns: columnIdsToPref(next) });
  };
  const reset = () => {
    appState.updateState('resultColumns', DEFAULT_COLUMN_IDS);
    setPrefs({ resultColumns: undefined });
  };
  return { ids, setIds, reset };
}
