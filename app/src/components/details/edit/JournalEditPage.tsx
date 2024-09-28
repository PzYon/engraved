import React, { useState } from "react";
import { JournalAttributesEditor } from "./JournalAttributesEditor";
import { EditThresholds } from "../thresholds/EditThresholds";
import { PageSection } from "../../layout/pages/PageSection";
import { useJournalContext } from "../JournalContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../../layout/pages/Page";
import { getCommonEditModeActions } from "../../overview/getCommonJournalActions";
import { JournalUiSettings } from "./JournalUiSettings";
import { EditCommonProperties } from "./EditCommonProperties";
import { useEditJournalMutation } from "../../../serverApi/reactQuery/mutations/useEditJournalMutation";
import { JournalPageTitle } from "../JournalPageTitle";
import { EditPageFooterButtons } from "../../common/EditPageFooterButtons";
import { getUiSettings } from "../../../util/journalUtils";
import { PanToolOutlined, Preview, Style } from "@mui/icons-material";

export const JournalEditPage: React.FC = () => {
  const { journal } = useJournalContext();

  const [name, setName] = useState(journal.name);
  const [description, setDescription] = useState(journal.description);
  const [attributes, setAttributes] = useState(journal.attributes);
  const [thresholds, setThresholds] = useState(journal.thresholds ?? {});
  const [uiSettings, setUiSettings] = useState(getUiSettings(journal));

  const navigate = useNavigate();

  const editJournalMutation = useEditJournalMutation(journal.id);

  const navigateToViewPage = () => navigate("./..");

  const save = () =>
    editJournalMutation.mutateAsync({
      journal: {
        ...journal,
        name,
        description,
        attributes,
        thresholds,
        customProps: {
          uiSettings: JSON.stringify(uiSettings),
        },
      },
      onSuccess: navigateToViewPage,
    });
  return (
    <Page
      title={<JournalPageTitle journal={journal} />}
      subTitle="Edit"
      documentTitle={`Edit ${journal.name}`}
      actions={getCommonEditModeActions(navigateToViewPage, save)}
    >
      <EditCommonProperties
        journalId={journal.id}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
      />

      <PageSection title={"Attributes"} icon={<Style />}>
        <JournalAttributesEditor
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </PageSection>

      <PageSection title={"Thresholds"} icon={<PanToolOutlined />}>
        <EditThresholds journal={journal} onChange={setThresholds} />
      </PageSection>

      <PageSection title={"UI Settings"} icon={<Preview />}>
        <JournalUiSettings uiSettings={uiSettings} onChange={setUiSettings} />
      </PageSection>

      <EditPageFooterButtons
        onSave={save}
        disableSave={false}
        onCancel={navigateToViewPage}
      />
    </Page>
  );
};
