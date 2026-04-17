import { styled } from "@mui/material";

export const FormElementContainer = styled("div")<{ noBorderTop?: boolean }>`
  margin-top: ${(p) => (p.noBorderTop ? 0 : p.theme.spacing(2))};
  width: 100%;
`;
