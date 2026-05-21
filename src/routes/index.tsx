import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Users, Trophy, Mic, Handshake, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import slbLogo from "@/assets/slb-logo.png";
import slbHero from "@/assets/slb-hero.png";
import slbPattern from "@/assets/slb-pattern.jpg";
import slbCourtBg from "@/assets/slb-bg-court.jpg";

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

const AUTH_KEY = "slb-admin-auth";
const AUTH_USER = "slb";
const AUTH_PASS = "onlyus";

function isAuthed() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${slbCourtBg})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-20 mix-blend-overlay"
        style={{ backgroundImage: `url(${slbPattern})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.62_0.25_0/0.35)_0%,transparent_60%),radial-gradient(ellipse_at_bottom,oklch(0.72_0.2_50/0.3)_0%,transparent_60%),linear-gradient(180deg,oklch(0.08_0.01_30/0.55)_0%,oklch(0.08_0.01_30/0.85)_100%)]"
      />
    </>
  );
}


function Login({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (username.trim().toLowerCase() === AUTH_USER && password === AUTH_PASS) {
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        /* ignore */
      }
      onSuccess();
    } else {
      setError("Wrong username or password.");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <Backdrop />
      <div className={`w-full max-w-md rounded-2xl p-[2px] ${GRADIENT} shadow-[0_20px_80px_-20px_rgba(255,80,40,0.5)]`}>
        <div className="relative overflow-hidden rounded-2xl bg-card p-8">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `url(${slbPattern})`, backgroundSize: "cover" }} />
          <div className="relative z-10">
            <img src={slbLogo} alt="Super League Basketball" className="mx-auto h-28 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" />
            <div className={`mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full ${GRADIENT} text-background`}>
              <Lock className="h-5 w-5" strokeWidth={3} />
            </div>
            <h1 className="mt-4 text-center text-2xl font-black uppercase tracking-tight">
              <span className={GRADIENT_TEXT}>Restricted</span> access
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Enter the SLB admin credentials to continue.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="u" className="text-sm font-bold">Username</Label>
                <Input id="u" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 h-11" />
              </div>
              <div>
                <Label htmlFor="p" className="text-sm font-bold">Password</Label>
                <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-11" />
              </div>
              {error && (
                <div className="rounded-lg border-2 border-destructive/40 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                  {error}
                </div>
              )}
              <Button type="submit" size="lg" className={`h-12 w-full ${GRADIENT} text-base font-black uppercase tracking-wider text-background hover:opacity-95`}>
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-background">
      <Backdrop />
      <header className="relative h-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
          <img
            src={slbLogo}
            alt="Super League Basketball"
            className="relative z-10 h-32 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] sm:h-40"
          />
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
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] transition-opacity group-hover:opacity-[0.12]" style={{ backgroundImage: `url(${slbPattern})`, backgroundSize: "cover" }} />
              <div className={`absolute inset-x-0 top-0 h-1 ${GRADIENT} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-md ${GRADIENT} text-background`}>
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-lg font-black uppercase tracking-tight">{title}</div>
                  <div className="text-sm text-muted-foreground">{blurb}</div>
                </div>
              </div>
              <div className="relative mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
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
