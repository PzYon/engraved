import React from "react";
import { Link } from "react-router-dom";
import { Box, styled, Typography, useTheme } from "@mui/material";
import { useAppContext } from "../../AppContext";
import { Actions, SeparatorElement } from "../common/Actions";
import { AppInfoLauncher } from "../common/appInfo/AppInfoLauncher";
import { User } from "../common/User";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { usePageContext } from "./pages/PageContext";
import { Typing } from "../common/Typing";
import { PulsatingDot } from "../common/PulsatingDot";
import { RefreshData } from "../common/RefreshData";
import { AppContent } from "./AppContent";
import { IconButtonWrapper } from "../common/IconButtonWrapper";
import { SearchOutlined } from "@mui/icons-material";
import { SearchBox } from "../common/search/SearchBox";

export const AppHeader: React.FC = () => {
  const { user } = useAppContext();
  const { pageTitle, pageActions, showSearchBox } = usePageContext();
  const { palette } = useTheme();

  const deviceWidth = useDeviceWidth();
  const isSmall = deviceWidth === DeviceWidth.Small;

  return (
    <Host>
      <Box
        sx={{
          background: `linear-gradient(146deg, ${palette.text.primary} 0%, ${palette.primary.main} 100%)`,
          mb: 2,
        }}
      >
        <AppContent scope="header">
          <ContentWrapper sx={{ display: "flex", height: "64px" }}>
            <Link to="/" style={{ flexGrow: 1 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: "35px",
                  marginTop: "-10px",
                }}
              >
                <Typing
                  textToType="engraved"
                  renderOnComplete={<PulsatingDot />}
                />
              </Typography>
            </Link>
            <AppInfoLauncher />
            <RefreshData />
            <IconButtonWrapper
              action={{
                key: "search",
                icon: <SearchOutlined fontSize="small" />,
                label: "Search",
                href: "/search",
                sx: { color: "common.white", mr: 1 },
              }}
            />
            <Link to="/users/me">
              <User user={user} />
            </Link>
          </ContentWrapper>
        </AppContent>
      </Box>
      <AppContent>
        <ContentWrapper
          style={
            isSmall ? { flexDirection: "column", alignItems: "start" } : null
          }
        >
          <Typography variant="h2" sx={{ flexGrow: 1, color: "primary.main" }}>
            {pageTitle ?? <>&nbsp;</>}
          </Typography>

          <SearchAndActionsContainer
            isSmall={isSmall}
            key={window.location.pathname}
          >
            <Actions actions={pageActions} enableFloatingActions={true} />

            {showSearchBox && pageActions.length ? (
              <SeparatorElement style={{ marginRight: "24px" }} />
            ) : null}

            <SearchBox />
          </SearchAndActionsContainer>
        </ContentWrapper>
      </AppContent>
    </Host>
  );
};

const Host = styled("div")`
  margin-bottom: ${(p) => p.theme.spacing(2)};
`;

const ContentWrapper = styled("div")`
  display: flex;
  align-items: center;

  a {
    color: ${(p) => p.theme.palette.common.white} !important;
  }
`;

const SearchAndActionsContainer = styled("div")<{ isSmall: boolean }>`
  margin-top: ${(p) => (p.isSmall ? p.theme.spacing(2) : 0)};
  width: ${(p) => (p.isSmall ? "100%" : "auto")};
  display: flex;
  align-items: center;
`;
