import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import { IconStyle } from "../../common/IconStyle";
import { FilterMode } from "../../layout/pages/PageContext";
import { Style } from "@mui/icons-material";
import { ListOfTags } from "./ListOfTags";

export const TagsPage: React.FC = () => {
  return (
    <Page
      title={
        <PageTitle
          title={"Tags"}
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
      <ListOfTags />
    </Page>
  );
};
