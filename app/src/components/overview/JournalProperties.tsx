import React from "react";
import { IJournal } from "../../serverApi/IJournal";
import { FormatDate } from "../common/FormatDate";
import { SharedWith } from "../common/SharedWith";
import { Properties } from "../common/Properties";
import { styled } from "@mui/material";
import { Favorite } from "./Favorite";

export const JournalProperties: React.FC<{ journal: IJournal }> = ({
  journal,
}) => (
  <Host>
    <Properties
      properties={[
        {
          key: "favorite",
          node: <Favorite journalId={journal.id} />,
          label: null,
        },
        {
          key: "edited-on-date",
          node: <FormatDate value={journal.editedOn} />,
          label: "Edited",
        },
        {
          key: "shared-with",
          node: <SharedWith journal={journal} />,
          hideWhen: () => !Object.keys(journal.permissions).length,
          label: "Shared with",
        },
        {
          key: "description",
          node: <>{journal.description}</>,
          hideWhen: () => !journal.description,
          label: "Description",
        },
      ]}
    />
  </Host>
);

const Host = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
`;
