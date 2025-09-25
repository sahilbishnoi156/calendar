"use client";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarState } from "@/interfaces/calendarStore";
import { useCalendarStore } from "@/store/calenderStore";
import { Holiday } from "@/interfaces/holiday";
import { fetchHolidays, fetchQuarterlyHolidays } from "@/lib/calendarService";


const renderCalendarGrid = (
  year: number,
  month: number,
  holidays: Holiday[]
) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const weeks: Array<
    (null | { day: number; holidays: Holiday[]; isToday: boolean })[]
  > = Array.from(
    { length: Math.ceil((daysInMonth + firstDayOfMonth) / 7) },
    (_, weekIndex) => {
      return Array.from({ length: 7 }, (_, dayIndex) => {
        const day = weekIndex * 7 + dayIndex - firstDayOfMonth + 1;
        if (day < 1 || day > daysInMonth) return null;
        const dayHolidays = holidays.filter((h) => h.date.getDate() === day);
        return {
          day,
          holidays: dayHolidays,
          isToday: isCurrentMonth && today.getDate() === day,
        };
      });
    }
  );

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      {weeks.map((week, weekIndex) => {
        const totalHolidays = week.reduce((acc, day) => acc + (day?.holidays.length || 0), 0);
        return (
          <div
            key={weekIndex}
            className={cn(
              "grid grid-cols-7 gap-1 rounded-lg p-2 transition-all duration-200",
              totalHolidays > 1 &&
                "bg-green-300/60 dark:bg-green-800/30 border border-green-300 dark:border-green-700",
              totalHolidays === 1 &&
                "bg-green-100/60 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            )}
          >
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center p-1 rounded-md transition-all hover:bg-blue-200/20 relative",
                  day?.isToday &&
                    "bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90",
                  day &&
                    day.holidays.length > 0 &&
                    !day.isToday &&
                    " dark:bg-green-900/40  ",
                  !day && "opacity-0"
                )}
              >
                {day && (
                  <>
                    <span
                      className={cn(
                        "text-sm relative z-10",
                        day.isToday ? "font-bold" : "font-medium"
                      )}
                    >
                      {day.day}
                    </span>
                    {day.holidays.length > 0 && (
                      <div className="flex items-center justify-center mt-0.5">
                        {day.holidays.length === 1 ? (
                          <div className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full" />
                        ) : (
                          <div className="flex gap-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1 h-1 bg-green-600 dark:bg-green-400 rounded-full"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default function CalendarView() {
  const { month, year, view, country, nextMonth, prevMonth } = useCalendarStore(
    useShallow((state: CalendarState) => ({
      month: state.month,
      year: state.year,
      view: state.view,
      country: state.country,
      nextMonth: state.nextMonth,
      prevMonth: state.prevMonth,
    }))
  );

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHolidays = async () => {
      setLoading(true);
      setError(null);

      try {
        let fetchedHolidays: Holiday[];

        if (view === "quarterly") {
          const quarterStartMonth = Math.floor(month / 3) * 3;
          fetchedHolidays = await fetchQuarterlyHolidays(
            country.Code,
            year,
            quarterStartMonth
          );
        } else {
          fetchedHolidays = await fetchHolidays(country.Code, year, month);
        }

        setHolidays(fetchedHolidays);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load holidays"
        );
        console.error("[v0] Error in loadHolidays:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHolidays();
  }, [month, year, country, view]);

  const renderCalendar = () => {
    if (view === "monthly") {
      return (
        <div className="space-y-6">
          <Card className="sm:p-6 p-2">
            {renderCalendarGrid(year, month, holidays)}
          </Card>

          {holidays.length > 0 && (
            <Card className="sm:p-6 p-2">
              <h3 className="text-lg font-semibold mb-4">
                Holidays this month
              </h3>
              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-shrink-0">
                      <Badge
                        variant="outline"
                        className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      >
                        {holiday.date.getDate()}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{holiday.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {holiday.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      );
    }

    if (view === "quarterly") {
      const quarterStartMonth = Math.floor(month / 3) * 3;
      const quarterMonths = [
        quarterStartMonth,
        quarterStartMonth + 1,
        quarterStartMonth + 2,
      ];

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {quarterMonths.map((monthIndex) => {
              const monthHolidays = holidays.filter(
                (h) =>
                  h.date.getMonth() === monthIndex &&
                  h.date.getFullYear() === year
              );

              return (
                <Card key={monthIndex} className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-center">
                      {new Date(year, monthIndex).toLocaleDateString("en-US", {
                        month: "long",
                      })}
                    </h3>
                    <p className="text-xs text-muted-foreground text-center">
                      {monthHolidays.length} holidays
                    </p>
                  </div>
                  <div className="scale-90 origin-top">
                    {renderCalendarGrid(year, monthIndex, monthHolidays)}
                  </div>
                </Card>
              );
            })}
          </div>

          {holidays.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                All holidays in Q{Math.floor(month / 3) + 1} {year}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((offset) => {
                  const monthIndex = quarterStartMonth + offset;
                  const monthHolidays = holidays.filter(
                    (h) =>
                      h.date.getMonth() === monthIndex &&
                      h.date.getFullYear() === year
                  );

                  if (monthHolidays.length === 0) return null;

                  return (
                    <div key={monthIndex}>
                      <h4 className="font-medium mb-3 text-sm text-muted-foreground">
                        {new Date(year, monthIndex).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                          }
                        )}
                      </h4>
                      <div className="space-y-2">
                        {monthHolidays.map((holiday) => (
                          <div
                            key={holiday.id}
                            className="flex items-start gap-2 p-2 rounded-md bg-muted/30"
                          >
                            <Badge
                              variant="outline"
                              className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-xs"
                            >
                              {holiday.date.getDate()}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs">
                                {holiday.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {holiday.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white flex flex-1 rounded-xl sm:ml-6 sm:mb-6  min-h-screen overflow-y-auto">
      <div className="w-full sm:p-6 p-2 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h2 className="text-xl font-semibold text-balance">
            {view === "quarterly"
              ? `Q${Math.floor(month / 3) + 1} ${year}`
              : new Date(year, month).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
          </h2>

          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {loading && (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">Loading holidays...</div>
          </Card>
        )}

        {error && (
          <Card className="p-8 text-center">
            <div className="text-destructive">Error: {error}</div>
          </Card>
        )}

        {!loading && !error && renderCalendar()}
      </div>
    </div>
  );
}
