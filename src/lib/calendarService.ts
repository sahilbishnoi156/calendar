import { Holiday } from "@/interfaces/holiday";
import { GoogleCalendarEvent } from "@/interfaces/googleCalendarEvent";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const getCountryCalendarId = (countryCode: string): string => {
  const calendarIds: Record<string, string> = {
    US: "en.usa#holiday@group.v.calendar.google.com",
    IN: "en.indian#holiday@group.v.calendar.google.com",
    GB: "en.uk#holiday@group.v.calendar.google.com",
    CA: "en.canadian#holiday@group.v.calendar.google.com",
    AU: "en.australian#holiday@group.v.calendar.google.com",
    DE: "en.german#holiday@group.v.calendar.google.com",
    FR: "en.french#holiday@group.v.calendar.google.com",
    JP: "en.japanese#holiday@group.v.calendar.google.com",
    CN: "en.china#holiday@group.v.calendar.google.com",
    BR: "en.brazilian#holiday@group.v.calendar.google.com",
  };
  return calendarIds[countryCode] || calendarIds.US;
};

export const fetchHolidays = async (
  countryCode: string,
  year: number,
  month: number
): Promise<Holiday[]> => {
  try {
    const calendarId = getCountryCalendarId(countryCode);
    const timeMin = new Date(year, month, 1).toISOString();
    const timeMax = new Date(year, month + 1, 0).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${GOOGLE_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);

    const data = await response.json();
    return (data.items || []).map((item: GoogleCalendarEvent) => ({
      id: item.id,
      name: item.summary,
      description: item.description,
      date: new Date(item.start.date),
    }));
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
};

export const fetchQuarterlyHolidays = async (
  countryCode: string,
  year: number,
  quarterStartMonth: number
): Promise<Holiday[]> => {
  const promises = Array.from({ length: 3 }, (_, i) =>
    fetchHolidays(countryCode, year, quarterStartMonth + i)
  );
  try {
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error("Error fetching quarterly holidays:", error);
    return [];
  }
};