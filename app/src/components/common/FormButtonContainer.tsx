import { styled } from "@mui/material";

const FormButtonContainer = styled("div")`
  display: flex;
  padding-top: ${(p) => p.theme.spacing(2)};

  button {
    min-width: 100px;

    &:not(:last-of-type) {
      margin-right: ${(p) => p.theme.spacing(2)};
    }
  }
`;

export const DialogFormButtonContainer = styled(FormButtonContainer)`
  justify-content: end;
`;

export const PageFormButtonContainer = styled(FormButtonContainer)`
  justify-content: start;
`;
