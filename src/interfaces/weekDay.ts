import { Holiday } from "./holiday";

interface WeekDay {
  day: number;
  holidays: Holiday[];
  isToday: boolean;
  isCurrentMonth: boolean;
}
export type { WeekDay };