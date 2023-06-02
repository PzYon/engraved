import { styled } from "@mui/material";

export const FiltersRow = styled("div")`
  display: flex;
  justify-items: center;
  margin-bottom: ${(p) => p.theme.spacing(2)};

  &:last-of-type {
    margin-bottom: 0 !important;
  }

  & > * {
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    margin-right: ${(p) => p.theme.spacing(2)} !important;

    &:last-of-type {
      margin-right: 0 !important;
    }
  }
`;

export const FiltersColumn = styled(FiltersRow)`
  flex-direction: column;

  & > * {
    margin-right: 0 !important;
  }
`;
