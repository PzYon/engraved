import { styled } from "@mui/material";
import { useMemo, useState } from "react";

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
  replaceText?: (value: string) => string;
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
  replaceText,
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
          const html = replaceText
            ? replaceText?.(div.innerHTML)
            : div.innerHTML;

          if (html !== div.innerHTML) {
            div.innerHTML = html;
          }

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
