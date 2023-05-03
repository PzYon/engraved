import React from "react";
import { TextFieldProps } from "@mui/material/TextField/TextField";
import { styled, TextField } from "@mui/material";

export const AutogrowTextField: React.FC<
  TextFieldProps & { fieldType: "title" | "content" }
> = (props) => {
  const TF =
    props.fieldType === "title" ? StyledTitleTextField : StyledTextField;

  // forget fieldType
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fieldType: _, ...realProps } = props;

  return (
    <TF
      variant="standard"
      multiline={true}
      autoComplete={"new-password"}
      onKeyDown={(e) => {
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
      font-size: larger;
    }
  }
`;
