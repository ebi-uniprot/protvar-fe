import React, {useContext, useEffect, useState} from "react";
import "./SideDrawer.css";
import {AppContext} from "../../App";

export const SideDrawer = () => {
  const state = useContext(AppContext)
  const [width, setWidth] = useState('50%');

  const handleToggleWidth = () => {
    setWidth(width === '50%' ? '80%' : '50%');
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        state.updateState("drawer", undefined);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  });

  return (
    <>
      {/* Overlay */}
      {state.drawer && (
        <div className="drawer-overlay" onClick={() => state.updateState("drawer", undefined)}></div>
      )}

      {/* Drawer */}
      <div className={`side-drawer ${state.drawer ? 'open' : ''}`} style={{width}}>
        <div className="drawer-header">
          <button
            className="drawer-control-btn"
            onClick={handleToggleWidth}
            title={width === '50%' ? 'Expand drawer' : 'Collapse drawer'}
          >
            <i className={`bi bi-${width === '50%' ? 'arrows-angle-expand' : 'arrows-angle-contract'}`}></i>
            <span>{width === '50%' ? 'Expand' : 'Collapse'}</span>
          </button>
          <button
            className="drawer-close-btn"
            onClick={() => state.updateState("drawer", undefined)}
            title="Close drawer"
          >
            <i className="bi bi-x-lg"></i>
            <span>Close</span>
          </button>
        </div>

        <div className="drawer-content">
          {state.drawer}
        </div>
      </div>
    </>
  );
};

export default SideDrawer;