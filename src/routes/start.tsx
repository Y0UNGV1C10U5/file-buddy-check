import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The old "Start" interstitial only re-explained the questions before sending
 * people onward. One less decision: send straight to the gated builder.
 */
export const Route = createFileRoute("/start")({
  beforeLoad: () => {
    throw redirect({ to: "/build" });
  },
});
