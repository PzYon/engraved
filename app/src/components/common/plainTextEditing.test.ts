import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/react";
import { plainTextExtensions, toPlainTextContent } from "./plainTextEditing";

// jsdom has none, and ProseMirror creates one when it is asked to paste.
(globalThis as unknown as { ClipboardEvent: unknown }).ClipboardEvent =
  class extends Event {};

// Each of these is changed by the markdown editor: read as formatting, turned into a heading, list
// or code block when loaded again, or stripped of its blank lines.
const texts = [
  "ghp_aB3_xY9__zz*12*~~x~~`q`",
  "my_var_name and __init__ and *star* and 2 * 3 * 4",
  "# not a heading\n- not a list\n1. not a list\n> not a quote",
  "    indented four\n\tand a tab",
  '{\n  "a_b": [1, 2],\n  "c": "x*y*z"\n}',
  "line one\nline two\n\nline four\n\n\nline seven",
  "ends with spaces and a line break   \n",
  "```\nfence\n```",
  '<div class="x">a & b</div>',
  "[text](not-a-link) and ![x](y)",
];

describe("plain text editing", () => {
  it.each(texts)("keeps %j when it is loaded", (text) => {
    const editor = createEditor(text);

    expect(editor.getText()).toBe(text);
  });

  it.each(texts)("keeps %j when it is pasted", (text) => {
    const editor = createEditor();

    editor.view.pasteText(text);

    expect(editor.getText()).toBe(text);
  });

  it.each(texts)("keeps %j when it is typed", (text) => {
    const editor = createEditor();

    for (const character of text) {
      type(editor, character);
    }

    expect(editor.getText()).toBe(text);
  });

  it("starts empty without a value", () => {
    expect(createEditor().getText()).toBe("");
    expect(createEditor("").getText()).toBe("");
  });

  it("undoes and redoes", () => {
    const editor = createEditor("before");

    editor.commands.insertContentAt(editor.state.doc.content.size - 1, "!");
    expect(editor.getText()).toBe("before!");

    press(editor, "z");
    expect(editor.getText()).toBe("before");

    press(editor, "y");
    expect(editor.getText()).toBe("before!");
  });
});

function createEditor(text?: string) {
  const editor = new Editor({
    extensions: plainTextExtensions,
    content: toPlainTextContent(text),
  });

  editor.commands.focus("end");

  return editor;
}

// The way the browser hands over a typed character, so that anything reacting to what is typed -
// which is how the markdown editor formats on the fly - gets its chance.
function type(editor: Editor, character: string) {
  if (character === "\n") {
    press(editor, "Enter", false);
    return;
  }

  const { from, to } = editor.state.selection;

  const insert = () => editor.state.tr.insertText(character, from, to);

  const isHandled = editor.view.someProp("handleTextInput", (handle) =>
    handle(editor.view, from, to, character, insert),
  );

  if (!isHandled) {
    editor.view.dispatch(insert());
  }
}

function press(editor: Editor, key: string, withModifier = true) {
  const event = new KeyboardEvent("keydown", {
    key,
    ctrlKey: withModifier,
    bubbles: true,
    cancelable: true,
  });

  editor.view.someProp("handleKeyDown", (handle) => handle(editor.view, event));
}
