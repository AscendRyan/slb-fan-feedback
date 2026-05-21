import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import slbLogo from "@/assets/slb-logo.png";
import slbPattern from "@/assets/slb-pattern.jpg";
import slbCartoonBg from "@/assets/slb-cartoon-bg.jpg";
import slbHero from "@/assets/slb-hero.png";

export type AudienceId = "fan" | "player" | "media" | "partner" | "discount";

const SCALE = ["1", "2", "3", "4", "5"];
const ENDPOINT =
  (import.meta.env.VITE_SURVEY_ENDPOINT as string | undefined) ??
  "https://4flajfhr.rpcld.cc/webhook/form";

const GRADIENT =
  "bg-[linear-gradient(135deg,oklch(0.72_0.2_50)_0%,oklch(0.62_0.25_0)_100%)]";
const GRADIENT_TEXT =
  "bg-[linear-gradient(135deg,oklch(0.78_0.2_50)_0%,oklch(0.68_0.25_0)_100%)] bg-clip-text text-transparent";

export interface RatingQuestion {
  id: string;
  label: string;
}

export interface ChoiceQuestion {
  id: string;
  label: string;
  options: string[];
  multi?: boolean;
}

export interface SurveyConfig {
  audience: AudienceId;
  title: string;
  intro: string;
  ratings: RatingQuestion[];
  choices?: ChoiceQuestion[];
  highlightPrompt?: string;
  improvePrompt?: string;
}

function Header() {
  return (
    <header className="relative z-10 h-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4">
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
  );
}

