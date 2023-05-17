import { EmptyElement } from "../../../constants/ConstElement";
import { getColor, getTitle } from "./CaddHelper";

function CaddLegendColors() {
  return (
    <div className="search-results-legends" style={{ float: "unset" }}>
      <strong>CADD phred-like score colour</strong>
      <br />
      <br />
      <div className="flex-column">
        <CaddColourLi cadd={1} />
        <CaddColourLi cadd={15} />
        <CaddColourLi cadd={20} />
        <CaddColourLi cadd={25} />
        <CaddColourLi cadd={30} />
      </div>
    </div>
  );
}

function CaddColourLi(props: { cadd: number }) {
  const texts = getTitle(props.cadd.toString())?.split("-")
  if (!texts || texts.length < 2)
    return EmptyElement
  return <>
    <div className="flex">
      <ul><li><span className="legend-icon button--legends" style={{ backgroundColor: getColor(props.cadd) }} /></li></ul>
      <div className="flex1">{texts[0]}</div>
      <div className="flex2">{texts[1]}</div>
    </div>
  </>
}
export default CaddLegendColors;
