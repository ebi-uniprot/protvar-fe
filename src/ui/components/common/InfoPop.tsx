import {useContext} from "react";
import "./InfoPop.css"
import {AppContext} from "../../App";

function ExampleInfoPop(props: {}) {
  const context = useContext(AppContext)
  const openModalX = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(event.pageX)
    console.log(event.pageY)
    context.setModalContent(<>XXX</>)
    context.toggleModal()
  }
  const openModalY = () => {
    context.setModalContent(<>YYY</>)
    context.toggleModal()
  }

  return <>
    <button onClick={openModalX}>XXX</button>
    <button onClick={openModalY}>YYY</button>
  </>
}

export const InfoPop = () => {
  const context = useContext(AppContext)
  return (
    context.showModal ?
      <div className="info-modal" onClick={context.toggleModal}>
        {
          // <div style={{ top: '517px', left: '632px', width: '200px'}} className="info-modal-content" onClick={(e) => e.stopPropagation()}>
        }
        <div className="element-center"
             onClick={(e) => e.stopPropagation()}>
        <span className="info-close" onClick={context.toggleModal}>
          &times;
        </span>
          {context.modalContent}
        </div>
      </div>
      :
      <></>
  );
}