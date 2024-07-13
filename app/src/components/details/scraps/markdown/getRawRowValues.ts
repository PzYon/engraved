import { Token } from "markdown-it";
import { getMarkdownInstance } from "./getMarkdownInstance";

const md = getMarkdownInstance();

export function getRawRowValues(value: string): string[] {
  return md
    .parseInline(value, {})
    .flatMap((token) => tokensToLines(token.children));
}

function tokensToLines(tokens: Token[]) {
  const linesOfText: string[] = [];
  let currentLineTokens: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const childToken = tokens[i];
    const isLastLine = i === tokens.length - 1;

    if (childToken.type === "softbreak") {
      goToNextLine();
    } else if (childToken.type === "text") {
      addLineValues(childToken);
    }

    if (isLastLine) {
      goToNextLine();
    }
  }

  return linesOfText;

  function goToNextLine() {
    if (currentLineTokens.length) {
      linesOfText.push(currentLineTokens.join(" "));
    }

    currentLineTokens = [];
  }

  function addLineValues(childToken: Token) {
    currentLineTokens.push(
      ...md
        .parse(childToken.content, {})
        .filter((t) => t.type === "inline")
        .map((t) => t.content.trim())
        .filter((t) => !!t),
    );
  }
}
