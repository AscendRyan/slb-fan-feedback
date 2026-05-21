import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "@/components/survey/SurveyPage";

export const Route = createFileRoute("/player")({
  component: () => (
    <SurveyPage
      config={{
        audience: "player",
        title: "Player / Team Staff",
        intro: "Help us raise the standard of the Finals for teams — takes about 90 seconds.",
        ratings: [
          { id: "organisation", label: "How well organised was the event for teams overall?" },
          { id: "comms", label: "How clear and timely were communications from SLB in the lead-up?" },
          { id: "schedule", label: "How well did the matchday schedule (arrivals, shootaround, tip-off) work?" },
          { id: "lockerRoom", label: "How would you rate the locker room facilities?" },
          { id: "courtPlayability", label: "How would you rate the court surface and playing conditions?" },
          { id: "officiating", label: "How would you rate the standard of officiating?" },
          { id: "medical", label: "How would you rate the medical and physio provision on-site?" },
          { id: "transportHotel", label: "How would you rate travel and hotel arrangements?" },
          { id: "cateringTeams", label: "How would you rate team catering on matchday?" },
          { id: "presentation", label: "How well were team intros, anthems and trophy presentation handled?" },
        ],
        choices: [
          {
            id: "role",
            label: "What is your role?",
            options: ["Player", "Head coach", "Assistant coach", "Performance / S&C", "Medical", "Team manager / ops"],
          },
          {
            id: "league",
            label: "Which competition?",
            options: ["SLB Men", "SLB Women"],
          },
          {
            id: "outcome",
            label: "Did your team play in the final?",
            options: ["Won the title", "Lost in the final", "Lost in semi-final", "Did not qualify this year"],
          },
        ],
        highlightPrompt: "What did SLB do best at the Finals? (optional)",
        improvePrompt: "What is the single biggest thing SLB should fix for teams next year? (optional)",
      }}
    />
  ),
  head: () => ({
    meta: [
      { title: "Player & Team Survey — SLB Play-Off Finals" },
      { name: "description", content: "Player and team staff feedback for the Super League Basketball Play-Off Finals." },
    ],
  }),
});
