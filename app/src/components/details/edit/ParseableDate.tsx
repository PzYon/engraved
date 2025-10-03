import {
  css,
  styled,
  SxProps,
  TextFieldProps,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { IParsedDate, parseDate } from "./parseDate";
import { FormatDate } from "../../common/FormatDate";
import { DateFormat } from "../../common/dateTypes";
import { TextEditor } from "../../common/TextEditor";

export const ParseableDate: React.FC<{
  onChange: (parsedDate: IParsedDate) => void;
  onSelect: (parsedDate: IParsedDate) => void;
  sx?: SxProps;
  parseDateOnly?: boolean;
  isTitle?: boolean;
  textFieldProps?: TextFieldProps;
  noOutput?: boolean;
}> = ({
  onChange,
  onSelect,
  sx,
  parseDateOnly,
  textFieldProps,
  isTitle,
  noOutput,
}) => {
  const [parsed, setParsed] = useState<IParsedDate>({ input: undefined });
  const [parseError, setParseError] = useState("");

  // const TextFieldComponent = isTitle ? AutogrowTextField : TextField;

  return (
    <Host sx={sx} isTitle={isTitle}>
      <TextEditor
        initialValue={textFieldProps.value as string}
        autoFocus={true}
        //id={id}
        //sx={{ width: "100%" }}
        //placeholder="Enter date"
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key !== "Enter") {
            return;
          }

          /* eslint-disable @typescript-eslint/no-explicit-any */
          const parsed = parseDate((e.target as any).value);
          if (!parsed.date) {
            return;
          }

          if (parseDateOnly) {
            delete parsed.text;
          }

          onSelect(parsed);
        }}
        setValue={(value) => {
          try {
            // todo: consider passing replacements to TextEditor instead

            const currentValue = value
              .replace(/\.{3}/g, "👍")
              .replace(/!{3}/g, "⚠️")
              .replace(/\?{3}/, "❓");

            const parsed = parseDate(currentValue);
            setParsed(parsed);
            setParseError("");
            onChange(parsed);
          } catch (e) {
            setParseError((e as Error).message);
          }
        }}
        //{...textFieldProps}
      />

      {(parseError || parsed?.date) && !noOutput ? (
        <OutputContainer>
          {parseError ? (
            <Typography sx={{ color: "error.main", pb: 1 }}>
              {parseError}
            </Typography>
          ) : null}
          <Typography>
            {!parseDateOnly && parsed.text ? (
              <TextContainer>{parsed.text}</TextContainer>
            ) : null}
            {parsed.date ? (
              <DateContainer>
                <FormatDate value={parsed.date} dateFormat={DateFormat.full} />
                {" ("}
                <FormatDate
                  value={parsed.date}
                  dateFormat={DateFormat.relativeToNow}
                />
                {")"}
                {parsed.recurrence ? (
                  <> - repeats {parsed.recurrence.dateString}</>
                ) : null}
              </DateContainer>
            ) : null}
          </Typography>
        </OutputContainer>
      ) : null}
    </Host>
  );
};

const Host = styled("div")<{ isTitle: boolean }>`
  ${(p) =>
    p.isTitle
      ? css`
          .ngrvd-text-editor {
            font-size: 2rem;
            color: ${p.theme.palette.primary.main};
            font-weight: lighter;
          }
        `
      : null}
`;

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
