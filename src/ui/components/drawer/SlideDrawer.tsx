import React, {useContext} from "react";
import "./SlideDrawer.css";
import {AppContext} from "../../App";

export const SlideDrawer = () => {

  const state = useContext(AppContext)

  return (
    <div>
      <div className={`side-drawer ${state.drawer ? `open` : ``}`}>
      <span className="info-close" onClick={_=>state.updateState("drawer", undefined)}>
          &times;
        </span>
        {state.drawer}
      </div> {state.drawer &&
      <div className="backdrop" onClick={_=>state.updateState("drawer", undefined)}></div>}
    </div>
  );
};

export default SlideDrawer;