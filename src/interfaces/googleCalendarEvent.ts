export interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    date: string
  }
  end: {
    date: string
  }
}