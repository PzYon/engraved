import { styled } from "@mui/material";

export const FiltersRow = styled("div")`
  display: flex;
  justify-items: center;
  max-width: 100%;
  gap: ${(p) => p.theme.spacing(2)} !important;

  & > * {
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
  }
`;

export const FiltersColumn = styled(FiltersRow)`
  flex-direction: column;

  & > * {
    margin-right: 0 !important;
  }
`;