function QuestionBlock({
  index,
  total,
  children,
}: {
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-5 sm:p-6">
      <div className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        Question {index} <span className="opacity-60">/ {total}</span>
      </div>
      {children}
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
      <Label className="mb-3 block text-base font-bold leading-snug text-foreground">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-5 gap-2">
        {SCALE.map((n) => (
          <label
            key={n}
            className={`flex h-14 cursor-pointer items-center justify-center rounded-lg border-2 text-lg font-black transition ${
              value === n
                ? `${GRADIENT} border-transparent text-background shadow-lg`
                : "border-border bg-card text-foreground hover:border-primary hover:bg-secondary"
            }`}
          >
            <RadioGroupItem value={n} id={`${name}-${n}`} className="sr-only" />
            {n}
          </label>
        ))}
      </RadioGroup>
      <div className="mt-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}

function ChoiceField({
  q,
  value,
  onChange,
}: {
  q: ChoiceQuestion;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (q.multi) {
      onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
    } else {
      onChange([opt]);
    }
  };
  return (
    <div>
      <Label className="mb-3 block text-base font-bold leading-snug text-foreground">
        {q.label}
        {q.multi && (
          <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            (select all)
          </span>
        )}
      </Label>
      <div className="flex flex-wrap gap-2">
        {q.options.map((opt) => {
          const active = value.includes(opt);
          return (
            <button
              type="button"
              key={opt}
              onClick={() => toggle(opt)}
              className={`rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? `${GRADIENT} border-transparent text-background shadow-md`
                  : "border-border bg-card text-foreground hover:border-primary hover:bg-secondary"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SurveyPage({ config }: { config: SurveyConfig }) {
  const [overall, setOverall] = useState("");
  const [recommend, setRecommend] = useState("");
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<Record<string, string[]>>({});
  const [highlight, setHighlight] = useState("");
  const [improve, setImprove] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const totalQuestions =
    2 + config.ratings.length + (config.choices?.length ?? 0) + 3; // + highlight, improve, email

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Please enter your email address to submit.");
      return;
    }
    setSubmitting(true);
    const payload = {
      audience: config.audience,
      submittedAt: new Date().toISOString(),
      answers: {
        overall: overall ? Number(overall) : null,
        recommend: recommend ? Number(recommend) : null,
        ratings: Object.fromEntries(Object.entries(ratings).map(([k, v]) => [k, Number(v)])),
        choices,
        highlight,
        improve,
        email: email || null,
      },
      meta: {
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        page: typeof location !== "undefined" ? location.pathname : null,
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
        await new Promise((r) => setTimeout(r, 300));
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setOverall("");
    setRecommend("");
    setRatings({});
    setChoices({});
    setHighlight("");
    setImprove("");
    setEmail("");
    setConsent(false);
    setDone(false);
  }

  if (done) {
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
          <p className="mt-3 text-base text-foreground/80">
            Your input helps make Super League Basketball Play-Off Finals even better.
          </p>
          <Button onClick={reset} variant="outline" className="mt-8 font-bold uppercase tracking-wider">
            Submit another response
          </Button>
        </main>
      </div>
    );
  }

  let qi = 0;
  const next = () => ++qi;

  return (
    <div className="relative min-h-screen">
      {/* Cartoon basketball hype background — fills entire page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-repeat"
        style={{ backgroundImage: `url(${slbCartoonBg})`, backgroundSize: "560px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,oklch(0.62_0.25_0/0.3)_0%,transparent_60%),radial-gradient(ellipse_at_bottom,oklch(0.72_0.2_50/0.25)_0%,transparent_60%),linear-gradient(180deg,oklch(0.08_0.01_30/0.35)_0%,oklch(0.08_0.01_30/0.55)_100%)]"
      />



      <Header />
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:py-10">
        {/* Glow border wrapper */}
        <div className={`rounded-2xl p-[2px] ${GRADIENT} shadow-[0_20px_80px_-20px_rgba(255,80,40,0.5)]`}>
        <Card className="relative overflow-hidden rounded-2xl border-0 bg-card p-0">
          {/* Hero image banner */}
          <div className="relative h-44 w-full overflow-hidden sm:h-56">
            <img src={slbHero} alt="Super League Basketball action" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,oklch(0.08_0.01_30/0.4)_60%,oklch(0.08_0.01_30/0.95)_100%)]" />
          </div>
          <div className={`relative ${GRADIENT} px-6 py-7 sm:px-8 sm:py-8`}>
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: `url(${slbPattern})`, backgroundSize: "cover" }} />
            <div className="relative z-10 text-xs font-black uppercase tracking-[0.25em] text-background/85">
              {config.title}
            </div>
            <h1 className="relative z-10 mt-2 text-3xl font-black uppercase leading-tight tracking-tight text-background sm:text-4xl">
              Play-Off Finals Feedback
            </h1>
            <p className="relative z-10 mt-3 text-base font-medium text-background/95">{config.intro}</p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4 bg-card p-4 sm:space-y-5 sm:p-6">
            <QuestionBlock index={next()} total={totalQuestions}>
              <Scale name="overall" label="Overall, how would you rate the Finals experience?" value={overall} onChange={setOverall} />
            </QuestionBlock>

            <QuestionBlock index={next()} total={totalQuestions}>
              <Scale name="recommend" label="How likely are you to recommend an SLB Finals to a friend?" value={recommend} onChange={setRecommend} />
            </QuestionBlock>

            {config.ratings.map((r) => (
              <QuestionBlock key={r.id} index={next()} total={totalQuestions}>
                <Scale
                  name={r.id}
                  label={r.label}
                  value={ratings[r.id] ?? ""}
                  onChange={(v) => setRatings((p) => ({ ...p, [r.id]: v }))}
                />
              </QuestionBlock>
            ))}

            {config.choices?.map((q) => (
              <QuestionBlock key={q.id} index={next()} total={totalQuestions}>
                <ChoiceField
                  q={q}
                  value={choices[q.id] ?? []}
                  onChange={(v) => setChoices((p) => ({ ...p, [q.id]: v }))}
                />
              </QuestionBlock>
            ))}

            <QuestionBlock index={next()} total={totalQuestions}>
              <Label htmlFor="highlight" className="mb-3 block text-base font-bold text-foreground">
                {config.highlightPrompt ?? "What was the highlight of the Finals for you?"}
                <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Optional</span>
              </Label>
              <Textarea
                id="highlight"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                rows={3}
                maxLength={500}
                className="bg-card text-base"
                placeholder="One thing that stood out…"
              />
            </QuestionBlock>

            <QuestionBlock index={next()} total={totalQuestions}>
              <Label htmlFor="improve" className="mb-3 block text-base font-bold text-foreground">
                {config.improvePrompt ?? "What should we improve next year?"}
                <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Optional</span>
              </Label>
              <Textarea
                id="improve"
                value={improve}
                onChange={(e) => setImprove(e.target.value)}
                rows={3}
                maxLength={500}
                className="bg-card text-base"
                placeholder="One thing to make next time better…"
              />
            </QuestionBlock>

            <QuestionBlock index={next()} total={totalQuestions}>
              <Label htmlFor="email" className="mb-3 block text-base font-bold text-foreground">
                Email
                <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-primary">Required</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-card text-base"
                placeholder="you@example.com"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                So we can follow up if needed. We won't add you to marketing lists.
              </p>
            </QuestionBlock>

            <label className="flex items-start gap-3 rounded-xl border-2 border-border bg-secondary/40 p-4">
              <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5 h-5 w-5" />
              <span className="text-sm leading-relaxed text-foreground/90">
                I agree my responses can be used by Super League Basketball to improve future events.
              </span>
            </label>

            {error && (
              <div className="rounded-lg border-2 border-destructive/40 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className={`h-14 w-full ${GRADIENT} text-base font-black uppercase tracking-wider text-background shadow-lg hover:opacity-95`}
            >
              {submitting ? "Submitting…" : "Submit feedback"}
            </Button>
          </form>
        </Card>
        </div>
      </main>
    </div>
  );
}
