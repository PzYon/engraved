import React from "react";
import { IJournal } from "../../serverApi/IJournal";
import { FormatDate } from "../common/FormatDate";
import { SharedWith } from "../common/SharedWith";
import { Properties } from "../common/Properties";
import { styled } from "@mui/material";

export const JournalProperties: React.FC<{ journal: IJournal }> = ({
  journal,
}) => (
  <Host>
    <Properties
      properties={[
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
      ]}
    />
  </Host>
);

const Host = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
`;
