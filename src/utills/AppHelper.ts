import { NO_OF_ITEMS_PER_PAGE } from "../constants/const";

export type FileLoadFun = (file: File) => void
export type NextPageFun = (page: Page) => void

export interface Page {
  currentPage: number,
  nextPage: boolean,
  previousPage: boolean,
  totalItems: number,
  itemsPerPage: number
}
export const firstPage = (totalItems: number) => ({
  currentPage: 1,
  previousPage: false,
  nextPage: true,
  totalItems: totalItems,
  itemsPerPage: NO_OF_ITEMS_PER_PAGE
})