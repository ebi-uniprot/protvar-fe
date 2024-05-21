import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
import {MappingRecord} from "../../../utills/Convertor";

interface ScoreRadarProps {
  record: MappingRecord
}
// <RadarChart></RadarChart>;
// Input: X	149498202		C	G
// Conservation 0.918
// AlphaMissense 0.9927
// EVE 0.875
// ESM-1b ref -15.966

/*
const data = [
  {
    data: {
      conserv: 0.918,
      cadd: 26.0 / 99,
      am: 0.9927,
      eve: 0.875,
      esm: -15.966 / -25,
    },
    meta: { color: "red" },
  },
];

const captions = {
  // columns
  conserv: "Conservation",
  cadd: "CADD",
  am: "AlphaMissense",
  eve: "EVE",
  esm: "ESM-1b",
};
*/
function ScoreRadar(props: ScoreRadarProps) {

  var data: { [key: string] : number } = {};
  var captions : {[key: string] : string } = {};

  if (props.record.cadd) {
    const caddScore = Number(props.record.cadd)
    if (!Number.isNaN(caddScore)) {
      data["cadd"] = caddScore / 99
      captions["cadd"] = "CADD"
    }
  }

  if (props.record.conservScore && props.record.conservScore.score) {
    data["conserv"] = props.record.conservScore.score
    captions["conserv"] = "Conservation"
  }

  return <RadarChart captions={captions} data={[ {data: data, meta: { color: "red" },}]} size={300} />

}

export default ScoreRadar;