import { styled } from "@mui/material";

export const Wrapper = styled("div")`
  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }

  border-radius: 3px;
`;
