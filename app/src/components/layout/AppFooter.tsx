import { styled, SxProps, Typography } from "@mui/material";
import { AppContent } from "./AppContent";
import { useApiSystemInfoQuery } from "../../serverApi/reactQuery/queries/useApiSystemInfoQuery";
import { ISystemInfo } from "../../serverApi/ISystemInfo";
import { envSettings } from "../../env/envSettings";
import GitHub from "@mui/icons-material/GitHub";
import Help from "@mui/icons-material/Help";
import { ActionIconButton } from "../common/actions/ActionIconButton";
import React, { useEffect, useState } from "react";
import { FadeInContainer } from "../common/FadeInContainer";
import { FormatDate } from "../common/FormatDate";
import { useDialogContext } from "./dialogs/DialogContext";
import { RegisteredActionsList } from "../common/actions/RegisteredActionsList";
import { ActionLink } from "../common/actions/ActionLink";

export const AppFooter: React.FC = () => {
  const apiSystemInfo = useApiSystemInfoQuery();
  const { renderDialog } = useDialogContext();

  const [doRender, setDoRender] = useState(false);

  useEffect(() => {
    let timer: number;

    if (apiSystemInfo) {
      timer = window.setTimeout(() => {
        setDoRender(true);
      }, 1000);
    }

    return () => window.clearTimeout(timer);
  }, [apiSystemInfo]);

  if (!doRender) {
    return null;
  }

  return (
    <FadeInContainer
      sx={{ backgroundColor: "primary.main", color: "common.white" }}
    >
      <AppContent scope="header">
        <Container>
          <Column sx={{ textAlign: "left" }}>
            <Element>{apiSystemInfo.usersCount} users</Element>
            <Element>{apiSystemInfo.journalsCount} journals</Element>
            <Element>{apiSystemInfo.entriesCount} entries</Element>
            <Element>
              <ActionIconButton
                action={{
                  key: "show-help",
                  icon: <Help fontSize="small" />,
                  label: "Show help",
                  sx: { color: "white", display: "inline", padding: 0 },
                  onClick: () => {
                    renderDialog({
                      title: "Help",
                      render: () => <RegisteredActionsList />,
                    });
                  },
                }}
              />
            </Element>
          </Column>
          <Column sx={{ textAlign: "right" }}>
            <Element
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <ActionLink
                action={{
                  label: "View on Github",
                  href: "https://github.com/PzYon/engraved",
                  key: "view-on-github",
                  icon: <GitHub fontSize="small" />,
                  sx: { color: "white", display: "inline", padding: 0 },
                }}
              />
            </Element>
            <Element>
              <SystemInfo
                systemInfo={{
                  commitHash: envSettings.commitHash,
                  version: envSettings.version,
                  mergeDateTime: envSettings.mergeDateTime,
                }}
                label={"App"}
              />
            </Element>
            <Element>
              <SystemInfo systemInfo={apiSystemInfo} label={"API"} />
            </Element>
          </Column>
        </Container>
      </AppContent>
    </FadeInContainer>
  );
};

const Container = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: ${(p) => p.theme.spacing(2)} 0;
`;

const Column = styled("div")`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Element: React.FC<{ children: React.ReactNode; sx?: SxProps }> = ({
  children,
  sx = {},
}) => {
  const style: SxProps = {
    minHeight: 30,
    "& a": { color: "white !important" },
    ...sx,
  };

  return <Typography sx={style}>{children}</Typography>;
};

const SystemInfo: React.FC<{ label: string; systemInfo: ISystemInfo }> = ({
  label,
  systemInfo,
}) => {
  return (
    <a
      href={"https://github.com/PzYon/engraved/commit/" + systemInfo.commitHash}
      target="_blank"
      rel="noreferrer"
    >
      {label} v{systemInfo.version} (released{" "}
      <FormatDate value={systemInfo.mergeDateTime} />)
    </a>
  );
};
