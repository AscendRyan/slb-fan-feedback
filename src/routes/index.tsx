import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Trophy, Mic, Handshake } from "lucide-react";
import slbLogo from "@/assets/slb-logo.png";
import slbHero from "@/assets/slb-hero.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Super League Basketball — Post-Event Survey" },
      {
        name: "description",
        content: "Share your feedback on the Super League Basketball final events. Takes about 60 seconds.",
      },
    ],
  }),
});

const GRADIENT = "bg-[linear-gradient(135deg,oklch(0.72_0.2_50)_0%,oklch(0.62_0.25_0)_100%)]";
const GRADIENT_TEXT =
  "bg-[linear-gradient(135deg,oklch(0.78_0.2_50)_0%,oklch(0.68_0.25_0)_100%)] bg-clip-text text-transparent";

const LINKS = [
  { to: "/fan", title: "Fan / Spectator", blurb: "You attended or watched the final.", Icon: Users },
  { to: "/player", title: "Player / Team Staff", blurb: "You played or worked with a team.", Icon: Trophy },
  { to: "/media", title: "Media", blurb: "You covered the event.", Icon: Mic },
  { to: "/partner", title: "Partner / Sponsor", blurb: "You activated at the event.", Icon: Handshake },
] as const;

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <img src={slbLogo} alt="Super League Basketball" className="h-10 w-auto" />
          <span className="hidden text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground sm:block">
            Post-Event Survey
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <img src={slbHero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.08_0.01_30/0.7)_0%,oklch(0.08_0.01_30/0.95)_100%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <div className={`inline-block rounded-full ${GRADIENT} px-3 py-1 text-xs font-black uppercase tracking-widest text-background`}>
            Your voice. Our next move.
          </div>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">
            How was the <span className={GRADIENT_TEXT}>final</span>?
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Choose the survey that fits you. Each one is a single page and takes about 60 seconds.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-xs font-black uppercase tracking-[0.25em] text-primary">
          Pick your survey
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {LINKS.map(({ to, title, blurb, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition hover:border-primary hover:-translate-y-0.5"
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${GRADIENT} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-md ${GRADIENT} text-background`}>
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-lg font-black uppercase tracking-tight">{title}</div>
                  <div className="text-sm text-muted-foreground">{blurb}</div>
                </div>
              </div>
              <div className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {to}
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Each survey lives at its own URL so you can share it directly with the right audience.
          Responses POST to <code className="rounded bg-secondary px-1">VITE_SURVEY_ENDPOINT</code> when set.
        </p>
      </main>
    </div>
  );
}
