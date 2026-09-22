import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { groupByDay, readError } from "@/lib/studio";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const PLAN = {
  name: "Studio",
  price: "149",
  renews: "Renews on the 1st of each month",
  includes: [
    "Unlimited classes",
    "Recovery room & sauna",
    "One guest pass each month",
    "Quarterly movement review",
  ],
};

type ViewKey = "overview" | "timetable" | "membership";

const NAV: { key: ViewKey; label: string; icon: LucideIcon }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "timetable", label: "Timetable", icon: CalendarDays },
  { key: "membership", label: "Membership", icon: CreditCard },
];

function StudioMark() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 items-center justify-center border border-[var(--line)] text-[0.7rem] font-medium tracking-[0.1em]">
        M
      </span>
      <span className="text-[0.75rem] font-medium uppercase tracking-[0.3em]">
        Meridian
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const schedule = useQuery(api.studio.schedule);
  const toggleReservation = useMutation(api.studio.toggleReservation);

  const [view, setView] = useState<ViewKey>("overview");
  const [pendingClass, setPendingClass] = useState<string | null>(null);

  const reservations = schedule?.filter((entry) => entry.reserved) ?? [];
  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "member";
  const initial = displayName.charAt(0).toUpperCase();

  const grouped = schedule ? groupByDay(schedule) : [];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleToggle = async (classId: string) => {
    setPendingClass(classId);
    try {
      const result = await toggleReservation({ classId });
      toast.success(
        result.reserved ? "Place reserved" : "Place released",
        {
          description: result.reserved
            ? "It's on your timetable. Arrive ten minutes early."
            : "Your spot is back in the pool.",
        },
      );
    } catch (error) {
      toast.error("Reservation not updated", { description: readError(error) });
    } finally {
      setPendingClass(null);
    }
  };

  const navList = (
    <nav className="flex flex-col">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = view === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setView(item.key)}
            className={`flex items-center gap-3 border-l-2 px-5 py-3 text-left text-sm transition-colors ${
              active
                ? "border-l-[var(--clay)] bg-[var(--sidebar-accent)] text-foreground"
                : "border-l-transparent text-muted-foreground hover:bg-[var(--sidebar-accent)] hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--sidebar)] lg:flex">
        <div className="flex h-16 items-center border-b border-[var(--line)] px-5">
          <Link to="/" className="transition-opacity hover:opacity-70">
            <StudioMark />
          </Link>
        </div>
        <div className="py-6">{navList}</div>
        <div className="mt-auto border-t border-[var(--line)] p-5">
          <p className="truncate text-sm">{displayName}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {user?.email ?? "Signed in"}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="mt-4 w-full rounded-sm text-[0.68rem] uppercase tracking-[0.16em]"
          >
            <LogOut className="mr-2 size-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[var(--line)] bg-background/85 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon" className="rounded-sm">
                  <Menu className="size-4" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 border-[var(--line)] p-0 shadow-none"
              >
                <SheetHeader className="border-b border-[var(--line)] px-5 py-4">
                  <SheetTitle className="studio-serif text-lg font-normal">
                    Meridian
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">{navList}</div>
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                Member area
              </p>
              <p className="studio-serif text-lg leading-6">
                {NAV.find((item) => item.key === view)?.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-right text-xs text-muted-foreground sm:block">
              {PLAN.name} member
            </span>
            <span className="flex size-9 items-center justify-center border border-[var(--line)] text-sm">
              {initial}
            </span>
          </div>
        </header>

        <main className="flex-1 px-5 py-10 sm:px-8 lg:py-12">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-5xl"
          >
            {view === "overview" && (
              <div className="flex flex-col gap-10">
                <div>
                  <span className="studio-label">Welcome back</span>
                  <h1 className="studio-serif mt-3 text-3xl sm:text-4xl">
                    {displayName}, the floor is yours.
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                    Your programme is held by Elena Richt this cycle. Reservations
                    are live below — release a place you can't make so another
                    member can take it.
                  </p>
                </div>

                <dl className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
                  {[
                    { term: "Reserved this week", value: String(reservations.length) },
                    { term: "Membership", value: PLAN.name },
                    { term: "Coach", value: "Elena Richt" },
                  ].map((stat) => (
                    <div key={stat.term} className="bg-background p-6">
                      <dt className="studio-label">{stat.term}</dt>
                      <dd className="studio-serif mt-2 text-2xl">{stat.value}</dd>
                    </div>
                  ))}
                </dl>

                <section>
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-4">
                    <h2 className="studio-serif text-xl">Your reserved sessions</h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setView("timetable")}
                      className="rounded-sm text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
                    >
                      Browse timetable
                      <ArrowRight className="ml-2 size-3.5" />
                    </Button>
                  </div>

                  {schedule === undefined ? (
                    <div className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Loading your week…
                    </div>
                  ) : reservations.length === 0 ? (
                    <div className="py-8">
                      <p className="studio-serif text-lg">
                        Nothing reserved yet.
                      </p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Fourteen classes run each week, all capped at small
                        numbers. Pick one from the timetable to hold a place.
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setView("timetable")}
                        className="mt-5 rounded-sm text-[0.68rem] uppercase tracking-[0.16em]"
                      >
                        Open the timetable
                      </Button>
                    </div>
                  ) : (
                    <ul className="flex flex-col">
                      {reservations.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] py-4 last:border-b-0"
                        >
                          <div className="flex items-baseline gap-5">
                            <span className="text-sm tabular-nums text-[var(--clay)]">
                              {entry.time}
                            </span>
                            <div>
                              <p className="studio-serif text-lg leading-6">
                                {entry.title}
                              </p>
                              <p className="mt-1 text-[0.66rem] uppercase tracking-[0.16em] text-muted-foreground">
                                {entry.day} · {entry.coach} · {entry.duration} min
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={pendingClass === entry.id}
                            onClick={() => handleToggle(entry.id)}
                            className="rounded-sm text-[0.66rem] uppercase tracking-[0.16em]"
                          >
                            {pendingClass === entry.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              "Release"
                            )}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
                  <span className="studio-label">Note from the studio</span>
                  <p className="studio-serif mt-3 max-w-2xl text-xl leading-8">
                    “Next cycle we add a Thursday evening mobility session. If
                    your shoulders have opinions about pressing, block the
                    18:00 slot.”
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Idris Vane — Head of coaching
                  </p>
                </section>
              </div>
            )}

            {view === "timetable" && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="studio-label">This week</span>
                    <h1 className="studio-serif mt-3 text-3xl sm:text-4xl">
                      Reserve a class.
                    </h1>
                  </div>
                  <p className="max-w-xs text-xs leading-6 text-muted-foreground">
                    Times are studio local. Reservations close fifteen minutes
                    before each session.
                  </p>
                </div>

                {schedule === undefined ? (
                  <div className="flex items-center gap-3 border border-[var(--line)] p-8 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading the timetable…
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {grouped.map((group) => (
                      <div
                        key={group.day}
                        className="grid gap-4 border-t border-[var(--line)] py-6 sm:grid-cols-[7rem_1fr]"
                      >
                        <div>
                          <p className="studio-serif text-lg">{group.day}</p>
                          <p className="text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground sm:mt-1">
                            {group.entries.length} sessions
                          </p>
                        </div>
                        <div className="flex flex-col">
                          {group.entries.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-[var(--line)] py-4 last:border-b-0 last:pb-0 sm:py-3.5"
                            >
                              <div className="flex min-w-0 items-baseline gap-5">
                                <span className="text-sm tabular-nums text-[var(--clay)]">
                                  {entry.time}
                                </span>
                                <div className="min-w-0">
                                  <p className="studio-serif text-lg leading-6">
                                    {entry.title}
                                  </p>
                                  <p className="mt-1 text-[0.66rem] uppercase tracking-[0.16em] text-muted-foreground">
                                    {entry.focus} · {entry.duration} min ·{" "}
                                    {entry.coach} · {entry.level}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                                  {entry.remaining} / {entry.capacity} spots
                                </span>
                                <Button
                                  type="button"
                                  variant={entry.reserved ? "default" : "outline"}
                                  size="sm"
                                  disabled={pendingClass === entry.id}
                                  onClick={() => handleToggle(entry.id)}
                                  className="min-w-24 rounded-sm text-[0.66rem] uppercase tracking-[0.16em]"
                                >
                                  {pendingClass === entry.id ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : entry.reserved ? (
                                    "Reserved"
                                  ) : (
                                    "Reserve"
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {view === "membership" && (
              <div className="flex flex-col gap-8">
                <div>
                  <span className="studio-label">Membership</span>
                  <h1 className="studio-serif mt-3 text-3xl sm:text-4xl">
                    {PLAN.name} plan.
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                    {PLAN.renews}. Change plan or pause any month — no joining
                    fee, no notice period.
                  </p>
                </div>

                <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-2">
                  <div className="bg-background p-6 sm:p-8">
                    <p className="studio-label">Plan</p>
                    <p className="studio-serif mt-3 text-4xl">
                      ${PLAN.price}
                      <span className="ml-2 text-sm text-muted-foreground">
                        / month
                      </span>
                    </p>
                    <p className="mt-6 text-sm text-muted-foreground">
                      Billed to {user?.email ?? "your account"}.
                    </p>
                  </div>
                  <div className="bg-[var(--paper)] p-6 sm:p-8">
                    <p className="studio-label">Included</p>
                    <ul className="mt-5 flex flex-col gap-3">
                      {PLAN.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--clay)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild className="rounded-sm text-[0.68rem] uppercase tracking-[0.16em]">
                    <Link to="/#visit">
                      Talk to a coach
                      <ArrowUpRight className="ml-2 size-3.5" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-sm text-[0.68rem] uppercase tracking-[0.16em]"
                    onClick={() =>
                      toast("Pause requests are handled by the studio", {
                        description:
                          "Email studio@meridian.fit and we'll pause from the next cycle.",
                      })
                    }
                  >
                    Pause membership
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
