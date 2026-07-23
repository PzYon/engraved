import React from "react";
import { styled, TextField, TextFieldProps } from "@mui/material";

export const AutogrowTextField: React.FC<
  TextFieldProps & {
    forwardInputRef?: React.ForwardedRef<HTMLInputElement>;
  }
> = (props) => {
  // forget forwardInputRef
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { forwardInputRef: __, ...realProps } = props;

  return (
    <StyledTextField
      inputRef={props.forwardInputRef}
      variant="standard"
      multiline={true}
      slotProps={{
        input: {
          disableUnderline: true,
        },
      }}
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
