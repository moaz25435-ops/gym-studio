import { ConvexError } from "convex/values";

export const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type ScheduleEntry = {
  id: string;
  title: string;
  focus: string;
  day: string;
  time: string;
  duration: number;
  coach: string;
  level: string;
  capacity: number;
  taken: number;
  remaining: number;
  reserved: boolean;
};

/** Group timetable entries into ordered, non-empty days. */
export function groupByDay(entries: ScheduleEntry[]) {
  return DAY_ORDER.map((day) => ({
    day,
    entries: entries.filter((entry) => entry.day === day),
  })).filter((group) => group.entries.length > 0);
}

/** Readable message for anything thrown by a Convex function. */
export function readError(error: unknown) {
  if (error instanceof ConvexError) {
    return typeof error.data === "string"
      ? error.data
      : "That didn't go through. Please try again.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
