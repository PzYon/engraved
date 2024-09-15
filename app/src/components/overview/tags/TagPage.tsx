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
  // todo:
  // - load journals
  // - render journal icon
  // - maybe add possibility to add another journal to this tag?

  const { tagName } = useParams();
  const { user } = useAppContext();

  return (
    <Page
      title={
        <PageTitle
          title={"Tag"}
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
      <div>Tag name: {tagName}</div>
      <Journals tagNames={user.tags[tagName]} />
    </Page>
  );
};
