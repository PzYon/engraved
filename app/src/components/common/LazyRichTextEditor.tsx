import { css, styled } from "@mui/material";
import {
  Editor,
  EditorContent,
  EditorOptions,
  Extension,
  Extensions,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Image from "@tiptap/extension-image";
import { EditorView } from "@tiptap/pm/view";
import React, { useEffect, useState } from "react";
import { IRichTextEditorProps } from "./IRichTextEditorProps";
import { MarkdownContainer } from "../details/scraps/markdown/MarkdownContainer";
import { ActionIconButtonGroup } from "./actions/ActionIconButtonGroup";
import {
  getFormattingActions,
  getTogglePlainTextAction,
} from "./formattingActions";
import { IAction } from "./actions/IAction";
import { plainTextExtensions, toPlainTextContent } from "./plainTextEditing";

const replacements: Record<string, string> = {
  "!!!": "‼️",
  "!?!": "⁉️",
  "?!?": "⁉️",
  "???": "❓",
};

const toReplace = Object.keys(replacements);

// Turns "!!!" and friends into the single character as they are typed. Depends on nothing the
// component holds, so it sits out here rather than nested three levels inside the editor options.
function replaceShorthand(
  view: EditorView,
  from: number,
  to: number,
  text: string,
) {
  if (from < 3) {
    return false;
  }

  const combined = view.state.doc.textBetween(from - 2, from, "") + text;

  if (!toReplace.includes(combined)) {
    return false;
  }

  view.dispatch(
    view.state.tr.replaceWith(
      from - 2,
      to,
      view.state.schema.text(replacements[combined]),
    ),
  );

  return true;
}

// Returns true only when images were actually taken, so that pasting text - or dropping anything
// else - still behaves exactly as it did before. The upload is deliberately not awaited: ProseMirror
// needs the handled/not-handled answer synchronously, and the images are inserted once they arrive.
function insertDroppedImages(
  editor: Editor,
  images: IRichTextEditorProps["images"],
  data: DataTransfer | null,
) {
  if (!images) {
    return false;
  }

  const dropped = [...(data?.files ?? [])].filter((f) =>
    f.type.startsWith("image/"),
  );

  if (!dropped.length) {
    return false;
  }

  images.onDropped(dropped).then((sources) => {
    for (const source of sources) {
      editor.chain().focus().setImage(source).run();
    }
  });

  return true;
}

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

// Everything that differs between editing markdown and editing plain text, so that the component
// picks one of the two once instead of asking which it is at every turn.
interface IEditorMode {
  extensions: Extensions;
  getContent: (
    value: string | undefined,
  ) => Partial<Pick<EditorOptions, "content" | "contentType">>;
  getValue: (editor: Editor) => string;
  handleTextInput?: typeof replaceShorthand;
  // Plain text has no place for an image.
  getImages: (
    images: IRichTextEditorProps["images"],
  ) => IRichTextEditorProps["images"];
  getFormattingActions: typeof getFormattingActions;
}

const markdownMode: IEditorMode = {
  // StarterKit carries no image node, so without this an image in the markdown would be dropped on
  // the way in and lost on the next save.
  extensions: [StarterKit, Markdown, Image],
  getContent: (value) => ({
    content: value === "" ? undefined : value,
    contentType: "markdown",
  }),
  getValue: (editor) => editor.getMarkdown(),
  handleTextInput: replaceShorthand,
  getImages: (images) => images,
  getFormattingActions: getFormattingActions,
};

const plainTextMode: IEditorMode = {
  extensions: plainTextExtensions,
  getContent: (value) => ({ content: toPlainTextContent(value) }),
  getValue: (editor) => editor.getText(),
  getImages: () => undefined,
  // None of the formatting commands exist for plain text.
  getFormattingActions: () => [],
};

function getEditorMode(isPlainText: boolean | undefined) {
  return isPlainText ? plainTextMode : markdownMode;
}

const EditorPlaceholder: React.FC<{
  text: string | undefined;
  isEditorEmpty: boolean;
}> = ({ text, isEditorEmpty }) => {
  if (!text || !isEditorEmpty) {
    return null;
  }

  return (
    <PlaceholderContainer>
      <PlaceholderText>{text}</PlaceholderText>
    </PlaceholderContainer>
  );
};

const EditorToolbar: React.FC<{
  editor: Editor;
  mode: IEditorMode;
  editModeActions: IAction[] | undefined;
  enableSpellCheck: boolean;
  setEnableSpellCheck: (enable: boolean) => void;
  isPlainText: boolean;
  toggleIsPlainText: (() => void) | undefined;
}> = ({
  editor,
  mode,
  editModeActions,
  enableSpellCheck,
  setEnableSpellCheck,
  isPlainText,
  toggleIsPlainText,
}) => {
  return (
    <ActionIconButtonGroup
      alignToPosition="top"
      stickToPosition="top"
      actions={[
        ...(editModeActions ?? []),
        ...(toggleIsPlainText
          ? [getTogglePlainTextAction(isPlainText, toggleIsPlainText)]
          : []),
        ...mode.getFormattingActions(
          editor,
          enableSpellCheck,
          setEnableSpellCheck,
        ),
      ]}
    />
  );
};

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
  isPlainText,
  onIsPlainTextChange,
  showFormattingOptions,
  editModeActions,
  images: imagesFromProps,
}) => {
  const mode = getEditorMode(isPlainText);

  // What a newly created editor starts with. That is the value handed in, until the mode is
  // switched: the editor is created anew then, and has to carry on with what the previous one held.
  const [startValue, setStartValue] = useState(initialValue);

  const images = mode.getImages(imagesFromProps);

  const extensions = [...mode.extensions];

  if (isTitle) {
    extensions.push(DisableEnter);
  }

  // Annotated rather than inferred: the paste handler below is part of this very call and passes the
  // editor on, which without a declared type is a circular inference.
  const editor: Editor = useEditor(
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
        handlePaste: (view, event) => insertImages(event.clipboardData),

        handleDrop: (view, event) =>
          insertImages((event as DragEvent).dataTransfer),

        handleTextInput: mode.handleTextInput,
      },
      extensions: extensions,
      ...mode.getContent(startValue),
      autofocus: autoFocus ? "end" : false,
      onFocus: () => onFocus?.(),
      onBlur: () => onBlur?.(),
      onUpdate: ({ editor }) => {
        setValue(mode.getValue(editor));
        setIsEmpty(!editor.getText());
      },
      editable: !disabled,
    },
    [disabled, isPlainText],
  );

  // One effect for both, because they are the same thing: handing the caller a way to drive an editor
  // it cannot otherwise reach.
  useEffect(() => {
    setGiveFocus?.(() => editor.commands?.focus());

    images?.setInsert((image) => editor.chain().focus().setImage(image).run());
  }, [editor, setGiveFocus, images]);

  // The text itself is left as it is: switching only changes whether it is edited as markdown or
  // as the characters it consists of.
  function toggleIsPlainText() {
    setStartValue(mode.getValue(editor));
    onIsPlainTextChange?.(!isPlainText);
  }

  function insertImages(data: DataTransfer | null) {
    return insertDroppedImages(editor, images, data);
  }

  const [isEmpty, setIsEmpty] = useState(!editor.getText());

  const [enableSpellCheck, setEnableSpellCheck] = useState(false);

  return (
    <Host className="ngrvd-text-editor">
      <EditorPlaceholder text={placeholder} isEditorEmpty={isEmpty} />
      {showFormattingOptions ? (
        <EditorToolbar
          editor={editor}
          mode={mode}
          editModeActions={editModeActions}
          enableSpellCheck={enableSpellCheck}
          setEnableSpellCheck={setEnableSpellCheck}
          isPlainText={!!isPlainText}
          toggleIsPlainText={onIsPlainTextChange && toggleIsPlainText}
        />
      ) : null}
      <MarkdownContainer>
        <StyledEditorContent
          spellCheck={enableSpellCheck}
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
    border-radius: 5px;
    z-index: 100;
    margin: 2px;
    padding: 4px;
  }

  ${(p) =>
    p.isTitle
      ? css`
          font-weight: 200;

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
