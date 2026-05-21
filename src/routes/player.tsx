import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "@/components/survey/SurveyPage";

export const Route = createFileRoute("/player")({
  component: () => (
    <SurveyPage
      config={{
        audience: "player",
        title: "Player / Team Staff",
        intro: "Quick feedback from teams — takes about 60 seconds.",
        audienceQuestion: "How well organised was the event for teams?",
      }}
    />
  ),
  head: () => ({
    meta: [
      { title: "Player & Team Survey — Super League Basketball" },
      { name: "description", content: "Player and team staff feedback for Super League Basketball." },
    ],
  }),
});
