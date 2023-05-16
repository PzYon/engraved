import { PsychologyAltOutlined } from "@mui/icons-material";
import { styled, Typography } from "@mui/material";
import React from "react";

export const NoResultsFound: React.FC = () => {
  return (
    <Host>
      <PsychologyAltOutlined sx={{ color: "primary.main" }} fontSize="large" />
      <Typography sx={{ color: "primary.main", mt: 2 }} fontSize="large">
        Nothing found. Try again.
      </Typography>
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30vh;
  opacity: 0.5;
`;
