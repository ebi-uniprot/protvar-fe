import { StringVoidFun } from '../../../../constants/CommonTypes';
import {Comment} from "../../../../types/Comment";
interface RegionProteinProps {
  comments: Array<Comment>
  // accession: string
  // position: number
  toggleProteinRegion: StringVoidFun
  expandedRegionKey: string
}
export default RegionProteinProps;