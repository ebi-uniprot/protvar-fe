// Maybe group results by Viewed & Submitted
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