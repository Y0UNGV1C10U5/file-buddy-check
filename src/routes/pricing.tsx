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
          "One flat price: $220 for your answer to an unlawful detainer on form UD-105, with your attachment and proof of service, ready within the hour.",
      },
      { property: "og:title", content: "Pricing — Unlawfully Detained" },
      {
        property: "og:description",
        content: "$220 flat for your eviction answer, ready within the hour.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
