import { styled } from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Emoji, { emojis } from "@tiptap/extension-emoji";

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
  onKeyUp?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  forwardRef?: React.ForwardedRef<HTMLInputElement>;
  css?: React.CSSProperties;
}> = ({
  initialValue,
  setValue,
  //autoFocus,
  // onKeyUp,
  // onKeyDown,
  onFocus,
  onBlur,
  // placeholder,
  disabled,
  // forwardRef,
  // css,
}) => {
  const editor = useEditor(
    {
      extensions: [StarterKit, EmojiExtension, Markdown],
      content: initialValue,
      contentType: "markdown",
      onFocus: () => onFocus?.(),
      onBlur: () => onBlur?.(),
      onUpdate: ({ editor }) => {
        setValue(editor.getMarkdown());
      },
      editable: !disabled,
      autofocus: true,
      // onKeyDown: x => onKeyDown?.(x),
      // placeholder: placeholder,
    },
    [disabled],
  );

  return (
    <Host className="ngrvd-text-editor">
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
