import React from "react";
import { AddMetric } from "./AddMetric";
import { PageTitle } from "../layout/pages/PageTitle";
import { Icon, IconStyle } from "../common/Icon";
import { AddOutlined } from "@mui/icons-material";
import { Page } from "../layout/pages/Page";

export const AddMetricPage: React.FC = () => {
  return (
    <Page
      title={
        <PageTitle
          title={"Add Metric"}
          icon={
            <Icon style={IconStyle.PageTitle}>
              <AddOutlined />
            </Icon>
          }
        />
      }
      actions={[]}
    >
      <AddMetric />
    </Page>
  );
};
