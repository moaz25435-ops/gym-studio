import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";

/**
 * The studio timetable. Kept as a static catalogue so the schedule can be
 * rendered on the landing page and reserved against by signed-in members.
 */
export const STUDIO_CLASSES = [
  {
    id: "sunrise-strength",
    title: "Sunrise Strength",
    focus: "Barbell",
    day: "Monday",
    time: "06:30",
    duration: 45,
    coach: "Elena Richt",
    level: "All levels",
    capacity: 14,
  },
  {
    id: "reformer-flow",
    title: "Reformer Flow",
    focus: "Pilates",
    day: "Monday",
    time: "09:00",
    duration: 50,
    coach: "Mara Solis",
    level: "Beginner",
    capacity: 10,
  },
  {
    id: "mobility-edit",
    title: "The Mobility Edit",
    focus: "Mobility",
    day: "Tuesday",
    time: "07:15",
    duration: 40,
    coach: "Idris Vane",
    level: "All levels",
    capacity: 16,
  },
  {
    id: "tempo-rows",
    title: "Tempo Rows",
    focus: "Conditioning",
    day: "Tuesday",
    time: "18:30",
    duration: 45,
    coach: "Elena Richt",
    level: "Intermediate",
    capacity: 12,
  },
  {
    id: "quiet-yoga",
    title: "Quiet Yoga",
    focus: "Restore",
    day: "Wednesday",
    time: "08:00",
    duration: 60,
    coach: "Noor Bellamy",
    level: "All levels",
    capacity: 18,
  },
  {
    id: "lower-house",
    title: "Lower House",
    focus: "Strength",
    day: "Wednesday",
    time: "17:45",
    duration: 50,
    coach: "Idris Vane",
    level: "Intermediate",
    capacity: 12,
  },
  {
    id: "sprint-lab",
    title: "Sprint Lab",
    focus: "Conditioning",
    day: "Thursday",
    time: "06:45",
    duration: 40,
    coach: "Mara Solis",
    level: "Advanced",
    capacity: 10,
  },
  {
    id: "press-room",
    title: "The Press Room",
    focus: "Upper body",
    day: "Thursday",
    time: "18:00",
    duration: 45,
    coach: "Elena Richt",
    level: "All levels",
    capacity: 14,
  },
  {
    id: "long-form",
    title: "Long Form",
    focus: "Endurance",
    day: "Friday",
    time: "07:00",
    duration: 55,
    coach: "Idris Vane",
    level: "All levels",
    capacity: 16,
  },
  {
    id: "studio-steady",
    title: "Studio Steady",
    focus: "Full body",
    day: "Saturday",
    time: "09:30",
    duration: 60,
    coach: "Noor Bellamy",
    level: "Beginner",
    capacity: 20,
  },
] as const;

export const CLASS_IDS = STUDIO_CLASSES.map((entry) => entry.id);

async function reserveCount(ctx: QueryCtx, classId: string) {
  const reservations = await ctx.db
    .query("reservations")
    .withIndex("by_class", (q) => q.eq("classId", classId))
    .collect();
  return reservations.length;
}

/** The full timetable with live availability and the caller's reservations. */
export const schedule = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    const reserved = new Set<string>();
    if (userId) {
      const mine = await ctx.db
        .query("reservations")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      mine.forEach((entry) => reserved.add(entry.classId));
    }

    const classes = await Promise.all(
      STUDIO_CLASSES.map(async (entry) => {
        const taken = await reserveCount(ctx, entry.id);
        return {
          ...entry,
          taken,
          remaining: Math.max(entry.capacity - taken, 0),
          reserved: reserved.has(entry.id),
        };
      }),
    );

    return classes;
  },
});

/** Reserve or release a spot in a class for the signed-in member. */
export const toggleReservation = mutation({
  args: { classId: v.string() },
  handler: async (ctx, { classId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Sign in to reserve a class.");
    }

    const studioClass = STUDIO_CLASSES.find((entry) => entry.id === classId);
    if (!studioClass) {
      throw new ConvexError("That class is no longer on the timetable.");
    }

    const existing = await ctx.db
      .query("reservations")
      .withIndex("by_user_class", (q) =>
        q.eq("userId", userId).eq("classId", classId),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { reserved: false };
    }

    const taken = await reserveCount(ctx, classId);
    if (taken >= studioClass.capacity) {
      throw new ConvexError("This class is fully booked.");
    }

    await ctx.db.insert("reservations", {
      userId,
      classId,
      createdAt: Date.now(),
    });
    return { reserved: true };
  },
});

/** Landing-page enquiry form. Public on purpose so prospective members can reach out. */
export const submitLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    focus: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, { name, email, focus, message }) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      throw new ConvexError("Please share your name.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new ConvexError("Please share a valid email address.");
    }

    await ctx.db.insert("leads", {
      name: trimmedName,
      email: trimmedEmail,
      focus,
      message: message?.trim() ? message.trim() : undefined,
      createdAt: Date.now(),
    });

    return { ok: true };
  },
});
