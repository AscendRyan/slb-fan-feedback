import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "@/components/survey/SurveyPage";

export const Route = createFileRoute("/partner")({
  component: () => (
    <SurveyPage
      config={{
        audience: "partner",
        title: "Partner / Sponsor",
        intro: "Tell us how your activation went — takes about 60 seconds.",
        audienceQuestion: "How well was your activation supported on-site?",
      }}
    />
  ),
  head: () => ({
    meta: [
      { title: "Partner Survey — Super League Basketball" },
      { name: "description", content: "Partner and sponsor feedback for Super League Basketball." },
    ],
  }),
});
