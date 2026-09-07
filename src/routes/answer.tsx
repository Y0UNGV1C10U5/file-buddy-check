import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PleadingBuilder } from "@/components/site/PleadingBuilder";

export const Route = createFileRoute("/answer")({
  head: () => ({
    meta: [
      { title: "Build Your Answer — 28-Line Court Pleading Paper" },
      {
        name: "description",
        content:
          "Type your side of the story and watch it land on Los Angeles 28-line pleading paper. Download Word, OpenDocument and print-ready PDF with a POS-030 proof of service.",
      },
      { property: "og:title", content: "Build Your Answer — Unlawfully Detained" },
      {
        property: "og:description",
        content:
          "Your words, laid out on Rule 2.108 pleading paper with numbered lines 1 to 28, plus a filled-in proof of service.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnswerPage,
});

function AnswerPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="border-b-4 border-ink bg-ink py-12 text-ink-foreground">
          <div className="container-page">
            <p className="eyebrow text-signal">The document builder</p>
            <h1 className="mt-3 text-5xl leading-[0.9] sm:text-7xl">
              Your words.
              <br />
              <span className="text-signal">Court paper.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg opacity-85">
              Fill in the boxes and watch the page on the right turn into a proper
              28-line pleading — the exact layout the Superior Court of California
              expects. Download it as Word, OpenDocument or a print-ready PDF, with the
              proof of service filled in.
            </p>
          </div>
        </section>

        <section className="container-page py-12">
          <PleadingBuilder />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
