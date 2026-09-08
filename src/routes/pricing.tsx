import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old pricing URL — everything lives on /checkout now. */
export const Route = createFileRoute("/pricing")({
  beforeLoad: () => {
    throw redirect({ to: "/checkout" });
  },
  head: () => ({
    meta: [
      { title: "Pricing — Unlawfully Detained" },
      {
        name: "description",
        content:
          "Flat prices for your eviction answer: free deadline check, $97 answer on form UD-105, $197 Fight Kit, $397 Defender, $497 Ultimate.",
      },
      { property: "og:title", content: "Pricing — Unlawfully Detained" },
      {
        property: "og:description",
        content: "Free deadline check, $97 answer, $197 Fight Kit, $397 Defender.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
