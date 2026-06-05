import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "@/components/survey/SurveyPage";

export const Route = createFileRoute("/fan")({
  component: () => (
    <SurveyPage
      config={{
        audience: "fan",
        title: "Fan / Spectator",
        intro: "Tell us about your day at the Play-Off Finals — takes about 90 seconds.",
        ratings: [
          { id: "atmosphere", label: "How would you rate the matchday atmosphere inside the arena?" },
          { id: "entertainment", label: "How was the half-time and in-arena entertainment (MC, music, dancers, kiss cam)?" },
          { id: "valueTicket", label: "How would you rate value for money on your ticket?" },
          { id: "valueTravel", label: "How would you rate value for money on travel to the Finals?" },
          { id: "valueFood", label: "How would you rate value for money on food and drink at the venue?" },
          { id: "foodDrink", label: "How would you rate the food and drink offering?" },
          { id: "venueAccess", label: "How easy was it to get to and into the venue?" },
          { id: "seatingView", label: "How happy were you with your seat and view of the court?" },
          { id: "staffFriendly", label: "How friendly and helpful were arena staff and stewards?" },
          { id: "merch", label: "How would you rate the merchandise on offer?" },
          { id: "broadcastApp", label: "How useful was the SLB app / programme / big-screen graphics during the game?" },
        ],
        choices: [
          {
            id: "attendedWith",
            label: "Who did you come with?",
            options: ["Family with kids", "Partner", "Friends", "Group / club", "Solo"],
          },
          {
            id: "firstTime",
            label: "Was this your first SLB Finals?",
            options: ["Yes, first time", "Been to 1–2 before", "Regular — 3+"],
          },
          {
            id: "travelDistance",
            label: "How far did you travel?",
            options: ["Under 10 miles", "10–50 miles", "50–150 miles", "150+ miles"],
          },
          {
            id: "ticketSource",
            label: "Where did you buy your ticket?",
            options: ["SLB website", "Club / team", "Ticketmaster / reseller", "On the door", "Gifted / comp"],
          },
          {
            id: "heardAbout",
            label: "How did you hear about the Finals?",
            multi: true,
            options: ["TV / Sky Sports", "Instagram", "TikTok", "X / Twitter", "Friend or family", "Club newsletter", "Local press"],
          },
          {
            id: "returnNext",
            label: "Will you come to next year's Finals?",
            options: ["Definitely", "Probably", "Maybe", "Probably not"],
          },
        ],
        highlightPrompt: "What was the highlight of your matchday? (optional)",
        improvePrompt: "What one thing would make next year's Finals even better? (optional)",
      }}
    />
  ),
  head: () => ({
    meta: [
      { title: "Fan Survey — SLB Play-Off Finals" },
      { name: "description", content: "Share your matchday feedback from the Super League Basketball Play-Off Finals." },
    ],
  }),
});
