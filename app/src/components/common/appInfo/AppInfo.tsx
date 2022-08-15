import React, { useEffect, useState } from "react";
import { ServerApi } from "../../../serverApi/ServerApi";
import { ISystemInfo } from "../../../serverApi/ISystemInfo";
import { FormatDate } from "../FormatDate";
import { styled, Typography } from "@mui/material";

export const AppInfo: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<ISystemInfo>();

  useEffect(() => {
    ServerApi.getSystemInfo().then((si: ISystemInfo) => {
      setSystemInfo(si);
    });
  }, []);

  if (!systemInfo) {
    return null;
  }

  return (
    <Container>
      <SystemInfo systemInfo={systemInfo} label={"API"} />
      <SystemInfo
        systemInfo={{
          commitHash:
            process.env.REACT_APP_COMMIT_HASH ??
            "78c0eab8a6ac0ab631cd93a3e41dd8c5ff5e116f",
          version: process.env.REACT_APP_VERSION ?? "42",
          mergeDateTime: process.env.REACT_MERGE_DATE_TIME,
        }}
        label={"App"}
      />
    </Container>
  );
};

const SystemInfo: React.FC<{ label: string; systemInfo: ISystemInfo }> = ({
  label,
  systemInfo,
}) => {
  return (
    <Typography fontSize="small">
      {label} v{systemInfo.version} (released{" "}
      <FormatDate value={systemInfo.mergeDateTime} />)
      <br />
      <a
        href={"https://github.com/PzYon/metrix/commit/" + systemInfo.commitHash}
        target="_blank"
        rel="noreferrer"
      >
        View in github
      </a>
    </Typography>
  );
};

const Container = styled("div")`
  padding: 15px;
`;
