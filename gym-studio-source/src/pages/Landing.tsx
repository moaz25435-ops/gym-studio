import { ContactForm } from "@/components/landing/ContactForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { groupByDay } from "@/lib/studio";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  StretchHorizontal,
  UserRound,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

const NAV_LINKS = [
  { label: "The studio", href: "#studio" },
  { label: "Disciplines", href: "#disciplines" },
  { label: "Timetable", href: "#timetable" },
  { label: "Membership", href: "#membership" },
  { label: "Visit", href: "#visit" },
];

const MARQUEE = [
  "Strength",
  "Conditioning",
  "Reformer",
  "Mobility",
  "Yoga",
  "Recovery",
  "Personal coaching",
];

const DISCIPLINES: {
  title: string;
  copy: string;
  meta: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Strength",
    copy: "Progressive barbell work in groups of fourteen, coached rep by rep on a platform that was built for it.",
    meta: "45 min · 14 places",
    icon: Dumbbell,
  },
  {
    title: "Conditioning",
    copy: "Rowers, bikes and tempo intervals for the engine work that makes everything else feel lighter.",
    meta: "40 min · 12 places",
    icon: Flame,
  },
  {
    title: "Reformer & Pilates",
    copy: "Two reformer bays for controlled, precise work — a quiet counterweight to the heavier rooms.",
    meta: "50 min · 10 places",
    icon: HeartPulse,
  },
  {
    title: "Mobility",
    copy: "Slow, deliberate ranges of motion with hands-on cueing so joints stay honest as loads climb.",
    meta: "40 min · 16 places",
    icon: StretchHorizontal,
  },
  {
    title: "Yoga",
    copy: "Breath-led practice in the north light room. Warm, unhurried, and open to every level.",
    meta: "60 min · 18 places",
    icon: Wind,
  },
  {
    title: "Personal coaching",
    copy: "One-to-one programming with a resident coach, reviewed every six weeks against your baseline.",
    meta: "60 min · by appointment",
    icon: UserRound,
  },
];

const AMENITIES = [
  "Open floor: 06:00 – 22:00 daily",
  "Recovery room & sauna",
  "Two reformer bays",
  "Private change suites",
  "Towel and kit service",
  "Secure bike storage",
];

