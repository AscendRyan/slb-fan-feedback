import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "@/components/survey/SurveyPage";

export const Route = createFileRoute("/discount")({
  component: () => (
    <SurveyPage
      config={{
        audience: "discount",
        title: "Discount Ticket Holder",
        intro: "You bought a discounted ticket to the Play-Off Finals — tell us how it went. Takes about 90 seconds.",
        ratings: [
          { id: "valueForMoney", label: "How would you rate value for money on your discounted ticket?" },
          { id: "purchaseEase", label: "How easy was it to find and buy the discounted ticket?" },
          { id: "priceClarity", label: "How clear was the pricing and what was included?" },
          { id: "seatQuality", label: "How happy were you with the seat / view you got for the price?" },
          { id: "atmosphere", label: "How would you rate the matchday atmosphere inside the arena?" },
          { id: "entertainment", label: "How was the half-time and in-arena entertainment?" },
          { id: "foodDrink", label: "How would you rate the food and drink offering?" },
          { id: "venueAccess", label: "How easy was it to get to and into the venue?" },
          { id: "staffFriendly", label: "How friendly and helpful were arena staff and stewards?" },
          { id: "merch", label: "How would you rate the merchandise on offer?" },
        ],
        choices: [
          {
            id: "discountType",
            label: "Which type of discount did you use?",
            options: [
              "Under 16s / Junior",
              "Student",
              "Concession (over 65)",
              "Family bundle",
              "Group booking (10+)",
              "Early-bird",
              "Promo / partner code",
              "Other",
            ],
          },
          {
            id: "discountSource",
            label: "Where did you hear about the discount?",
            multi: true,
            options: [
              "SLB website",
              "Email newsletter",
              "Club / team",
              "School or university",
              "Instagram",
              "TikTok",
              "Friend or family",
              "Local press",
            ],
          },
          {
            id: "purchasePlatform",
            label: "Where did you buy the ticket?",
            options: ["SLB website", "AXS", "Ticketmaster / reseller", "Club / team", "Box office", "On the door", "Other"],
          },
          {
            id: "attendedWith",
            label: "Who did you come with?",
            options: ["Family with kids", "Partner", "Friends", "Group / club", "Solo"],
          },
          {
            id: "wouldPayFull",
            label: "Without the discount, would you have come at full price?",
            options: ["Definitely", "Probably", "Probably not", "No"],
          },
          {
            id: "returnNext",
            label: "Will you come to next year's Finals?",
            options: ["Definitely", "Probably", "Maybe", "Probably not"],
          },
        ],
        highlightPrompt: "What was the best part of your matchday? (optional)",
        improvePrompt: "What could SLB do to make discounted tickets even better next year? (optional)",
      }}
    />
  ),
  head: () => ({
    meta: [
      { title: "Discount Ticket Survey — SLB Play-Off Finals" },
      { name: "description", content: "Feedback from discount ticket buyers at the Super League Basketball Play-Off Finals." },
    ],
  }),
});
