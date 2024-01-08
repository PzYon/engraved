import { styled, Typography } from "@mui/material";
import React from "react";
import { AppContent } from "./AppContent";
import { useApiSystemInfoQuery } from "../../serverApi/reactQuery/queries/useApiSystemInfoQuery";
import { ISystemInfo } from "../../serverApi/ISystemInfo";
import { FormatDate } from "../common/FormatDate";
import { envSettings } from "../../env/envSettings";

export const AppFooter: React.FC = () => {
  const apiSystemInfo = useApiSystemInfoQuery();

  if (!apiSystemInfo) {
    return null;
  }

  return (
    <Host>
      <AppContent scope="header">
        <Element>{apiSystemInfo.journalsCount} journals</Element>
        <Element>{apiSystemInfo.entriesCount} entries</Element>
        <Element>{apiSystemInfo.usersCount} users</Element>
        <SystemInfo systemInfo={apiSystemInfo} label={"API"} />
        <SystemInfo
          systemInfo={{
            commitHash: envSettings.commitHash,
            version: envSettings.version,
            mergeDateTime: envSettings.mergeDateTime,
          }}
          label={"App"}
        />
      </AppContent>
    </Host>
  );
};

const Host = styled("div")`
  background-color: ${(p) => p.theme.palette.primary.main};
  color: ${(p) => p.theme.palette.common.white};
`;

const Element = styled("div")``;

const SystemInfo: React.FC<{ label: string; systemInfo: ISystemInfo }> = ({
  label,
  systemInfo,
}) => {
  return (
    <Typography>
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
    </Typography>
  );
};
