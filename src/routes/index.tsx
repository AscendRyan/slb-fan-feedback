import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Check, Users, Trophy, Mic, Handshake } from "lucide-react";
import slbLogo from "@/assets/slb-logo.png";
import slbHero from "@/assets/slb-hero.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Super League Basketball — Post-Event Survey" },
      {
        name: "description",
        content:
          "Share your feedback on the Super League Basketball final events. Takes about 60 seconds.",
      },
    ],
  }),
});

type AudienceId = "fan" | "player" | "media" | "partner";

const AUDIENCES: {
  id: AudienceId;
  title: string;
  blurb: string;
  Icon: typeof Users;
}[] = [
  { id: "fan", title: "Fan / Spectator", blurb: "You attended or watched the final.", Icon: Users },
  { id: "player", title: "Player / Team Staff", blurb: "You played or worked with a team.", Icon: Trophy },
  { id: "media", title: "Media", blurb: "You covered the event.", Icon: Mic },
  { id: "partner", title: "Partner / Sponsor", blurb: "You activated at the event.", Icon: Handshake },
];

const SCALE = ["1", "2", "3", "4", "5"];
const ENDPOINT = (import.meta.env.VITE_SURVEY_ENDPOINT as string | undefined) ?? "";

const GRADIENT = "bg-[linear-gradient(135deg,oklch(0.72_0.2_50)_0%,oklch(0.62_0.25_0)_100%)]";
const GRADIENT_TEXT =
  "bg-[linear-gradient(135deg,oklch(0.78_0.2_50)_0%,oklch(0.68_0.25_0)_100%)] bg-clip-text text-transparent";

function Index() {
  const [audience, setAudience] = useState<AudienceId | null>(null);
  const [done, setDone] = useState(false);

  if (done) return <ThankYou onReset={() => { setDone(false); setAudience(null); }} />;
  if (!audience) return <Landing onPick={setAudience} />;
  return (
    <SurveyShell audience={audience} onBack={() => setAudience(null)}>
      <SurveyForm audience={audience} onSubmitted={() => setDone(true)} />
    </SurveyShell>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <img src={slbLogo} alt="Super League Basketball" className="h-10 w-auto" />
        <span className="hidden text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground sm:block">
          Post-Event Survey
        </span>
      </div>
    </header>
  );
}

function Landing({ onPick }: { onPick: (a: AudienceId) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={slbHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.08_0.01_30/0.7)_0%,oklch(0.08_0.01_30/0.95)_100%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <div className={`inline-block rounded-full ${GRADIENT} px-3 py-1 text-xs font-black uppercase tracking-widest text-background`}>
            Your voice. Our next move.
          </div>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">
            How was the <span className={GRADIENT_TEXT}>final</span>?
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Tell Super League Basketball what hit and what we should level up. Takes about 60 seconds — no account needed.
          </p>
        </div>
      </section>

      {/* Audience picker */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.25em] text-primary">
            Step 1 — Who are you?
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {AUDIENCES.map(({ id, title, blurb, Icon }) => (
            <button
              key={id}
              onClick={() => onPick(id)}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 text-left transition hover:border-primary hover:-translate-y-0.5 focus:outline-none focus:border-primary"
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
            </button>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Your answers are used only to improve Super League Basketball events. We don't sell your data.
        </p>
      </main>
    </div>
  );
}

function SurveyShell({
  audience,
  onBack,
  children,
}: {
  audience: AudienceId;
  onBack: () => void;
  children: React.ReactNode;
}) {
  const title = AUDIENCES.find((a) => a.id === audience)!.title;
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <Card className="overflow-hidden border-border bg-card p-0">
          <div className={`${GRADIENT} px-6 py-5 sm:px-8`}>
            <div className="text-xs font-black uppercase tracking-[0.25em] text-background/80">
              {title}
            </div>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-background">
              A few quick questions
            </h2>
          </div>
          <div className="p-6 sm:p-8">{children}</div>
        </Card>
      </main>
    </div>
  );
}

function Scale({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-bold">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-2">
        {SCALE.map((n) => (
          <label
            key={n}
            className={`flex-1 cursor-pointer rounded-md border px-3 py-2.5 text-center text-base font-black transition ${
              value === n
                ? `${GRADIENT} border-transparent text-background`
                : "border-border bg-secondary text-foreground hover:border-primary"
            }`}
          >
            <RadioGroupItem value={n} id={`${name}-${n}`} className="sr-only" />
            {n}
          </label>
        ))}
      </RadioGroup>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}

function SurveyForm({
  audience,
  onSubmitted,
}: {
  audience: AudienceId;
  onSubmitted: () => void;
}) {
  const [overall, setOverall] = useState("");
  const [recommend, setRecommend] = useState("");
  const [highlight, setHighlight] = useState("");
  const [improve, setImprove] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audienceQuestion: Record<AudienceId, string> = {
    fan: "How would you rate the matchday atmosphere?",
    player: "How well organised was the event for teams?",
    media: "How well were media facilities and access handled?",
    partner: "How well was your activation supported on-site?",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!overall || !recommend) {
      setError("Please answer the rating questions.");
      return;
    }
    if (!consent) {
      setError("Please accept the privacy notice to submit.");
      return;
    }
    setSubmitting(true);
    const payload = {
      audience,
      submittedAt: new Date().toISOString(),
      answers: {
        overall: Number(overall),
        audienceSpecific: Number(recommend),
        highlight,
        improve,
        email: email || null,
      },
      meta: {
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      },
    };
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      } else {
        console.info("[SLB Survey] payload:", payload);
        await new Promise((r) => setTimeout(r, 400));
      }
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Scale name="overall" label="Overall, how was your experience?" value={overall} onChange={setOverall} />
      <Scale name="audq" label={audienceQuestion[audience]} value={recommend} onChange={setRecommend} />

      <div>
        <Label htmlFor="highlight" className="text-sm font-bold">What was the highlight? (optional)</Label>
        <Textarea
          id="highlight"
          value={highlight}
          onChange={(e) => setHighlight(e.target.value)}
          rows={2}
          maxLength={500}
          className="mt-2"
          placeholder="One thing that stood out…"
        />
      </div>

      <div>
        <Label htmlFor="improve" className="text-sm font-bold">What should we improve? (optional)</Label>
        <Textarea
          id="improve"
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
          rows={2}
          maxLength={500}
          className="mt-2"
          placeholder="One thing to make next time better…"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-bold">Email (optional)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2"
          placeholder="you@example.com"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Only if you'd like us to follow up. We won't add you to marketing lists.
        </p>
      </div>

      <label className="flex items-start gap-3 rounded-md border border-border bg-secondary/50 p-3">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
        <span className="text-sm text-muted-foreground">
          I agree my responses can be used by Super League Basketball to improve future events.
        </span>
      </label>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className={`w-full ${GRADIENT} text-base font-black uppercase tracking-wider text-background hover:opacity-90`}
      >
        {submitting ? "Submitting…" : "Submit feedback"}
      </Button>
    </form>
  );
}

function ThankYou({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${GRADIENT} text-background`}>
          <Check className="h-10 w-10" strokeWidth={3} />
        </div>
        <h1 className="mt-6 text-4xl font-black uppercase tracking-tight">
          <span className={GRADIENT_TEXT}>Thanks</span> for your feedback!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your input helps make Super League Basketball events even better.
        </p>
        <Button onClick={onReset} variant="outline" className="mt-8 font-bold uppercase tracking-wider">
          Submit another response
        </Button>
      </main>
    </div>
  );
}
