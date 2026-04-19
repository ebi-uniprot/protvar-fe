import { InputType } from './InputType'

export type ResultType = 'submission' | 'browse'

export interface ResultRecord {
  id: string            // dedup key: inputId for submissions, identifier value(s) for browse
  type: ResultType
  inputType?: InputType // e.g. 'input_id' | 'uniprot' | 'gene' | 'pdb' | 'ensembl' | 'refseq'
  url: string           // full relative URL incl. filter params — captures complete result state
  name?: string         // user-editable label
  savedAt: string       // ISO — when first saved/submitted
  lastViewed?: string   // ISO — last result page visit
  expiresAt?: string    // ISO — auto-set for submissions (+90 days); absent means keep forever
}

export const SUBMISSION_TTL_DAYS = 90

export const submissionExpiresAt = (): string =>
  new Date(Date.now() + SUBMISSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

/** Most-recent activity timestamp for display/sorting */
export const lastActivity = (rec: ResultRecord): string =>
  rec.lastViewed ?? rec.savedAt
