import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IEntry } from "../../../serverApi/IEntry";
import { AttributeValues } from "../AttributeValues";
import { styled, Typography } from "@mui/material";
import { Entry } from "./Entry";
import { ActionFactory } from "../actions/ActionFactory";
import { getUiSettings } from "../../../util/journalUtils";
import { formatDateOnly } from "../../../util/utils";

export const EntryWithValue: React.FC<{
  value: React.ReactNode;
  journal: IJournal;
  entry: IEntry;
  hasFocus?: boolean;
}> = ({ journal, entry, value, hasFocus }) => {
  return (
    <Entry
      journal={journal}
      entry={entry}
      actions={[
        ActionFactory.editEntry(entry, hasFocus),
        ActionFactory.deleteEntry(entry, hasFocus),
      ]}
      hasFocus={hasFocus ?? false}
      propsRenderStyle={"all"}
    >
      <Container>
        <Typography
          className="value-container"
          component={"span"}
          sx={{ fontWeight: 200 }}
        >
          {formatDateOnly(new Date(entry.dateTime))}
          {": "}
          {getValue()}
        </Typography>

        {entry.notes ? (
          <Typography
            className="value-container"
            component={"span"}
            sx={{ fontWeight: 200 }}
          >
            {entry.notes}
          </Typography>
        ) : null}

        {journal.attributes && entry.journalAttributeValues && (
          <AttributeValues
            className="value-container"
            attributes={journal.attributes}
            attributeValues={entry.journalAttributeValues}
          />
        )}
      </Container>
    </Entry>
  );

  function getValue() {
    const unit = getUiSettings(journal)?.yAxisUnit;
    if (unit) {
      return (
        <>
          {value} {unit}
        </>
      );
    }

    return value;
  }
};

const Container = styled("div")`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .value-container {
    &:not(:last-of-type)::after {
      content: "\\00B7";
      margin: 0 0.6rem;
    }
  }
`;
