"""Renders the API's TRX test results and Cobertura coverage reports as Markdown.

Usage: summarize-api-tests.py <results-directory>

Every test project writes its own coverage report, and assemblies like Engraved.Core
show up in several of them, so the reports are merged line by line rather than averaged.
"""

import html
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from xml.etree import ElementTree

TRX_NAMESPACE = {"t": "http://microsoft.com/schemas/VisualStudio/TeamTest/2010"}
MAX_LISTED_FAILURES = 50
MAX_FAILURE_MESSAGE_LENGTH = 2000


def parse_timestamp(value):
    # TRX timestamps carry 7 fractional digits, which fromisoformat only accepts from Python 3.11.
    return datetime.fromisoformat(re.sub(r"(\.\d{6})\d+", r"\1", value))


def summarize_tests(results_dir):
    rows = []
    failures = []

    for trx_file in sorted(results_dir.glob("*.trx")):
        run = ElementTree.parse(trx_file).getroot()
        test_methods = {
            test.get("id"): test.find("t:TestMethod", TRX_NAMESPACE) for test in run.iterfind(".//t:UnitTest", TRX_NAMESPACE)
        }
        any_method = next(iter(test_methods.values()), None)
        project = Path(any_method.get("codeBase")).stem if any_method is not None else trx_file.stem

        outcomes = Counter()
        for result in run.iterfind(".//t:UnitTestResult", TRX_NAMESPACE):
            outcome = result.get("outcome")
            outcomes[outcome] += 1
            if outcome == "Failed":
                message = result.findtext(".//t:ErrorInfo/t:Message", "", TRX_NAMESPACE).strip()
                test_class = test_methods[result.get("testId")].get("className").rsplit(".", 1)[-1]
                failures.append((project, f"{test_class}.{result.get('testName')}", message))

        times = run.find("t:Times", TRX_NAMESPACE)
        duration = parse_timestamp(times.get("finish")) - parse_timestamp(times.get("start"))
        other = sum(outcomes.values()) - outcomes["Passed"] - outcomes["Failed"] - outcomes["NotExecuted"]
        rows.append((project, outcomes["Passed"], outcomes["Failed"], outcomes["NotExecuted"], other, duration))

    if not rows:
        return ["### API tests", "", "No test results were found."]

    totals = [sum(row[i] for row in rows) for i in range(1, 5)]
    status = "❌" if totals[1] or totals[3] else "✅"
    lines = [
        f"### {status} API tests",
        "",
        "| Project | Passed | Failed | Skipped | Other | Duration |",
        "| --- | ---: | ---: | ---: | ---: | ---: |",
    ]
    for project, passed, failed, skipped, other, duration in sorted(rows):
        lines.append(f"| {project} | {passed} | {failed} | {skipped} | {other} | {duration.total_seconds():.1f}s |")
    lines.append(f"| **Total** | **{totals[0]}** | **{totals[1]}** | **{totals[2]}** | **{totals[3]}** | |")

    if failures:
        lines += ["", "#### Failed tests", ""]
        for project, test_name, message in failures[:MAX_LISTED_FAILURES]:
            lines += [
                f"<details><summary>{project}: <code>{html.escape(test_name)}</code></summary>",
                "",
                "```",
                message[:MAX_FAILURE_MESSAGE_LENGTH],
                "```",
                "",
                "</details>",
            ]
        if len(failures) > MAX_LISTED_FAILURES:
            lines.append(f"…and {len(failures) - MAX_LISTED_FAILURES} more.")

    return lines


def summarize_coverage(results_dir):
    # (package, file, line) -> whether any test run hit it
    line_hits = {}
    # (package, file, line) -> (covered, total) branch conditions
    branch_hits = {}

    for report in results_dir.rglob("coverage.cobertura.xml"):
        for package in ElementTree.parse(report).getroot().iterfind(".//package"):
            for cls in package.iterfind(".//class"):
                for line in cls.iterfind("lines/line"):
                    key = (package.get("name"), cls.get("filename"), line.get("number"))
                    line_hits[key] = line_hits.get(key, False) or int(line.get("hits")) > 0

                    condition = re.search(r"\((\d+)/(\d+)\)", line.get("condition-coverage", ""))
                    if condition:
                        covered, total = int(condition.group(1)), int(condition.group(2))
                        branch_hits[key] = (max(covered, branch_hits.get(key, (0, 0))[0]), total)

    if not line_hits:
        return ["### API coverage", "", "No coverage reports were found."]

    per_package = defaultdict(lambda: [0, 0, 0, 0])
    for (package, _, _), hit in line_hits.items():
        per_package[package][0] += hit
        per_package[package][1] += 1
    for (package, _, _), (covered, total) in branch_hits.items():
        per_package[package][2] += covered
        per_package[package][3] += total

    def rate(covered, total):
        return f"{covered / total:.1%} ({covered}/{total})" if total else "–"

    lines = ["### API coverage", "", "| Assembly | Lines | Branches |", "| --- | ---: | ---: |"]
    for package, (lines_covered, lines_total, branches_covered, branches_total) in sorted(per_package.items()):
        lines.append(f"| {package} | {rate(lines_covered, lines_total)} | {rate(branches_covered, branches_total)} |")
    totals = [sum(counts[i] for counts in per_package.values()) for i in range(4)]
    lines.append(f"| **Total** | **{rate(totals[0], totals[1])}** | **{rate(totals[2], totals[3])}** |")
    return lines


def main():
    results_dir = Path(sys.argv[1])
    print("\n".join(summarize_tests(results_dir) + [""] + summarize_coverage(results_dir)))


if __name__ == "__main__":
    main()
