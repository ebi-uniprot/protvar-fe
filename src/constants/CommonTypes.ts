export type StringVoidFun = (id: string) => void
export enum Assembly { GRCh38="GRCh38", GRCh37="GRCh37", AUTO="AUTO"}
export const DEFAULT_ASSEMBLY = Assembly.AUTO