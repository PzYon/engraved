import { FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { PageSection } from "../../layout/pages/PageSection";
import React from "react";
import { MoreOutlined, Style } from "@mui/icons-material";
import { ManageUserTags } from "../../overview/tags/ManageUserTags";

export const EditCommonProperties: React.FC<{
  journalId: string;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
}> = ({ journalId, name, setName, description, setDescription }) => {
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
        <ManageUserTags journalId={journalId} />
      </PageSection>
    </>
  );
};
