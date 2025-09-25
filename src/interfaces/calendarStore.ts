import { Country } from "./Country"

export type ViewType = "monthly" | "quarterly"

export interface CalendarState {
  country: Country // two letter ISO 3166-1 alpha-2 code.
  year: number
  month: number
  view: ViewType
  isSheetOpen: boolean
  setCountry: (country: Country) => void
  setYear: (year: number) => void
  setMonth: (month: number) => void
  setView: (view: ViewType) => void
  nextMonth: () => void
  prevMonth: () => void
  toggleSheet: () => void
}
