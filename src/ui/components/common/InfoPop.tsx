import React, {useContext} from "react";
import "./InfoPop.css"
import {AppContext} from "../../App";

function ExampleInfoPop(props: {}) {
  const state = useContext(AppContext)
  const toggleModal = () => {
    state.updateState("showModal", state.showModal ? false : true);
  }
  const setModalContent = (newContent: React.JSX.Element) => {
    state.updateState("modalContent", newContent);
  }

  const openModalX = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // relative position to trigger event/object
    // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
    console.log(event.pageX)
    console.log(event.pageY)
    setModalContent(<>XXX</>)
    toggleModal()
  }
  const openModalY = () => {
    setModalContent(<>YYY</>)
    toggleModal()
  }

  return <>
    <button onClick={openModalX}>XXX</button>
    <button onClick={openModalY}>YYY</button>
  </>
}

export const InfoPop = () => {
  const state = useContext(AppContext)
  const toggleModal = () => {
    state.updateState("showModal", state.showModal ? false : true);
  }
  return (
    state.showModal ?
      <div className="info-modal" onClick={toggleModal}>
        {
          // <div style={{ top: '517px', left: '632px', width: '200px'}} className="info-modal-content" onClick={(e) => e.stopPropagation()}>
        }
        <div className="element-center"
             onClick={(e) => e.stopPropagation()}>
        <span className="info-close" onClick={toggleModal}>
          &times;
        </span>
          {state.modalContent}
        </div>
      </div>
      :
      <></>
  );
}