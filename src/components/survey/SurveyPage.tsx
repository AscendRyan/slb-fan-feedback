import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, ArrowRight } from "lucide-react";
import slbLogo from "@/assets/slb-logo.png";
import slbArenaBg from "@/assets/slb-arena-bg.jpg";
import slbHero from "@/assets/slb-hero.png";

export type AudienceId = "fan" | "player" | "media" | "partner" | "discount";

const SCALE = ["1", "2", "3", "4", "5"];
const ENDPOINT =
  (import.meta.env.VITE_SURVEY_ENDPOINT as string | undefined) ??
  "https://4flajfhr.rpcld.cc/webhook/form";

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
  recommendPrompt?: string;
}

/* -------------------------------------------------------------------------- */
/*  Atomic UI                                                                 */
/* -------------------------------------------------------------------------- */

function RatingPad({
  name,
  value,
  onChange,
  size = "md",
  lowLabel = "Poor",
  highLabel = "Elite",
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  size?: "md" | "lg";
  lowLabel?: string;
  highLabel?: string;
}) {
  const h = size === "lg" ? "h-14 w-14 text-lg" : "h-12 text-sm";
  return (
    <div className="w-full">
      <div className={`flex gap-2 ${size === "lg" ? "" : "grid grid-cols-5"}`}>
        {SCALE.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${name} rating ${n}`}
              className={`${h} ${
                size === "lg" ? "" : "w-full"
              } flex items-center justify-center border font-bold tracking-tight transition-all cursor-pointer ${
                active
                  ? "border-[#f0d78c] bg-[#f0d78c] text-black shadow-[0_0_20px_rgba(240,215,140,0.35)]"
                  : "border-white/10 bg-white/[0.04] text-white hover:border-[#e85d3a] hover:text-[#e85d3a]"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] border transition-all cursor-pointer ${
        active
          ? "border-[#f0d78c] bg-[#f0d78c]/10 text-[#f0d78c]"
          : "border-white/10 bg-white/[0.04] text-white/80 hover:border-[#e85d3a] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Tile({
  className = "",
  index,
  title,
  hint,
  children,
}: {
  className?: string;
  index?: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white/[0.04] border border-white/10 p-6 flex flex-col ${className}`}>
      <div className="mb-5">
        <h3 className="font-display text-2xl leading-none tracking-wide uppercase text-white">
          {index && <span className="text-[#f0d78c]">{index}. </span>}
          {title}
        </h3>
        {hint && <p className="mt-2 text-xs text-white/75">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

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

  // Progress: count any answered field over total
  const { answered, total } = useMemo(() => {
    const totalCount =
      2 +
      config.ratings.length +
      (config.choices?.length ?? 0) +
      3; // highlight, improve, email
    let a = 0;
    if (overall) a++;
    if (recommend) a++;
    config.ratings.forEach((r) => ratings[r.id] && a++);
    config.choices?.forEach((c) => (choices[c.id]?.length ?? 0) > 0 && a++);
    if (highlight.trim()) a++;
    if (improve.trim()) a++;
    if (email.trim()) a++;
    return { answered: a, total: totalCount };
  }, [overall, recommend, ratings, choices, highlight, improve, email, config]);

  const progressPct = Math.round((answered / total) * 100);

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
        email,
        consent,
      },
      meta: {
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        page: typeof location !== "undefined" ? location.pathname : null,
      },
    };
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
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

  /* ----- Backdrop (cartoon hype) — outside the card ----- */
  const Backdrop = (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${slbArenaBg})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(232,93,58,0.25)_0%,transparent_55%),radial-gradient(ellipse_at_bottom,rgba(240,215,140,0.12)_0%,transparent_60%),linear-gradient(180deg,rgba(13,13,13,0.65)_0%,rgba(13,13,13,0.9)_100%)]"
      />
    </>
  );

  /* ----- Top bar (logo + label) ----- */
  const TopBar = (
    <header className="relative z-20 border-b border-white/10">
      <div aria-hidden className="absolute inset-0 bg-[#0d0d0d]/90 backdrop-blur" />
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <a href="https://www.superleaguebasketballm.co.uk/" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-block">
          <img
            src={slbLogo}
            alt="Super League Basketball"
            className="h-32 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] sm:h-40"
          />
        </a>
        <span className="hidden text-[11px] font-bold uppercase tracking-[0.3em] text-[#f0d78c] sm:block">
          Post-Event Survey
        </span>
      </div>
    </header>
  );

  if (done) {
    return (
      <div className="relative min-h-screen font-body text-white">
        {Backdrop}
        {TopBar}
        <main className="relative z-10 mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e85d3a] text-white shadow-[0_0_40px_rgba(232,93,58,0.45)]">
            <Check className="h-10 w-10" strokeWidth={3} />
          </div>
          <h1 className="mt-6 font-display text-6xl leading-none uppercase tracking-tight">
            Thank <span className="text-[#e85d3a]">you</span>
          </h1>
          <p className="mt-4 text-base text-white/70">
            Your insight helps make Super League Basketball Play-Off Finals even bigger next year.
          </p>
          <button
            onClick={reset}
            className="mt-10 inline-flex items-center gap-3 border border-white/15 px-8 py-3 font-display text-xl uppercase tracking-[0.2em] hover:border-[#e85d3a] hover:text-[#e85d3a] transition-colors"
          >
            Submit another response
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-body text-white">
      {Backdrop}
      {TopBar}

      <main className="relative z-10 mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-10">
        <div className="bg-[#1a1a1a] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* ----------- Broadcast Header ----------- */}
          <div className="relative h-56 w-full sm:h-64">
            <img
              src={slbHero}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/70 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#e85d3a]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f0d78c]">
                      {config.title} · Event Intelligence
                    </span>
                  </div>
                  <h1 className="font-display text-5xl leading-[0.85] tracking-tight uppercase sm:text-7xl">
                    Play-Off Finals
                    <br />
                    <span className="text-[#e85d3a]">Feedback</span>
                  </h1>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/75">
                    Progress: {progressPct}%
                  </span>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-6 ${
                          i < Math.round(progressPct / 10) ? "bg-[#e85d3a]" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm text-white/85">{config.intro}</p>
            </div>
          </div>

          {/* ----------- Bento Body ----------- */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-8">
            {/* Featured: Overall + Recommend */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 flex flex-col gap-8 border-l-4 border-[#e85d3a] bg-white/[0.03] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-md">
                  <h3 className="font-display text-3xl uppercase tracking-wide">
                    <span className="text-[#f0d78c]">01.</span> Overall Finals Experience
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    Thinking about the atmosphere, the game, and the venue — how would you rate your day?
                  </p>
                </div>
                <RatingPad name="overall" value={overall} onChange={setOverall} size="lg" lowLabel="Disappointing" highLabel="Elite" />
              </div>

              <div className="col-span-12 flex flex-col gap-8 border-l-4 border-[#f0d78c] bg-white/[0.03] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-md">
                  <h3 className="font-display text-3xl uppercase tracking-wide">
                    <span className="text-[#f0d78c]">02.</span> Would you recommend SLB Finals?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {config.recommendPrompt ?? "How likely are you to tell a friend they need to be at next year's Finals?"}
                  </p>
                </div>
                <RatingPad name="recommend" value={recommend} onChange={setRecommend} size="lg" lowLabel="Unlikely" highLabel="Definitely" />
              </div>

              {/* Ratings bento grid */}
              {config.ratings.map((r, i) => {
                // Alternate widths for a true bento feel
                const span = i % 3 === 0 ? "md:col-span-12" : i % 3 === 1 ? "md:col-span-7" : "md:col-span-5";
                return (
                  <div key={r.id} className={`col-span-12 ${span}`}>
                    <Tile index={String(i + 3).padStart(2, "0")} title={r.label}>
                      <RatingPad
                        name={r.id}
                        value={ratings[r.id] ?? ""}
                        onChange={(v) => setRatings((p) => ({ ...p, [r.id]: v }))}
                      />
                    </Tile>
                  </div>
                );
              })}

              {/* Choice questions bento grid */}
              {config.choices?.map((q, i) => {
                const idx = config.ratings.length + 3 + i;
                const span = q.multi || q.options.length > 5 ? "md:col-span-12" : "md:col-span-6";
                return (
                  <div key={q.id} className={`col-span-12 ${span}`}>
                    <Tile
                      index={String(idx).padStart(2, "0")}
                      title={q.label}
                      hint={q.multi ? "Select all that apply" : undefined}
                    >
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt) => {
                          const sel = choices[q.id] ?? [];
                          const active = sel.includes(opt);
                          return (
                            <Chip
                              key={opt}
                              active={active}
                              onClick={() => {
                                setChoices((p) => {
                                  const cur = p[q.id] ?? [];
                                  if (q.multi) {
                                    return {
                                      ...p,
                                      [q.id]: cur.includes(opt) ? cur.filter((v) => v !== opt) : [...cur, opt],
                                    };
                                  }
                                  return { ...p, [q.id]: [opt] };
                                });
                              }}
                            >
                              {opt}
                            </Chip>
                          );
                        })}
                      </div>
                    </Tile>
                  </div>
                );
              })}

              {/* Free text — twin tiles */}
              <div className="col-span-12 md:col-span-6">
                <Tile
                  index="★"
                  title={config.highlightPrompt ?? "Highlight of the Finals"}
                  hint="Optional · one thing that stood out"
                >
                  <Textarea
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="The moment the game turned…"
                    className="resize-none border-white/10 bg-[#0d0d0d] text-white placeholder:text-white/45 focus-visible:border-[#e85d3a] focus-visible:ring-0"
                  />
                </Tile>
              </div>
              <div className="col-span-12 md:col-span-6">
                <Tile
                  index="◇"
                  title={config.improvePrompt ?? "One thing to improve"}
                  hint="Optional · be honest"
                >
                  <Textarea
                    value={improve}
                    onChange={(e) => setImprove(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="One thing to make next time better…"
                    className="resize-none border-white/10 bg-[#0d0d0d] text-white placeholder:text-white/45 focus-visible:border-[#f0d78c] focus-visible:ring-0"
                  />
                </Tile>
              </div>

              {/* Email tile */}
              <div className="col-span-12">
                <Tile
                  index="@"
                  title="Email for follow-up"
                  hint="Required · we won't add you to marketing lists"
                >
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 border-white/10 bg-[#0d0d0d] text-base text-white placeholder:text-white/45 focus-visible:border-[#e85d3a] focus-visible:ring-0"
                  />
                </Tile>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 border border-[#e85d3a]/40 bg-[#e85d3a]/10 px-4 py-3 text-sm font-semibold text-[#f0d78c]">
                {error}
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 flex flex-col items-stretch justify-between gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center">
              <label className="flex max-w-sm cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-5 w-5 cursor-pointer accent-[#e85d3a]"
                />
                <span className="text-xs leading-relaxed text-white/80">
                  I agree my responses can be used by Super League Basketball to improve future events.
                </span>
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex w-full items-center justify-center gap-4 bg-[#e85d3a] px-12 py-4 font-display text-2xl uppercase tracking-[0.2em] text-white shadow-[0_10px_40px_rgba(232,93,58,0.35)] transition-all hover:bg-[#ff6b4a] disabled:opacity-60 sm:text-3xl md:w-auto"
              >
                {submitting ? "Submitting…" : "Submit Feedback"}
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" strokeWidth={3} />
              </button>
            </div>
          </form>

          {/* Branding stripe */}
          <div className="h-1 bg-gradient-to-r from-[#e85d3a] via-[#f0d78c] to-[#e85d3a]" />
        </div>

        <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">
          Super League Basketball · Post-Event Intelligence
        </p>
      </main>
    </div>
  );
}
