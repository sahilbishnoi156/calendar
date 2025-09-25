import { CalendarState } from "@/interfaces/calendarStore"
import { create } from "zustand"


export const useCalendarStore = create<CalendarState>((set) => ({
  country: {
    Name: "India",
    Code: "IN",
  },
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  view: "monthly",
  isSheetOpen: true,

  setCountry: (country) => set({ country }),
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
  setView: (view) => set({ view }),

  nextMonth: () =>
    set((state) => {
      if (state.view === "quarterly") {
        // Move to next quarter (3 months ahead)
        const next = new Date(state.year, state.month + 3)
        return { year: next.getFullYear(), month: next.getMonth() }
      } else {
        // Move to next month
        const next = new Date(state.year, state.month + 1)
        return { year: next.getFullYear(), month: next.getMonth() }
      }
    }),

  prevMonth: () =>
    set((state) => {
      if (state.view === "quarterly") {
        // Move to previous quarter (3 months back)
        const prev = new Date(state.year, state.month - 3)
        return { year: prev.getFullYear(), month: prev.getMonth() }
      } else {
        // Move to previous month
        const prev = new Date(state.year, state.month - 1)
        return { year: prev.getFullYear(), month: prev.getMonth() }
      }
    }),

  toggleSheet: () => set((state) => ({ isSheetOpen: !state.isSheetOpen })),
}))
