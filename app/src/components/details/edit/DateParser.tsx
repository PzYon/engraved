import { styled, SxProps, TextField } from "@mui/material";
import React, { useMemo } from "react";
import { IParsedDate, parseDate } from "./parseDate";

export const DateParser: React.FC<{
  onChange: (parsedDate: IParsedDate) => void;
  onSelect: (parsedDate: IParsedDate) => void;
  sx: SxProps;
}> = ({ onChange, onSelect, sx }) => {
  const id = useMemo(() => Math.random().toString(), []);

  return (
    <Host sx={sx}>
      <TextField
        placeholder={"When is the next schedule?"}
        autoFocus={true}
        id={id}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          console.log(e.key);
          if (e.key === "Enter") {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const parsed = parseDate((e.target as any).value);
            if (parsed.date) {
              onSelect(parsed);
            }
          }
        }}
        onChange={(e) => {
          const parsed = parseDate(e.target.value);
          onChange(parsed);
        }}
      />
    </Host>
  );
};

const Host = styled("div")``;
