import React, { useState } from "react";
import { JournalAttributesEditor } from "./JournalAttributesEditor";
import { EditThresholds } from "../thresholds/EditThresholds";
import { PageSection } from "../../layout/pages/PageSection";
import { useJournalContext } from "../JournalDetailsContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../../layout/pages/Page";
import { getCommonEditModeActions } from "../../overview/getCommonActions";
import { JournalUiSettings } from "./JournalUiSettings";
import { EditCommonProperties } from "./EditCommonProperties";
import { useEditJournalMutation } from "../../../serverApi/reactQuery/mutations/useEditJournalMutation";
import { JournalPageTitle } from "../JournalPageTitle";
import { EditPageFooterButtons } from "../../common/EditPageFooterButtons";

export const JournalEditPage: React.FC = () => {
  const { journal } = useJournalContext();

  const [name, setName] = useState(journal.name);
  const [description, setDescription] = useState(journal.description);
  const [attributes, setAttributes] = useState(journal.attributes);
  const [thresholds, setThresholds] = useState(journal.thresholds ?? {});
  const [uiSettings, setUiSettings] = useState(
    journal.customProps?.uiSettings
      ? JSON.parse(journal.customProps.uiSettings)
      : {},
  );

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
          uiSettings,
        },
      },
      onSuccess: navigateToViewPage,
    });
  return (
    <Page
      pageType="journal"
      title={<JournalPageTitle journal={journal} />}
      subTitle="Edit"
      documentTitle={`Edit ${journal.name}`}
      actions={getCommonEditModeActions(navigateToViewPage, save)}
    >
      <EditCommonProperties
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
      />

      <PageSection title={"Attributes"}>
        <JournalAttributesEditor
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </PageSection>

      <PageSection title={"Thresholds"}>
        <EditThresholds journal={journal} onChange={setThresholds} />
      </PageSection>

      <PageSection title={"UI Settings"}>
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
