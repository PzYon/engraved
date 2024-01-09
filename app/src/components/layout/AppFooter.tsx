import { styled, SxProps, Typography } from "@mui/material";
import React from "react";
import { AppContent } from "./AppContent";
import { useApiSystemInfoQuery } from "../../serverApi/reactQuery/queries/useApiSystemInfoQuery";
import { ISystemInfo } from "../../serverApi/ISystemInfo";
import { FormatDate } from "../common/FormatDate";
import { envSettings } from "../../env/envSettings";
import { GitHub } from "@mui/icons-material";
import { ActionIconButton } from "../common/actions/ActionIconButton";

export const AppFooter: React.FC = () => {
  const apiSystemInfo = useApiSystemInfoQuery();

  if (!apiSystemInfo) {
    return null;
  }

  return (
    <Host>
      <AppContent scope="header">
        <Container>
          <Column sx={{ textAlign: "left" }}>
            <Element>{apiSystemInfo.usersCount} users</Element>
            <Element>{apiSystemInfo.journalsCount} journals</Element>
            <Element>{apiSystemInfo.entriesCount} entries</Element>
          </Column>
          <Column sx={{ textAlign: "right" }}>
            <Element
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <ActionIconButton
                action={{
                  label: "View on Github",
                  href: "https://github.com/PzYon/engraved",
                  key: "view-on-github",
                  icon: <GitHub fontSize="small" />,
                  sx: { color: "white", display: "inline", width: "40px" },
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
    </Host>
  );
};

const Host = styled("div")`
  background-color: ${(p) => p.theme.palette.primary.main};
  color: ${(p) => p.theme.palette.common.white};
`;

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
    ...sx,
    "& a": { color: "white !important" },
  };

  return <Typography sx={style}>{children}</Typography>;
};

const SystemInfo: React.FC<{ label: string; systemInfo: ISystemInfo }> = ({
  label,
  systemInfo,
}) => {
  return (
    <>
      {label}{" "}
      <a
        href={
          "https://github.com/PzYon/engraved/commit/" + systemInfo.commitHash
        }
        target="_blank"
        rel="noreferrer"
      >
        v{systemInfo.version}
      </a>{" "}
      (released <FormatDate value={systemInfo.mergeDateTime} />)
    </>
  );
};
