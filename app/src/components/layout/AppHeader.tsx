import React from "react";
import { Link } from "react-router-dom";
import { Box, styled, Typography, useTheme } from "@mui/material";
import { useAppContext } from "../../AppContext";
import { ActionGroup } from "../common/actions/ActionGroup";
import { AppInfoLauncher } from "../common/appInfo/AppInfoLauncher";
import { User } from "../common/User";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { usePageContext } from "./pages/PageContext";
import { Typing } from "../common/Typing";
import { PulsatingDot } from "../common/PulsatingDot";
import { RefreshData } from "../common/RefreshData";
import { AppContent } from "./AppContent";
import { ActionIconButton } from "../common/actions/ActionIconButton";
import { SearchOutlined } from "@mui/icons-material";
import { useDialogContext } from "./dialogs/DialogContext";
import { PageFilters } from "../common/search/PageFilters";
import { VersionChecker } from "../../VersionChecker";
import { Titles } from "./Titles";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";
import { ActionLink } from "../common/actions/ActionLink";
import { PageTabs } from "./tabs/PageTabs";

export const AppHeader: React.FC = () => {
  const { user } = useAppContext();
  const {
    title,
    subTitle,
    pageActions: pageActionsFromContext,
    enableFilters,
    showFilters,
    setShowFilters,
    tabs,
  } = usePageContext();
  const { palette } = useTheme();
  const { renderDialog } = useDialogContext();

  const deviceWidth = useDeviceWidth();
  const isSmall = deviceWidth === DeviceWidth.Small;

  const pageActions: IAction[] = enableFilters
    ? [
        ActionFactory.toggleFilters(showFilters, setShowFilters, true),
        ...pageActionsFromContext,
      ]
    : pageActionsFromContext;

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
            <div style={{ flexGrow: 1 }}>
              <ActionLink action={ActionFactory.goHome()}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: "35px",
                    marginTop: "-10px",
                    display: "inline-block",
                  }}
                >
                  <Typing
                    textToType="engraved"
                    renderOnComplete={<PulsatingDot />}
                  />
                </Typography>
              </ActionLink>
            </div>
            <AppInfoLauncher />
            <RefreshData />
            <ActionIconButton
              action={{
                key: "search",
                icon: <SearchOutlined fontSize="small" />,
                label: "Search",
                href: "/search",
                sx: { color: "common.white" },
              }}
            />
            <ActionIconButton
              action={ActionFactory.addQuickScrap(user, renderDialog)}
            />
            <VersionChecker />
            <Link to="/entries">
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
          <Titles title={title} subTitle={subTitle} />

          <ActionsAndTabContainer isSmall={isSmall}>
            <ActionGroup
              actions={pageActions}
              testId="page-actions"
              enableFloatingActions={true}
            />
            <PageTabs tabs={tabs} />
          </ActionsAndTabContainer>
        </ContentWrapper>

        {showFilters ? <PageFilters /> : null}
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

const ActionsAndTabContainer = styled("div")<{ isSmall: boolean }>`
  width: 100%;
  display: flex;
  justify-content: end;
  margin-top: ${(p) => (p.isSmall ? p.theme.spacing(2) : 0)};
`;
