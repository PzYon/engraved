import { styled } from "@mui/material";
import { useState } from "react";

export const TextEditor: React.FC<{
  initialValue: string;
  setValue: (value: string) => void;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}> = ({ initialValue: value, setValue, autoFocus, onKeyDown }) => {
  const [initialValue] = useState(sanitizeForHtml(value));

  return (
    <Host>
      <EditableDiv
        autoFocus={autoFocus}
        contentEditable={true}
        onKeyDown={onKeyDown}
        dangerouslySetInnerHTML={{ __html: initialValue }}
        onInput={(e) => {
          const div = e.target as HTMLDivElement;
          const selection = window.getSelection();
          const range = selection && selection.getRangeAt(0).cloneRange();

          debugger;

          const html = div.innerHTML.replaceAll(/!!!/g, "🔥");
          if (html !== div.innerHTML) {
            debugger;
            div.innerHTML = html;
            // Restore caret position
            if (range) {
              selection?.removeAllRanges();
              selection?.addRange(range);
              debugger;
            }
          }

          setValue(sanitizeForStorage(div.innerText));
        }}
      />
    </Host>
  );
};

function sanitizeForHtml(value: string) {
  return value.replaceAll("\n", "<br />");
}

function sanitizeForStorage(value: string) {
  return value.replaceAll("<br /", "\n");
}

const Host = styled("div")`
  background-color: ${(p) => p.theme.palette.common.white};
  width: 100%;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

const EditableDiv = styled("div")`
  width: 100%;
  border-radius: 3px;
  padding: 3px;

  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }
`;
