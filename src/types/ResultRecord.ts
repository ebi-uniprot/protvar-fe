// Maybe group results by Viewed & Submitted
import {getLatestDate} from "../utills/DateUtil";

export interface ResultRecord {
  id: string  // required
  url: string
  firstSubmitted?: string // TODO make optional - when shared, user will only have viewed this, not submitted
  lastSubmitted?: string // TODO same for this
  lastViewed?: string //
  name?: string
  numItems?: number
  params?: string // page, pageSize, assembly
}

export const lastUpdate = (rec: ResultRecord) => {
  return getLatestDate([rec.firstSubmitted, rec.lastSubmitted, rec.lastViewed]);
}