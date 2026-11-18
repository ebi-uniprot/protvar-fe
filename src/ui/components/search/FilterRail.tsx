import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SIDE_PANEL_ID } from "../../layout/DefaultPageLayout";
import { useStorage } from "../../../context/StorageContext";
import { Icon } from '../../elements/Icon';

interface FilterRailProps {
  activeCount: number;                              // shown on the collapsed tab: "Filters (2)"
  children: (collapse: () => void) => React.ReactNode;   // the rail's SearchFilters (layout="rail"), given its collapse
}

// The filters as a rail in the layout's side-panel column, beside the results on the left (next to the app sidebar).
// One element whose width animates (300px ↔ 36px): the panel fades out and the tab fades in. Collapsed or not is
// remembered, and shared by every page that shows the rail.
const FilterRail: React.FC<FilterRailProps> = ({ activeCount, children }) => {
  const { getPrefs, setPrefs } = useStorage();
  const [collapsed, setCollapsed] = useState(() => !!getPrefs().filterRailCollapsed);
  // The layout's side-panel column, found after the layout mounts
  const [sidePanelEl, setSidePanelEl] = useState<HTMLElement | null>(null);
  useEffect(() => setSidePanelEl(document.getElementById(SIDE_PANEL_ID)), []);
  const toggle = useCallback(() => setCollapsed(c => {
    setPrefs({ filterRailCollapsed: !c });
    return !c;
  }), [setPrefs]);

  const rail = (
    <aside className={`filter-rail${collapsed ? ' collapsed' : ''}`} aria-label="Filters">
      <div className="filter-rail-inner" aria-hidden={collapsed}>
        {children(toggle)}
      </div>
      <button type="button" className="filter-rail-tab" onClick={toggle} aria-label="Show filters"
              tabIndex={collapsed ? 0 : -1}>
        <span className="filter-rail-tab__top"><Icon name="chevron-double-right" /></span>
        <span className="filter-rail-tab__label">
          <Icon name="funnel" /> Filters{activeCount ? ` (${activeCount})` : ''}
        </span>
      </button>
    </aside>
  );
  return sidePanelEl ? createPortal(rail, sidePanelEl) : null;
};

export default FilterRail;
