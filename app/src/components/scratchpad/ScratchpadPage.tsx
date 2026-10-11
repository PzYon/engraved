import React from "react";
import Assignment from "@mui/icons-material/Assignment";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { PageSection } from "../layout/pages/PageSection";
import { Icon } from "../common/Icon";
import { IconStyle } from "../common/IconStyle";
import { RichTextEditor } from "../common/RichTextEditor";
import { translations } from "../../i18n/translations";
import { useScratchpad } from "./useScratchpad";

export const ScratchpadPage: React.FC = () => {
  const { isLoaded, savedContent, content, edit, save } = useScratchpad();

  return (
    <Page
      documentTitle={translations.scratchpad_title}
      title={
        <PageTitle
          title={translations.scratchpad_title}
          icon={
            <Icon style={IconStyle.Large}>
              <Assignment fontSize="small" />
            </Icon>
          }
        />
      }
      actions={[]}
      tabs={[]}
    >
      <PageSection>
        {isLoaded ? (
          <RichTextEditor
            // The editor only takes its content when it is created, so what
            // has been saved elsewhere needs a new one.
            key={savedContent}
            initialValue={content}
            setValue={edit}
            onBlur={save}
            initialIsPlainText={true}
            autoFocus={true}
            showFormattingOptions={true}
          />
        ) : null}
      </PageSection>
    </Page>
  );
};
