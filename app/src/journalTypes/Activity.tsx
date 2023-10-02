import React from "react";
import { IEntry } from "../serverApi/IEntry";
import { IJournal } from "../serverApi/IJournal";
import { FormatDate } from "../components/common/FormatDate";
import { styled } from "@mui/material";
import { Properties } from "../components/common/Properties";
import { JournalTypeIcon } from "../components/common/JournalTypeIcon";
import { IconStyle } from "../components/common/Icon";
import { Link } from "react-router-dom";

export const Activity: React.FC<{
  journal: IJournal;
  entry: IEntry;
  children: React.ReactNode;
}> = ({ journal, entry, children }) => {
  return (
    <>
      <Properties
        properties={[
          {
            key: "journal-type",
            node: (
              <JournalTypeIcon type={journal.type} style={IconStyle.Activity} />
            ),
            label: "",
          },
          {
            key: "name",
            node: <Link to={`/journals/${journal.id}`}>{journal.name}</Link>,
            label: "Metric",
          },
          {
            key: "date",
            node: <FormatDate value={entry.editedOn || entry.dateTime} />,
            label: "",
          },
        ]}
      />
      <ValueContainer>{children}</ValueContainer>
    </>
  );
};

const ValueContainer = styled("div")`
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
  padding-top: ${(p) => p.theme.spacing(2)};
  margin-top: ${(p) => p.theme.spacing(2)};
`;
