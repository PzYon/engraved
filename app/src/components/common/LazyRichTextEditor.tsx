import { styled } from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Emoji, { emojis } from "@tiptap/extension-emoji";
import { useEffect, useState } from "react";
import { IRichTextEditorProps } from "./IRichTextEditorProps";

// https://tiptap.dev/docs/editor/markdown/getting-started/installation

const EmojiExtension = Emoji.configure({
  enableEmoticons: true,
  emojis: emojis,
  HTMLAttributes: {
    class: "ngrvd-emoji",
  },
});

const LazyRichTextEditor: React.FC<IRichTextEditorProps> = ({
  setGiveFocus,
  initialValue,
  setValue,
  autoFocus,
  onKeyUp,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder,
  disabled,
  css,
}) => {
  const editor = useEditor(
    {
      editorProps: {
        attributes: {
          "data-testId": "placeholder-" + placeholder,
        },
        handleDOMEvents: {
          keyup: (view, event) => {
            // debugger;
            onKeyUp?.(event);
            //event.preventDefault();
            return false; // Return false to allow the event to continue propagating
          },
          keydown: (view, event) => {
            // debugger;
            onKeyDown?.(event);
            // event.preventDefault();
            return false; // Return false to allow the event to continue propagating
          },
        },
      },
      extensions: [StarterKit, EmojiExtension, Markdown],
      content: initialValue,
      contentType: "markdown",
      autofocus: autoFocus ? "end" : null,
      onFocus: () => onFocus?.(),
      onBlur: () => onBlur?.(),
      onUpdate: ({ editor }) => {
        setValue(editor.getMarkdown());
        setIsEmpty(!editor.getText());
      },
      editable: !disabled,
    },
    [disabled],
  );

  useEffect(() => {
    setGiveFocus?.(() => editor.commands.focus());
  }, [editor, setGiveFocus]);

  const [isEmpty, setIsEmpty] = useState(!editor.getText());

  return (
    <Host className="ngrvd-text-editor">
      {placeholder && isEmpty ? (
        <PlaceholderContainer>{placeholder}</PlaceholderContainer>
      ) : null}
      <StyledEditorContent style={css} editor={editor} role="textbox" />
    </Host>
  );
};

const StyledEditorContent = styled(EditorContent)`
  .ProseMirror-focused {
    border-radius: 3px;
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }
`;

const Host = styled("div")`
  position: relative;
  background-color: ${(p) => p.theme.palette.common.white};
  width: 100%;
  font-family: ${(p) => p.theme.typography.fontFamily};
  padding: 3px;

  p {
    margin: 0;
  }
`;

const PlaceholderContainer = styled("span")`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.6;
`;

export default LazyRichTextEditor;
