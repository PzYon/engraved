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
import { NoResultsFound } from "../../common/search/NoResultsFound";

export const TagPage: React.FC = () => {
  const { tagId } = useParams();
  const { user } = useAppContext();

  const journalIds = user.tags.find((t) => t.id === tagId)?.journalIds ?? [];

  return (
    <Page
      title={
        <PageTitle
          title={user.tags.find((t) => t.id === tagId)?.label}
          icon={
            <Icon style={IconStyle.Large}>
              <Style />
            </Icon>
          }
        />
      }
      actions={[]}
      filterMode={FilterMode.Text}
      showFilters={false}
      hideActions={true}
    >
      {journalIds?.length ? (
        <Journals journalIds={journalIds} />
      ) : (
        <NoResultsFound hideTryAgain={true} />
      )}
    </Page>
  );
};
