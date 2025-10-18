import { styled } from "@mui/material";
import { useMemo, useState } from "react";
import { getMarkdownInstance } from "../details/scraps/markdown/getMarkdownInstance";

export const TextEditor: React.FC<{
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
  initialValue: value,
  setValue,
  autoFocus,
  onKeyUp,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder,
  disabled,
  forwardRef,
  css,
}) => {
  const initialInnerHtml = useMemo(
    () => ({ __html: sanitizeForHtml(value) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [isEmpty, setIsEmpty] = useState(!initialInnerHtml);

  return (
    <Host className="ngrvd-text-editor">
      {placeholder && isEmpty ? (
        <PlaceholderContainer>{placeholder}</PlaceholderContainer>
      ) : null}
      <EditableDiv
        contentEditable={!disabled}
        ref={forwardRef}
        style={css}
        autoFocus={autoFocus}
        dangerouslySetInnerHTML={initialInnerHtml}
        onInput={(e) => {
          const div = e.target as HTMLDivElement;

          // save caret offset (characters from start of div)
          const selection = window.getSelection();
          let caretOffset = 0;
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preRange = range.cloneRange();
            preRange.selectNodeContents(div);
            preRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preRange.toString().length;
          }

          // update HTML
          div.innerHTML = getMarkdownInstance().render(div.innerHTML);

          // restore caret based on character offset
          const restoreCaretByOffset = (container: Node, offset: number) => {
            const walker = document.createTreeWalker(
              container,
              NodeFilter.SHOW_TEXT,
              null,
            );
            let node: Node | null = null;
            let accumulated = 0;
            while ((node = walker.nextNode())) {
              const len = node.textContent?.length ?? 0;
              if (accumulated + len >= offset) {
                const sel = window.getSelection();
                sel?.removeAllRanges();
                const range = document.createRange();
                const localOffset = Math.max(0, offset - accumulated);
                range.setStart(node, localOffset);
                range.collapse(true);
                sel?.addRange(range);
                return;
              }
              accumulated += len;
            }
            // fallback: put caret at end
            const sel = window.getSelection();
            sel?.removeAllRanges();
            const range = document.createRange();
            range.selectNodeContents(container);
            range.collapse(false);
            sel?.addRange(range);
          };

          restoreCaretByOffset(div, caretOffset);

          setIsEmpty(!div.innerText?.trim());
          setValue(sanitizeForStorage(div.innerText));
        }}
        onKeyUp={(e) => {
          onKeyUp?.(e);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        role="textbox"
        aria-label={placeholder}
        data-testid={"placeholder-" + placeholder}
      />
    </Host>
  );
};

function sanitizeForHtml(value: string) {
  return value?.replaceAll("\n", "<br />");
}

function sanitizeForStorage(value: string) {
  return value?.replaceAll("<br /", "\n");
}

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
`;

const EditableDiv = styled("div")`
  width: 100%;
  border-radius: 3px;
  padding: 3px;

  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }
`;
