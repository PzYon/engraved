import { css, styled } from "@mui/material";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import { useEffect, useState } from "react";
import { IRichTextEditorProps } from "./IRichTextEditorProps";
import { MarkdownContainer } from "../details/scraps/markdown/MarkdownContainer";

const DisableEnter = Extension.create({
  name: "disable-enter",

  addKeyboardShortcuts: () => {
    return {
      // Return 'true' to indicate the event was handled and
      // prevent the default browser/editor action (new line).
      Enter: () => true,
      "Shift-Enter": () => true,
    };
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
  css: styles,
  isTitle,
}) => {
  const extensions = [StarterKit, Markdown];

  if (isTitle) {
    extensions.push(DisableEnter);
  }

  const editor = useEditor(
    {
      editorProps: {
        attributes: placeholder
          ? { "data-testId": "placeholder-" + placeholder }
          : undefined,
        handleDOMEvents: {
          keyup: (view, event) => {
            onKeyUp?.(event);
            // return false to allow the event to continue propagating
            return false;
          },
          keydown: (view, event) => {
            onKeyDown?.(event);
            // return false to allow the event to continue propagating
            return false;
          },
        },
      },
      extensions: extensions,
      content: initialValue,
      contentType: "markdown",
      autofocus: autoFocus ? "end" : false,
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
        <PlaceholderContainer>
          <PlaceholderText>{placeholder}</PlaceholderText>
        </PlaceholderContainer>
      ) : null}
      <MarkdownContainer>
        <StyledEditorContent
          style={styles}
          isTitle={isTitle}
          editor={editor}
          role="textbox"
        />
      </MarkdownContainer>
    </Host>
  );
};

const StyledEditorContent = styled(EditorContent)<{ isTitle?: boolean }>`
  .ProseMirror {
    outline: 2px solid ${(p) => p.theme.palette.background.default};
    border-radius: 3px;
    z-index: 100;
    margin: 2px;
    padding: 4px;
  }

  ${(p) =>
    p.isTitle
      ? css`
          p {
            margin: 0;
          }
        `
      : undefined}

  .ProseMirror-focused {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }
`;

const Host = styled("div")`
  position: relative;
  background-color: ${(p) => p.theme.palette.common.white};
  width: 100%;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

const PlaceholderContainer = styled("span")`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.6;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: ${(p) => p.theme.spacing(1)};
`;

const PlaceholderText = styled("span")``;

export default LazyRichTextEditor;
