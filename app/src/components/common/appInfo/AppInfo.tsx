import React, { useState } from "react";
import { ISystemInfo } from "../../../serverApi/ISystemInfo";
import { FormatDate } from "../FormatDate";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  styled,
  Typography,
} from "@mui/material";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useQueryClient } from "@tanstack/react-query";
import { useAppInfoQuery } from "../../../serverApi/reactQuery/queries/useAppInfoQuery";

export const AppInfo: React.FC = () => {
  const systemInfo = useAppInfoQuery();
  const queryClient = useQueryClient();

  const [serverOs, setServerOs] = useState<"win" | "lin">(
    ServerApi.getServerOs()
  );

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
      <ItemContainer
        sx={{
          borderTop: `1px solid`,
          borderTopColor: "primary.main",
          marginTop: 2,
          pt: 3,
        }}
      >
        <FormControl>
          <FormLabel id="server-os-label">Server OS (in Azure)</FormLabel>
          <RadioGroup
            row
            aria-labelledby="server-os-label"
            name="row-radio-buttons-group"
            value={serverOs}
            onChange={(_, value: string) => {
              const v = value as "win" | "lin";
              setServerOs(v);
              ServerApi.setServerOs(v);
            }}
          >
            <FormControlLabel value="win" control={<Radio />} label="Windows" />
            <FormControlLabel value="lin" control={<Radio />} label="Linux" />
          </RadioGroup>
        </FormControl>
      </ItemContainer>
      <ItemContainer>
        <Button
          onClick={() => {
            queryClient.clear();
          }}
        >
          Clear cache
        </Button>
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
