import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import { IconStyle } from "../../common/IconStyle";
import { FilterMode } from "../../layout/pages/PageContext";
import { Style } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import React from "react";
import { useAppContext } from "../../../AppContext";
import { Journals } from "../journals/Journals";

export const TagPage: React.FC = () => {
  const { tagName } = useParams();
  const { user } = useAppContext();

  const journalIds = user.tags[tagName];

  return (
    <Page
      title={
        <PageTitle
          title={tagName}
          icon={
            <Icon style={IconStyle.Large}>
              <Style />
            </Icon>
          }
        />
      }
      filterMode={FilterMode.Text}
      showFilters={false}
      hideActions={true}
    >
      {journalIds?.length ? <Journals journalIds={journalIds} /> : null}
    </Page>
  );
};
