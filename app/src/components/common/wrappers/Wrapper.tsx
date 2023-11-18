import { styled } from "@mui/material";
import { paperBorderRadius } from "../../../theming/engravedTheme";

export const Wrapper = styled("div")`
  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }

  border-radius: ${paperBorderRadius};
`;
