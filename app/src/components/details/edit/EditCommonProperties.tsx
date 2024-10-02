import { FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { PageSection } from "../../layout/pages/PageSection";
import React from "react";
import { MoreOutlined, Style } from "@mui/icons-material";
import { ManageJournalUserTags } from "../../overview/tags/ManageJournalUserTags";

export const EditCommonProperties: React.FC<{
  journalId: string;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  onChangedTags: (tagNames: string[]) => void;
}> = ({
  journalId,
  name,
  setName,
  description,
  setDescription,
  onChangedTags,
}) => {
  return (
    <>
      <PageSection title={"Properties"} icon={<MoreOutlined />}>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            value={name}
            onChange={(event) => setName(event.target.value)}
            label={translations.label_journalName}
            margin={"normal"}
          />
          <TextField
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            multiline={true}
            label={"Description"}
            margin={"normal"}
          />
        </FormControl>
      </PageSection>

      <PageSection title={"Tags"} icon={<Style />}>
        <ManageJournalUserTags
          journalId={journalId}
          onChangedTags={onChangedTags}
        />
      </PageSection>
    </>
  );
};
