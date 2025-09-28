import { styled } from "@mui/material";
import { useState } from "react";

export const TextEditor: React.FC<{
  initialValue: string;
  setValue: (value: string) => void;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}> = ({ initialValue: value, setValue, autoFocus, onKeyDown }) => {
  const [initialValue] = useState(value);

  return (
    <Host>
      <EditableDiv
        autoFocus={autoFocus}
        contentEditable={true}
        onKeyDown={onKeyDown}
        dangerouslySetInnerHTML={{ __html: initialValue }}
        onInput={(e) => {
          setValue((e.target as HTMLDivElement).innerText);
        }}
      />
    </Host>
  );
};

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
