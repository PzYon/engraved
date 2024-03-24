import { styled, SxProps, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { IParsedDate, parseDate } from "./parseDate";
import { FormatDate } from "../../common/FormatDate";
import { DateFormat } from "../../common/dateTypes";

export const DateParser: React.FC<{
  onChange: (parsedDate: IParsedDate) => void;
  onSelect: (parsedDate: IParsedDate) => void;
  sx: SxProps;
}> = ({ onChange, onSelect, sx }) => {
  const id = useMemo(() => Math.random().toString(), []);

  const [parsed, setParsed] = useState<IParsedDate>({});

  return (
    <Host sx={sx}>
      <TextField
        placeholder={"When is the next schedule?"}
        autoFocus={true}
        id={id}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          console.log(e.key);
          if (e.key !== "Enter") {
            return;
          }

          /* eslint-disable @typescript-eslint/no-explicit-any */
          const parsed = parseDate((e.target as any).value);
          if (!parsed.date) {
            return;
          }

          onSelect(parsed);
        }}
        onChange={(e) => {
          const parsed = parseDate(e.target.value);
          setParsed(parsed);
          onChange(parsed);
        }}
      />
      <OutputContainer>
        <Typography>
          <TextContainer>{parsed.text}</TextContainer>
          {parsed.date ? (
            <DateContainer>
              <FormatDate value={parsed.date} dateFormat={DateFormat.full} />
              {" ("}
              <FormatDate
                value={parsed.date}
                dateFormat={DateFormat.relativeToNow}
              />
              {")"}
            </DateContainer>
          ) : null}
        </Typography>
      </OutputContainer>
    </Host>
  );
};

const Host = styled("div")``;

const OutputContainer = styled("div")`
  padding-top: ${(p) => p.theme.spacing(2)};
`;

const OutputElement = styled("span")`
  border-radius: 3px;
  padding: 3px;
`;

const TextContainer = styled(OutputElement)`
  padding-right: ${(p) => p.theme.spacing(1)};
`;

const DateContainer = styled(OutputElement)`
  background-color: ${(p) => p.theme.palette.primary.main};
  color: ${(p) => p.theme.palette.common.white};
`;
