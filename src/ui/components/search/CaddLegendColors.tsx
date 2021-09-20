import { getColor, getTitle } from "./CaddHelper";

function CaddLegendColors() {
  return (
    <div className="search-results-legends" style={{ float: "unset" }}>
      <strong>CADD colour indications</strong>
      <br />
      <ul>
        <CaddColourLi cadd={1} />
        <CaddColourLi cadd={15} />
        <CaddColourLi cadd={20} />
        <CaddColourLi cadd={25} />
        <CaddColourLi cadd={30} />
      </ul>
    </div>
  );
}

function CaddColourLi(props: { cadd: number }) {
  return <li>
    <span className="legend-icon button--legends" style={{ backgroundColor: getColor(props.cadd) }} /> {getTitle(props.cadd.toString())}
  </li>
}
export default CaddLegendColors;
