import React from "react";
import { ServerApi } from "../../../serverApi/ServerApi";
import { ISystemInfo } from "../../../serverApi/ISystemInfo";
import { FormatDate } from "../FormatDate";
import { styled, Typography } from "@mui/material";
import { useQuery } from "react-query";

export const AppInfo: React.FC = () => {
  const { data: systemInfo } = useQuery([], () => ServerApi.getSystemInfo());

  if (!systemInfo) {
    return null;
  }

  return (
    <>
      <ItemContainer>
        <SystemInfo systemInfo={systemInfo} label={"API"} />
      </ItemContainer>
      <ItemContainer>
        <SystemInfo
          systemInfo={{
            commitHash:
              process.env.REACT_APP_COMMIT_HASH ??
              "78c0eab8a6ac0ab631cd93a3e41dd8c5ff5e116f",
            version: process.env.REACT_APP_VERSION ?? "42",
            mergeDateTime:
              process.env.REACT_APP_MERGE_DATE_TIME ?? "2017-04-20T07:56:16Z",
          }}
          label={"App"}
        />
      </ItemContainer>
      <ItemContainer>
        <Typography>
          <a
            href="https://github.com/PzYon/engraved/issues"
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>{" "}
          issues in github.
        </Typography>
      </ItemContainer>
    </>
  );
};

const SystemInfo: React.FC<{ label: string; systemInfo: ISystemInfo }> = ({
  label,
  systemInfo,
}) => {
  return (
    <Typography>
      {label} v{systemInfo.version} (released{" "}
      <FormatDate value={systemInfo.mergeDateTime} />)
      <br />
      <a
        href={
          "https://github.com/PzYon/engraved/commit/" + systemInfo.commitHash
        }
        target="_blank"
        rel="noreferrer"
      >
        View
      </a>{" "}
      commit in github.
    </Typography>
  );
};

const ItemContainer = styled("div")`
  padding: ${(p) => p.theme.spacing(1)} 0;
`;
