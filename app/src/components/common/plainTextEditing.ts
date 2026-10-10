import { Extension, JSONContent, Node } from "@tiptap/react";
import { history, redo, undo } from "@tiptap/pm/history";
import { keymap } from "@tiptap/pm/keymap";

// What goes in is what comes out: the markdown editor reads "2 * 3 * 4" as formatting, turns a line
// starting with "#" into a heading once it is loaded again and drops blank lines. Here the whole
// document is one block of text that ProseMirror treats as code, which is what makes it keep
// whitespace and line breaks, paste the plain text of whatever is on the clipboard and apply no
// formatting rules at all.
const PlainTextDocument = Node.create({
  name: "doc",
  topNode: true,
  content: "plainText",
});

const PlainText = Node.create({
  name: "plainText",
  content: "text*",
  marks: "",
  code: true,
  defining: true,
  parseHTML: () => [{ tag: "div", preserveWhitespace: "full" }],
  renderHTML: () => ["div", 0],
});

const Text = Node.create({
  name: "text",
  group: "inline",
});

// StarterKit brings this along for the markdown editor, but nothing else of it has a place here.
const UndoRedo = Extension.create({
  name: "plainTextUndoRedo",
  addProseMirrorPlugins: () => [
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo, "Shift-Mod-z": redo }),
  ],
});

export const plainTextExtensions = [
  PlainTextDocument,
  PlainText,
  Text,
  UndoRedo,
];

export function toPlainTextContent(text: string | undefined): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "plainText",
        // An empty text node is not allowed.
        content: text ? [{ type: "text", text }] : undefined,
      },
    ],
  };
}
