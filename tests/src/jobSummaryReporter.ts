import { appendFileSync } from "node:fs";
import { relative } from "node:path";
import { stripVTControlCharacters } from "node:util";
import type {
  FullResult,
  Reporter,
  Suite,
  TestCase,
} from "@playwright/test/reporter";

const maxListedFailures = 50;
const maxErrorLength = 2000;

// Writes the results to the GitHub Actions job summary, which Playwright's
// built-in "github" reporter does not do (it only adds annotations).
export default class JobSummaryReporter implements Reporter {
  private rootSuite: Suite;

  onBegin(_: unknown, suite: Suite) {
    this.rootSuite = suite;
  }

  onEnd(result: FullResult) {
    const outputPath = process.env.GITHUB_STEP_SUMMARY;
    if (!outputPath || !this.rootSuite) {
      return;
    }

    const tests = this.rootSuite.allTests();
    const byOutcome = (outcome: ReturnType<TestCase["outcome"]>) =>
      tests.filter((test) => test.outcome() === outcome);
    const failed = byOutcome("unexpected");
    const flaky = byOutcome("flaky");

    const projects = this.rootSuite.suites
      .map((projectSuite) => projectSuite.title)
      .join(", ");
    const icon = result.status === "passed" ? "✅" : "❌";

    const lines = [
      `### ${icon} E2E tests (${projects})`,
      "",
      "| Status | Passed | Failed | Flaky | Skipped | Duration |",
      "| --- | ---: | ---: | ---: | ---: | ---: |",
      `| ${result.status} | ${byOutcome("expected").length} | ${failed.length} | ${flaky.length} | ${byOutcome("skipped").length} | ${(result.duration / 1000).toFixed(1)}s |`,
    ];

    for (const [heading, list] of [
      ["Failed tests", failed],
      ["Flaky tests", flaky],
    ] as const) {
      if (list.length) {
        lines.push("", `#### ${heading}`, "");
        lines.push(...list.slice(0, maxListedFailures).flatMap(describeTest));
        if (list.length > maxListedFailures) {
          lines.push(`…and ${list.length - maxListedFailures} more.`);
        }
      }
    }

    appendFileSync(outputPath, lines.join("\n") + "\n\n");
  }

  printsToStdio() {
    return false;
  }
}

function describeTest(test: TestCase): string[] {
  // The title path starts with the root suite, the project and the file.
  const title = test.titlePath().slice(3).join(" › ");
  const error = test.results
    .flatMap((result) => result.errors)
    .map((e) => stripVTControlCharacters(e.message ?? e.value ?? ""))
    .find(Boolean);

  return [
    `<details><summary><code>${escapeHtml(title)}</code> (${relative(process.cwd(), test.location.file)}:${test.location.line})</summary>`,
    "",
    "```",
    (error ?? "No error message.").slice(0, maxErrorLength),
    "```",
    "",
    "</details>",
  ];
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
