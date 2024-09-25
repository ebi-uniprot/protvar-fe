import React, {useContext, useEffect, useState} from "react";
import "./SideDrawer.css";
import {AppContext} from "../../App";

export const SideDrawer = () => {

  const state = useContext(AppContext)
  const [width, setWidth] = useState('50%');

  const closeDrawer = () => {
    state.updateState("drawer", undefined)
  }
  const handleToggleWidth = () => {
    setWidth(width === '50%' ? '80%' : '50%');
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div>
      <div className={`side-drawer ${state.drawer ? `open` : ``}`} style={{width}}>
        <div style={{display: "flex", justifyContent: "space-between", paddingBottom: "30px"}}>
          <button className={`bi bi-arrow-bar-${width === '50%' ? `left` : `right`}`} onClick={handleToggleWidth}>
            {width === '50%' ? ` Expand` : ` Collapse`}
          </button>
          <button className="bi bi-x-square" onClick={closeDrawer}> Close</button>
        </div>
        {state.drawer}
      </div>
      {state.drawer &&
        <div className="backdrop" onClick={_ => state.updateState("drawer", undefined)}></div>}
    </div>
  );
};

export default SideDrawer;