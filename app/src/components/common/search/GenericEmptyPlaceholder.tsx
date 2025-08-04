import React from "react";
import { SvgIconComponent } from "@mui/icons-material";
import { styled, Typography } from "@mui/material";
import { PageSection } from "../../layout/pages/PageSection";

export const GenericEmptyPlaceholder: React.FC<{
  icon: SvgIconComponent;
  message: string;
}> = ({ icon: IconElement, message }) => {
  return (
    <PageSection>
      <Host data-testid="empty-placeholder">
        <IconElement sx={{ color: "primary.main" }} fontSize="large" />
        <Typography sx={{ color: "primary.main", mt: 2 }} fontSize="large">
          {message}
        </Typography>
      </Host>
    </PageSection>
  );
};

const Host = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.4;
`;
