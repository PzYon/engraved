import { styled, SxProps, TextField } from "@mui/material";
import React, { useMemo } from "react";
import * as chrono from "chrono-node";

export const FunkyDate: React.FC<{
  onSelect: (date: Date) => void;
  sx: SxProps;
}> = ({ onSelect, sx }) => {
  const id = useMemo(() => Math.random().toString(), []);

  return (
    <Host sx={sx}>
      <TextField
        placeholder={"When is the next schedule?"}
        autoFocus={true}
        id={id}
        onChange={(e) => {
          const value = e.target.value;
          const date = chrono.parseDate(value);

          if (date) {
            onSelect(date);
          }
        }}
      />
    </Host>
  );
};

const Host = styled("div")``;
