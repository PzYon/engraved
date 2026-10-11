import React from "react";
import Assignment from "@mui/icons-material/Assignment";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { PageSection } from "../layout/pages/PageSection";
import { Icon } from "../common/Icon";
import { IconStyle } from "../common/IconStyle";
import { RichTextEditor } from "../common/RichTextEditor";
import { translations } from "../../i18n/translations";
import { useScratchpadSession } from "./useScratchpadSession";

export const ScratchpadPage: React.FC = () => {
  const { session, state } = useScratchpadSession();

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
        {state.isLoaded ? (
          <RichTextEditor
            key={state.revision}
            initialValue={state.content}
            setValue={(value) => session.edit(value)}
            initialIsPlainText={true}
            autoFocus={true}
            showFormattingOptions={true}
          />
        ) : null}
      </PageSection>
    </Page>
  );
};
