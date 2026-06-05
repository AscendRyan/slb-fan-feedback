import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "@/components/survey/SurveyPage";

export const Route = createFileRoute("/partner")({
  component: () => (
    <SurveyPage
      config={{
        audience: "partner",
        title: "Partner / Sponsor",
        intro: "Tell us how your Finals activation went — takes about 90 seconds.",
        recommendPrompt: "How likely are you to tell a friend/colleague they need to partner with SLB at next year's Finals?",
        ratings: [
          { id: "accountMgmt", label: "How would you rate your SLB account management in the build-up?" },
          { id: "activationSupport", label: "How well was your on-site activation supported (load-in, power, space)?" },
          { id: "brandVisibility", label: "How would you rate your brand visibility in the arena and on broadcast?" },
          { id: "fanEngagement", label: "How well did your activation engage fans (Concourse/In-Arena)?" },
          { id: "hospitality", label: "How would you rate the hospitality experience for your guests?" },
          { id: "ticketingAllocation", label: "How well was your ticket allocation handled?" },
          { id: "digitalSocial", label: "How would you rate SLB's digital and social amplification of your brand?" },
          { id: "audienceFit", label: "How well did the Finals audience fit your target market?" },
          { id: "valueROI", label: "How would you rate the overall ROI of your partnership at the Finals?" },
        ],
        choices: [
          {
            id: "partnerType",
            label: "What type of partner are you?",
            options: ["Title / league partner", "Official partner", "Broadcast partner", "Supplier", "Local / venue partner", "Charity partner"],
          },
          {
            id: "activatedWith",
            label: "How did you activate at the Finals?",
            multi: true,
            options: ["Concourse stand / fan zone", "In-game LED / signage", "Half-time activity", "Giveaways / sampling", "Hospitality only", "Social / content collab"],
          },
          {
            id: "renew",
            label: "How likely are you to renew or extend your partnership?",
            options: ["Definitely will", "Likely", "Undecided", "Unlikely"],
          },
        ],
        highlightPrompt: "What was the biggest win for your brand at the Finals? (optional)",
        improvePrompt: "What is the single biggest thing SLB should do better for partners next year? (optional)",
      }}
    />
  ),
  head: () => ({
    meta: [
      { title: "Partner Survey — SLB Play-Off Finals" },
      { name: "description", content: "Partner and sponsor feedback for the Super League Basketball Play-Off Finals." },
    ],
  }),
});
