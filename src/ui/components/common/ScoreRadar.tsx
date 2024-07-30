import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
import {ConservScore} from "../../../types/MappingResponse";

interface ScoreRadarProps {
  caddScore: number
  conservScore: ConservScore
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

  data["cadd"] = props.caddScore / 99
  captions["cadd"] = "CADD"

  if (props.conservScore && props.conservScore.score) {
    data["conserv"] = props.conservScore.score
    captions["conserv"] = "Conservation"
  }

  return <RadarChart captions={captions} data={[ {data: data, meta: { color: "red" },}]} size={300} />

}

export default ScoreRadar;