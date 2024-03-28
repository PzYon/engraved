import { Page } from "../layout/pages/Page";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon } from "../common/Icon";
import { getPageTabs } from "../layout/tabs/getPageTabs";
import { FilterMode } from "../layout/pages/PageContext";
import { AlarmOutlined } from "@mui/icons-material";
import { Scheduled } from "./Scheduled";
import { IconStyle } from "../common/IconStyle";

export const ScheduledPage: React.FC = () => {
  return (
    <Page
      title={
        <PageTitle
          title={"Scheduled"}
          icon={
            <Icon style={IconStyle.PageTitle}>
              <AlarmOutlined />
            </Icon>
          }
        />
      }
      tabs={getPageTabs("scheduled")}
      filterMode={FilterMode.Text}
      hideActions={true}
    >
      <Scheduled />
    </Page>
  );
};
