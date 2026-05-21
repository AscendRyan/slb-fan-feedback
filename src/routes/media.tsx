import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "@/components/survey/SurveyPage";

export const Route = createFileRoute("/media")({
  component: () => (
    <SurveyPage
      config={{
        audience: "media",
        title: "Media",
        intro: "Help us improve media operations — takes about 60 seconds.",
        audienceQuestion: "How well were media facilities and access handled?",
      }}
    />
  ),
  head: () => ({
    meta: [
      { title: "Media Survey — Super League Basketball" },
      { name: "description", content: "Media feedback for Super League Basketball final events." },
    ],
  }),
});
