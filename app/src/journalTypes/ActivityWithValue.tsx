import React from "react";
import { IJournal } from "../serverApi/IJournal";
import { IEntry } from "../serverApi/IEntry";
import { AttributeValues } from "../components/common/AttributeValues";
import { styled, Typography } from "@mui/material";
import { Activity } from "./Activity";
import { ActionGroup } from "../components/common/actions/ActionGroup";
import { ActionFactory } from "../components/common/actions/ActionFactory";

export const ActivityWithValue: React.FC<{
  value: React.ReactNode;
  journal: IJournal;
  entry: IEntry;
}> = ({ journal, entry, value }) => {
  return (
    <Activity journal={journal} entry={entry}>
      <Typography component={"span"}>{value}</Typography>
      <Typography component={"span"} sx={{ fontWeight: "lighter" }}>
        {entry.notes ? ` - ${entry.notes}` : ""}
      </Typography>
      <AttributeValues
        attributes={journal.attributes}
        attributeValues={entry.journalAttributeValues}
      />
      <FooterContainer>
        <ActionGroup
          actions={[
            ActionFactory.editEntry(entry),
            ActionFactory.deleteEntry(entry),
          ]}
        />
      </FooterContainer>
    </Activity>
  );
};

const FooterContainer = styled("div")`
  display: flex;
  justify-content: end;
  align-items: center;
`;