const MEMBERSHIPS = [
  {
    name: "Floor",
    price: "89",
    summary: "For training on your own terms.",
    includes: [
      "Open floor access",
      "Two classes each week",
      "Timetable and booking app",
      "Locker for the day",
    ],
  },
  {
    name: "Studio",
    price: "149",
    summary: "The full studio, unlimited.",
    includes: [
      "Unlimited classes",
      "Recovery room & sauna",
      "One guest pass each month",
      "Quarterly movement review",
    ],
    featured: true,
  },
  {
    name: "Atelier",
    price: "219",
    summary: "Coached, programmed, accountable.",
    includes: [
      "Everything in Studio",
      "Two personal sessions a month",
      "Priority class booking",
      "Two guest passes each month",
    ],
  },
];

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Wordmark() {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span className="flex size-8 items-center justify-center border border-[var(--line)] text-[0.7rem] font-medium tracking-[0.1em] transition-colors group-hover:border-[var(--clay)] group-hover:text-[var(--clay)]">
        M
      </span>
      <span className="text-[0.78rem] font-medium uppercase tracking-[0.34em]">
        Meridian
      </span>
    </Link>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const schedule = useQuery(api.studio.schedule);

  const days = schedule ? groupByDay(schedule) : [];

  const workspaceHref = isAuthenticated ? "/dashboard" : "/auth";
  const reserveHref = isAuthenticated
    ? "/dashboard"
    : "/auth?returnTo=%2Fdashboard";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6">
          <Wordmark />

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-sm text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
            >
              <Link to={workspaceHref}>
                {isAuthenticated ? "Member area" : "Member sign in"}
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-sm text-[0.7rem] uppercase tracking-[0.18em]">
              <a href="#visit">Book a tour</a>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="rounded-sm">
                <Menu className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 border-[var(--line)] shadow-none"
            >
              <SheetHeader>
                <SheetTitle className="studio-serif text-xl font-normal">
                  Meridian Studio
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col px-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="border-b border-[var(--line)] py-4 text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 p-4">
                <SheetClose asChild>
                  <Button asChild variant="outline" className="rounded-sm">
                    <Link to={workspaceHref}>
                      {isAuthenticated ? "Member area" : "Member sign in"}
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="rounded-sm">
                    <a href="#visit">Book a tour</a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-10 bg-[var(--clay)]" />
              <span className="studio-label">Est. 2016 — Belltown, Seattle</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="studio-serif mt-7 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.1rem]"
            >
              Strength, held to a
              <span className="block italic text-[var(--clay)]">
                calmer standard.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-xl text-[0.97rem] leading-7 text-muted-foreground"
            >
              Meridian is a 340 m² training floor in Belltown — small groups,
              resident coaches, and a room designed so you can hear yourself
              think while you work. No mirrors, no queue for the rack, no
              shouting.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button asChild size="lg" className="rounded-sm">
                <a href="#visit">
                  Book a studio tour
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-sm">
                <a href="#timetable">See this week's timetable</a>
              </Button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-14 grid grid-cols-1 gap-6 border-t border-[var(--line)] pt-8 sm:grid-cols-3"
            >
              {[
                { value: "340 m²", label: "Training floor" },
                { value: "9", label: "Resident coaches" },
                { value: "14", label: "Classes each week" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="studio-serif text-3xl">{stat.value}</dt>
                  <dd className="mt-2 studio-label">{stat.label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <Reveal delay={0.2}>
            <div className="relative border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5">
              <div className="studio-grain relative aspect-[4/5] w-full overflow-hidden border border-[var(--line)]">
                <div className="absolute -left-16 -top-20 size-72 rounded-full bg-[var(--clay-soft)] opacity-70 blur-3xl" />
                <div className="absolute -bottom-16 -right-10 size-64 rounded-full bg-[var(--accent)] opacity-80 blur-3xl" />
                <div className="absolute inset-y-0 left-1/3 w-px bg-[var(--line)]" />
                <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--line)]" />
                <div className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--line)]" />
                <div className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--line)]" />
                <span className="absolute right-4 top-4 text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
                  M—01
                </span>
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <p className="studio-serif max-w-[11rem] text-sm leading-5">
                    Plate 01 — The main floor, north light.
                  </p>
                  <span className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
                    Meridian
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
              <p className="text-xs text-muted-foreground">
                Studio photography, autumn programme.
              </p>
              <a
                href="#studio"
                className="text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                View the rooms
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="overflow-hidden border-b border-[var(--line)] bg-[var(--paper)] py-4">
        <div className="studio-marquee flex w-max items-center">
          {[...MARQUEE, ...MARQUEE].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground"
            >
              {item}
              <span className="mx-6 text-[var(--clay)]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Disciplines */}
      <section id="disciplines" className="scroll-mt-20 border-b border-[var(--line)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="studio-label">Disciplines</span>
              <h2 className="studio-serif mt-4 text-3xl sm:text-5xl">
                Six ways to train here.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Every session is capped and every session is coached. You will
              never be handed a programme and left to guess at it.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {DISCIPLINES.map((discipline, index) => {
              const Icon = discipline.icon;
              return (
                <Reveal
                  key={discipline.title}
                  delay={index * 0.05}
                  className="group bg-background"
                >
                  <div className="flex h-full flex-col justify-between gap-10 p-7 transition-colors duration-500 group-hover:bg-[var(--paper)] sm:p-8">
                    <div className="flex items-start justify-between">
                      <span className="text-[0.68rem] tracking-[0.24em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon className="size-4 text-[var(--clay)]" />
                    </div>
                    <div>
                      <h3 className="studio-serif text-2xl">{discipline.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {discipline.copy}
                      </p>
                      <p className="mt-6 text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">
                        {discipline.meta}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* The studio */}
      <section id="studio" className="scroll-mt-20 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
          <Reveal>
            <span className="studio-label">The studio</span>
            <h2 className="studio-serif mt-4 text-3xl sm:text-5xl">
              A quiet room for
              <span className="block italic text-[var(--clay)]">hard work.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              Exposed brick, lime-washed walls, and north-facing glazing do most
              of the decorating. The floor is laid out so that strength,
              conditioning and reformer work never compete for the same air.
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Members come for the programming and stay for the pace of it. Two
              coaches on the floor at all times means attention, not a
              stopwatch.
            </p>

            <ul className="mt-10 border-t border-[var(--line)]">
              {AMENITIES.map((amenity) => (
                <li
                  key={amenity}
                  className="flex items-center justify-between gap-4 border-b border-[var(--line)] py-3.5 text-sm"
                >
                  <span>{amenity}</span>
                  <span className="text-[var(--clay)]">—</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="grid grid-cols-2 items-start gap-4 sm:gap-5">
            {[
              {
                tone: "from-[var(--clay-soft)] to-transparent",
                caption: "Plate 02 — Reformer bays, west end.",
              },
              {
                tone: "from-[var(--accent)] to-transparent",
                caption: "Plate 03 — Recovery and quiet rooms.",
              },
              {
                tone: "from-[var(--muted)] to-transparent",
                caption: "Plate 04 — Platform and rack line.",
              },
              {
                tone: "from-[var(--clay-soft)] to-transparent",
                caption: "Plate 05 — The north light room.",
              },
            ].map((frame, index) => (
              <Reveal
                key={frame.caption}
                delay={index * 0.08}
                className={`aspect-[3/4] ${index % 2 === 1 ? "sm:mt-12" : ""}`}
              >
                <div className="flex h-full flex-col">
                  <div className="studio-grain relative flex-1 overflow-hidden border border-[var(--line)] bg-background">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${frame.tone}`}
                    />
                    <div className="absolute inset-5 border border-[var(--line)]" />
                    <span className="absolute bottom-4 left-4 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {frame.caption}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timetable */}
      <section id="timetable" className="scroll-mt-20 border-b border-[var(--line)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="studio-label">This week</span>
              <h2 className="studio-serif mt-4 text-3xl sm:text-5xl">
                The timetable.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              {isAuthenticated
                ? "Reserve your place from the member area — spots update live."
                : "Sign in to reserve a place. Spots update live."}
            </p>
          </Reveal>

          {schedule === undefined ? (
            <div className="mt-12 flex items-center gap-3 border border-[var(--line)] p-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Reading the timetable…
            </div>
          ) : (
            <div className="mt-12 flex flex-col">
              {days.map(({ day, entries }, dayIndex) => (
                <Reveal
                  key={day}
                  delay={dayIndex * 0.04}
                  className="grid gap-4 border-t border-[var(--line)] py-6 sm:grid-cols-[7rem_1fr]"
                >
                  <div className="flex items-baseline justify-between sm:block">
                    <p className="studio-serif text-lg">{day}</p>
                    <p className="text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground sm:mt-1">
                      {entries.length} sessions
                    </p>
                  </div>
                  <div className="flex flex-col">
                    {entries.map((entry) => (
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
                            <p className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                              {entry.focus} · {entry.duration} min · {entry.coach}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                            {entry.remaining} / {entry.capacity} spots
                          </span>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-sm text-[0.66rem] uppercase tracking-[0.16em]"
                          >
                            <Link to={reserveHref}>Reserve</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Membership */}
      <section id="membership" className="scroll-mt-20 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
          <Reveal className="max-w-2xl">
            <span className="studio-label">Membership</span>
            <h2 className="studio-serif mt-4 text-3xl sm:text-5xl">
              Three ways in.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              No joining fee. Pause any month. Every membership includes the
              induction, the baseline assessment and the app.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-3">
            {MEMBERSHIPS.map((tier, index) => (
              <Reveal
                key={tier.name}
                delay={index * 0.06}
                className={tier.featured ? "bg-background" : "bg-[var(--paper)]"}
              >
                <div
                  className={`flex h-full flex-col justify-between gap-10 p-7 sm:p-8 ${
                    tier.featured
                      ? "border-t-2 border-t-[var(--clay)] lg:border-l-2 lg:border-l-[var(--clay)] lg:border-t-0"
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="studio-serif text-2xl">{tier.name}</h3>
                      {tier.featured && (
                        <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[var(--clay)]">
                          Most chosen
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {tier.summary}
                    </p>
                    <p className="studio-serif mt-7 text-4xl">
                      ${tier.price}
                      <span className="ml-2 text-sm not-italic text-muted-foreground">
                        / month
                      </span>
                    </p>
                    <ul className="mt-8 flex flex-col gap-3">
                      {tier.includes.map((item) => (
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
                  <Button
                    asChild
                    variant={tier.featured ? "default" : "outline"}
                    className="w-full rounded-sm text-[0.7rem] uppercase tracking-[0.18em]"
                  >
                    <a href="#visit">Enquire about {tier.name}</a>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 text-center lg:py-24">
          <Reveal>
            <div className="mx-auto h-px w-16 bg-[var(--clay)]" />
            <blockquote className="studio-serif mt-8 text-2xl leading-[1.35] sm:text-[2rem]">
              “I came in for six weeks to fix a deadlift and stayed three years.
              Nobody here shouts at you — they just quietly make sure you get
              better.”
            </blockquote>
            <p className="mt-8 text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
              Priya Raghavan — member since 2023
            </p>
          </Reveal>
        </div>
      </section>

      {/* Visit / contact */}
      <section id="visit" className="scroll-mt-20 border-b border-[var(--line)]">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <Reveal>
            <span className="studio-label">Visit</span>
            <h2 className="studio-serif mt-4 text-3xl sm:text-5xl">
              Come see the room.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              Tours run every weekday between 10:00 and 19:00 and take about
              twenty minutes. Bring training kit if you would like to stay for a
              trial session — the first one is on us.
            </p>

            <dl className="mt-10 border-t border-[var(--line)]">
              {[
                {
                  icon: MapPin,
                  term: "Address",
                  detail: "14 Ellis Court, Belltown, Seattle WA 98121",
                },
                {
                  icon: Clock,
                  term: "Opening hours",
                  detail: "Mon–Fri 06:00–22:00 · Sat 08:00–18:00 · Sun 09:00–16:00",
                },
                {
                  icon: Mail,
                  term: "Email",
                  detail: "studio@meridian.fit",
                },
                {
                  icon: Phone,
                  term: "Phone",
                  detail: "+1 (206) 555 0142",
                },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.term}
                    className="flex items-start gap-4 border-b border-[var(--line)] py-5"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-[var(--clay)]" />
                    <div>
                      <dt className="text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">
                        {row.term}
                      </dt>
                      <dd className="mt-1.5 text-sm">{row.detail}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Wordmark />
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              A strength and movement studio in Belltown, Seattle. Small groups,
              resident coaches, and a room worth showing up to.
            </p>
          </div>
          <div>
            <p className="studio-label">Explore</p>
            <div className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="studio-label">Members</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                to={workspaceHref}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {isAuthenticated ? "Member area" : "Sign in"}
              </Link>
              <a
                href="#timetable"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Timetable
              </a>
              <a
                href="#visit"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Book a tour
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Meridian Studio. All rights reserved.</p>
          <p className="uppercase tracking-[0.2em]">
            Belltown, Seattle · Est. 2016
          </p>
        </div>
      </footer>
    </div>
  );
}
