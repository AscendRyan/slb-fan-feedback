import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "@/components/survey/SurveyPage";

export const Route = createFileRoute("/fan")({
  component: () => (
    <SurveyPage
      config={{
        audience: "fan",
        title: "Fan / Spectator",
        intro: "Tell us about your matchday — takes about 60 seconds.",
        audienceQuestion: "How would you rate the matchday atmosphere?",
      }}
    />
  ),
  head: () => ({
    meta: [
      { title: "Fan Survey — Super League Basketball" },
      { name: "description", content: "Share your matchday feedback with Super League Basketball." },
    ],
  }),
});
