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

export type AudienceId = "fan" | "player" | "media" | "partner";

const SCALE = ["1", "2", "3", "4", "5"];
const ENDPOINT = (import.meta.env.VITE_SURVEY_ENDPOINT as string | undefined) ?? "";

const GRADIENT =
  "bg-[linear-gradient(135deg,oklch(0.72_0.2_50)_0%,oklch(0.62_0.25_0)_100%)]";
const GRADIENT_TEXT =
  "bg-[linear-gradient(135deg,oklch(0.78_0.2_50)_0%,oklch(0.68_0.25_0)_100%)] bg-clip-text text-transparent";

export interface SurveyConfig {
  audience: AudienceId;
  title: string;
  intro: string;
  audienceQuestion: string;
}

function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <img src={slbLogo} alt="Super League Basketball" className="h-10 w-auto" />
        <span className="hidden text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground sm:block">
          Post-Event Survey
        </span>
      </div>
    </header>
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

export function SurveyPage({ config }: { config: SurveyConfig }) {
  const [overall, setOverall] = useState("");
  const [audq, setAudq] = useState("");
  const [highlight, setHighlight] = useState("");
  const [improve, setImprove] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!overall || !audq) {
      setError("Please answer the rating questions.");
      return;
    }
    if (!consent) {
      setError("Please accept the privacy notice to submit.");
      return;
    }
    setSubmitting(true);
    const payload = {
      audience: config.audience,
      submittedAt: new Date().toISOString(),
      answers: {
        overall: Number(overall),
        audienceSpecific: Number(audq),
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
    setAudq("");
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
          <p className="mt-3 text-muted-foreground">
            Your input helps make Super League Basketball events even better.
          </p>
          <Button onClick={reset} variant="outline" className="mt-8 font-bold uppercase tracking-wider">
            Submit another response
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <Card className="overflow-hidden border-border bg-card p-0">
          <div className={`${GRADIENT} px-6 py-6 sm:px-8`}>
            <div className="text-xs font-black uppercase tracking-[0.25em] text-background/80">
              {config.title}
            </div>
            <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-background sm:text-4xl">
              How was the final?
            </h1>
            <p className="mt-2 text-sm text-background/90">{config.intro}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            <Scale name="overall" label="Overall, how was your experience?" value={overall} onChange={setOverall} />
            <Scale name="audq" label={config.audienceQuestion} value={audq} onChange={setAudq} />

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
        </Card>
      </main>
    </div>
  );
}
