import { styled, SxProps, TextField } from "@mui/material";
import React, { useMemo } from "react";
import { parseDate } from "./parseDate";

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
          const parsed = parseDate(value);

          if (parsed.date) {
            onSelect(parsed.date);
          }
        }}
      />
    </Host>
  );
};

const Host = styled("div")``;
