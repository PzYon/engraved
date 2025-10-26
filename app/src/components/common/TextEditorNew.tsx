import { styled } from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Emoji, { emojis } from "@tiptap/extension-emoji";
import { useState } from "react";

// https://tiptap.dev/docs/editor/markdown/getting-started/installation

const EmojiExtension = Emoji.configure({
  enableEmoticons: true,
  emojis: emojis,
  HTMLAttributes: {
    class: "ngrvd-emoji",
  },
});

export const TextEditorNew: React.FC<{
  initialValue?: string;
  setValue: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onKeyUp?: (e: KeyboardEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  forwardRef?: React.ForwardedRef<HTMLInputElement>;
  css?: React.CSSProperties;
}> = ({
  initialValue,
  setValue,
  //autoFocus,
  onKeyUp,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder,
  disabled,
  // forwardRef,
  // css,
}) => {
  const editor = useEditor(
    {
      editorProps: {
        attributes: {
          "data-testId": "placeholder-" + placeholder,
        },
        handleDOMEvents: {
          keyup: (view, event) => {
            onKeyUp?.(event);
            //event.preventDefault();
            return false; // Return false to allow the event to continue propagating
          },
          keydown: (view, event) => {
            onKeyDown?.(event);
            // event.preventDefault();
            return false; // Return false to allow the event to continue propagating
          },
        },
      },
      extensions: [StarterKit, EmojiExtension, Markdown],
      content: initialValue,
      contentType: "markdown",
      onFocus: () => onFocus?.(),
      onBlur: () => onBlur?.(),
      onUpdate: ({ editor }) => {
        setValue(editor.getMarkdown());
        setIsEmpty(!editor.getText());
      },
      editable: !disabled,
      autofocus: true,

      // onKeyDown: x => onKeyDown?.(x),
      // placeholder: placeholder,
    },
    [disabled],
  );

  const [isEmpty, setIsEmpty] = useState(!editor.getText());

  return (
    <Host className="ngrvd-text-editor">
      {placeholder && isEmpty ? (
        <PlaceholderContainer>{placeholder}</PlaceholderContainer>
      ) : null}
      <EditorContent editor={editor} />
      {/*<FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>*/}
      {/*<BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>*/}
    </Host>
  );
};

const Host = styled("div")`
  position: relative;
  background-color: ${(p) => p.theme.palette.common.white};
  width: 100%;
  font-family: ${(p) => p.theme.typography.fontFamily};

  border-radius: 3px;
  padding: 3px;

  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }

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
