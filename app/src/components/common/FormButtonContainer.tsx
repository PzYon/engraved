import { styled } from "@mui/material";

export const FormButtonContainer = styled("div")`
  display: flex;
  justify-content: end;
  padding-top: ${(p) => p.theme.spacing(2)};

  button {
    min-width: 100px;

    &:not(:last-of-type) {
      margin-right: ${(p) => p.theme.spacing(2)};
    }
  }
`;
