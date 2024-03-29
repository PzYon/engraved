import React from "react";
import { Chip, styled } from "@mui/material";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";

export const ScrapToc: React.FC<{ entries: IScrapEntry[] }> = ({ entries }) => {
  const deviceWidth = useDeviceWidth();

  if (!entries?.length) {
    return null;
  }

  const horizontalPadding = deviceWidth === DeviceWidth.Small ? 2 : 0;

  return (
    <Host
      sx={{
        pl: horizontalPadding,
        pr: horizontalPadding,
      }}
    >
      {entries.map((s) => (
        <a key={s.id} href={"#" + s.id}>
          <Chip
            label={s.title || "-"}
            sx={{
              backgroundColor: "common.white",
              color: "primary.main",
            }}
          />
        </a>
      ))}
    </Host>
  );
};

const Host = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing(1)};
`;
