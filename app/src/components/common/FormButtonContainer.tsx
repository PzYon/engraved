import { styled } from "@mui/material";
import { MuiTheme } from "../../theming/engravedTheme";

const FormButtonContainer = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: ${(p: MuiTheme) => p.theme.spacing(2)};

  button {
    min-width: 100px;
  }
`;

export const DialogFormButtonContainer = styled(FormButtonContainer)`
  justify-content: end;
`;

export const PageFormButtonContainer = styled(FormButtonContainer)`
  justify-content: start;
`;
