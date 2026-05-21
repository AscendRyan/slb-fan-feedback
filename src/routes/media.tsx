import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "@/components/survey/SurveyPage";

export const Route = createFileRoute("/media")({
  component: () => (
    <SurveyPage
      config={{
        audience: "media",
        title: "Media",
        intro: "Help us improve media operations at the Finals — takes about 90 seconds.",
        ratings: [
          { id: "accreditation", label: "How smooth was the accreditation process?" },
          { id: "mediaFacilities", label: "How would you rate the press tribune / media seating?" },
          { id: "wifi", label: "How reliable was the press-area Wi-Fi and power?" },
          { id: "mixedZone", label: "How well was the mixed zone / post-game access managed?" },
          { id: "pressConf", label: "How well were press conferences run (timing, audio, translation)?" },
          { id: "prSupport", label: "How responsive and helpful was the SLB PR / comms team?" },
          { id: "assets", label: "How would you rate the speed and quality of photos, stats and highlights provided?" },
          { id: "broadcastOps", label: "How well were broadcast operations (cameras, commentary, OB) handled?" },
        ],
        choices: [
          {
            id: "outletType",
            label: "What kind of outlet do you work for?",
            options: ["National TV / radio", "Broadcast rights holder", "National newspaper", "Specialist basketball outlet", "Local / regional press", "Podcast / digital creator", "Photographer / agency"],
          },
          {
            id: "role",
            label: "Your role on the day?",
            options: ["Reporter / journalist", "Commentator", "Producer", "Photographer", "Videographer", "Editor"],
          },
          {
            id: "covered",
            label: "Which days did you cover?",
            multi: true,
            options: ["Women's final", "Men's final", "Trophy / Cup matches", "Build-up / media day"],
          },
        ],
        highlightPrompt: "What worked well from a media operations point of view? (optional)",
        improvePrompt: "What is the single biggest thing SLB should fix for media next year? (optional)",
      }}
    />
  ),
  head: () => ({
    meta: [
      { title: "Media Survey — SLB Play-Off Finals" },
      { name: "description", content: "Media feedback for the Super League Basketball Play-Off Finals." },
    ],
  }),
});
