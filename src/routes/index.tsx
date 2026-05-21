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
    <header className="border-b-4 border-primary bg-secondary text-secondary-foreground">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-black">
          SLB
        </div>
        <div className="leading-tight">
          <div className="text-sm uppercase tracking-widest text-primary">Super League</div>
          <div className="text-lg font-extrabold">Basketball Feedback</div>
        </div>
      </div>
    </header>
  );
}

function Landing({ onPick }: { onPick: (a: AudienceId) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Help us make next season even better.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pick the option that fits you. The survey takes about 60 seconds.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {AUDIENCES.map(({ id, title, blurb, Icon }) => (
            <button
              key={id}
              onClick={() => onPick(id)}
              className="group text-left rounded-xl border-2 border-border bg-card p-5 transition hover:border-primary hover:shadow-lg focus:outline-none focus:border-primary"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold">{title}</div>
                  <div className="text-sm text-muted-foreground">{blurb}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Your answers are used only to improve Super League Basketball events. No account needed.
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
      <main className="mx-auto max-w-2xl px-4 py-8">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <Card className="p-6 sm:p-8">
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              {title}
            </div>
            <h2 className="mt-1 text-2xl font-extrabold">A few quick questions</h2>
          </div>
          {children}
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
      <Label className="mb-2 block">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-2">
        {SCALE.map((n) => (
          <label
            key={n}
            className={`flex-1 cursor-pointer rounded-md border-2 px-3 py-2 text-center text-sm font-bold transition ${
              value === n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50"
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
        // No endpoint configured yet — log so the integrator can verify shape.
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
        <Label htmlFor="highlight">What was the highlight? (optional)</Label>
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
        <Label htmlFor="improve">What should we improve? (optional)</Label>
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
        <Label htmlFor="email">Email (optional)</Label>
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

      <label className="flex items-start gap-3 rounded-md border border-border bg-muted/40 p-3">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
        <span className="text-sm text-muted-foreground">
          I agree my responses can be used by Super League Basketball to improve future events. See our privacy notice.
        </span>
      </label>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full font-bold" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit feedback"}
      </Button>
    </form>
  );
}

function ThankYou({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold">Thanks for your feedback!</h1>
        <p className="mt-2 text-muted-foreground">
          Your input helps make Super League Basketball events even better.
        </p>
        <Button onClick={onReset} variant="outline" className="mt-8">
          Submit another response
        </Button>
      </main>
    </div>
  );
}
