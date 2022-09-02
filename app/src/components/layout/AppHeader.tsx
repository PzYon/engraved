import React from "react";
import { Link } from "react-router-dom";
import { Box, styled, Typography } from "@mui/material";
import { useAppContext } from "../../AppContext";
import { HeaderActions } from "./HeaderActions";
import { AppInfoLauncher } from "../common/appInfo/AppInfoLauncher";
import { User } from "../common/User";

export const AppHeader: React.FC = () => {
  const { pageTitle, titleActions, user } = useAppContext();

  return (
    <Host>
      <Box
        sx={{
          backgroundColor: "primary.main",
          mb: 2,
        }}
      >
        <ContentWrapper>
          <Link to="/" style={{ flexGrow: 1 }}>
            <Typography variant="h1" sx={{ fontFamily: "Chewy" }}>
              metrix
            </Typography>
          </Link>
          <AppInfoLauncher />
          <User user={user} />
        </ContentWrapper>
      </Box>
      <ContentWrapper>
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>
        <HeaderActions actions={titleActions} enableFloatingActions={true} />
      </ContentWrapper>
    </Host>
  );
};

const Host = styled("div")`
  margin-bottom: ${(p) => p.theme.spacing(2)};
`;

const ContentWrapper = styled("div")`
  max-width: 1200px;
  margin: auto;
  padding: 0 ${(p) => p.theme.spacing(2)};
  display: flex;
  align-items: center;

  a {
    color: ${(p) => p.theme.palette.common.white} !important;
  }
`;
