import React from "react";
import { SvgIconComponent } from "@mui/icons-material";
import { styled, Typography } from "@mui/material";

export const GenericEmptyPlaceholder: React.FC<{
  icon: SvgIconComponent;
  message: string;
}> = ({ icon: IconElement, message }) => {
  return (
    <Host>
      <IconElement sx={{ color: "primary.main" }} fontSize="large" />
      <Typography sx={{ color: "primary.main", mt: 2 }} fontSize="large">
        {message}
      </Typography>
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30vh;
  opacity: 0.4;
`;
