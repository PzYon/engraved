import { Page } from "../../layout/pages/Page";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import { IconStyle } from "../../common/IconStyle";
import { FilterMode } from "../../layout/pages/PageContext";
import { Style } from "@mui/icons-material";
import { useParams } from "react-router-dom";

export const TagPage: React.FC = () => {
  // todo:
  // - load journals
  // - render journal icon
  // - maybe add possibility to add another journal to this tag?

  const { tagName } = useParams();

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
      <div>Tag journals go here.</div>
    </Page>
  );
};
