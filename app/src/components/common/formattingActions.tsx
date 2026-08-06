import React from "react";
import { Editor } from "@tiptap/react";
import Code from "@mui/icons-material/Code";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatIndentDecrease from "@mui/icons-material/FormatIndentDecrease";
import FormatIndentIncrease from "@mui/icons-material/FormatIndentIncrease";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatQuote from "@mui/icons-material/FormatQuote";
import FormatStrikethrough from "@mui/icons-material/FormatStrikethrough";
import Spellcheck from "@mui/icons-material/Spellcheck";
import { IAction } from "./actions/IAction";

// A list, not logic: every entry is the same shape and only names a command the editor already has.
// It lives beside the editor rather than inside it because nine inline handlers made up most of that
// component's bulk while saying nothing about how it works.
export function getFormattingActions(
  editor: Editor,
  enableSpellCheck: boolean,
  setEnableSpellCheck: (enable: boolean) => void,
): IAction[] {
  return [
    {
      key: "formatting-bold",
      icon: <FormatBold fontSize="small" />,
      label: "Bold",
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      key: "formatting-italic",
      icon: <FormatItalic fontSize="small" />,
      label: "Italic",
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      key: "strike",
      icon: <FormatStrikethrough fontSize="small" />,
      label: "Strike",
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      key: "formatting-code",
      icon: <Code fontSize="small" />,
      label: "Code",
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
    {
      key: "quote",
      icon: <FormatQuote fontSize="small" />,
      label: "Quote",
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      key: "formatting-list",
      icon: <FormatListBulleted fontSize="small" />,
      label: "List",
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      key: "formatting-indent-increase",
      icon: <FormatIndentIncrease fontSize="small" />,
      label: "Indent",
      onClick: () => editor.chain().focus().sinkListItem("listItem").run(),
    },
    {
      key: "formatting-indent-decrease",
      icon: <FormatIndentDecrease fontSize="small" />,
      label: "Unindent",
      onClick: () => editor.chain().focus().liftListItem("listItem").run(),
    },
    {
      key: "text-correction",
      icon: <Spellcheck fontSize="small" />,
      label: "Text correction",
      onClick: () => setEnableSpellCheck(!enableSpellCheck),
      isNotActive: !enableSpellCheck,
    },
  ];
}
