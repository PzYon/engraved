import React from "react";
import { styled, TextField, TextFieldProps } from "@mui/material";

export const AutogrowTextField: React.FC<
  TextFieldProps & {
    isContent?: boolean;
    forwardInputRef?: React.ForwardedRef<HTMLInputElement>;
  }
> = (props) => {
  const TF = props.isContent ? StyledTextField : StyledTitleTextField;

  // forget isContent and forwardInputRef
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isContent: _, forwardInputRef: __, ...realProps } = props;

  return (
    <TF
      inputRef={props.forwardInputRef}
      variant="standard"
      multiline={true}
      autoComplete={Math.random().toString()}
      onKeyDown={(e: { key: string; preventDefault: () => void }) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      {...realProps}
    />
  );
};

const StyledTextField = styled(TextField)`
  width: 100%;

  .MuiInputBase-root {
    padding: 0;
  }

  .MuiInput-root:before {
    border: 0 !important;
    outline: 0 !important;
  }

  fieldset {
    border-width: 0;
  }

  textarea {
    &,
    &.Mui-disabled {
      -webkit-text-fill-color: ${(p) =>
        p.theme.palette.text.primary} !important;
      color: ${(p) => p.theme.palette.text.primary} !important;
    }
  }
`;

const StyledTitleTextField = styled(StyledTextField)`
  .MuiInputBase-root {
    padding: 8px 0;
  }

  textarea {
    &,
    &.Mui-disabled {
      -webkit-text-fill-color: ${(p) =>
        p.theme.palette.primary.main} !important;
      color: ${(p) => p.theme.palette.primary.main} !important;
      font-size: 2rem;
      font-weight: 200;
    }
  }
`;
