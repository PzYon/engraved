import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";
import React from "react";
import { MetricAttributeEditor } from "./MetricAttributeEditor";
import { List, ListItem, ListSubheader, styled } from "@mui/material";

export const MetricAttributesEditor: React.FC<{
  attributes: IMetricAttributes;
  setAttributes: (attributes: IMetricAttributes) => void;
}> = ({ attributes, setAttributes }) => {
  return (
    <Host>
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Attributes
          </ListSubheader>
        }
      >
        {Object.entries(attributes).map(([key, value]) => {
          return (
            <MetricAttributeEditor
              key={key}
              attribute={value}
              onChange={(attribute) => {
                const newAttributes = { ...attributes };
                newAttributes[key] = attribute;
                setAttributes(newAttributes);
              }}
            />
          );
        })}
      </List>
    </Host>
  );
};

const Host = styled("div")`
  border-radius: 4px;
  border: 1px solid rgb(0 0 0 / 23%);
`;
