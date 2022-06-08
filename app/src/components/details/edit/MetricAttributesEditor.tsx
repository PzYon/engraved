import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";
import React from "react";
import { MetricAttributeEditor } from "./MetricAttributeEditor";
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  styled,
} from "@mui/material";
import { ListItemTextField } from "./ListItemTextField";

export const MetricAttributesEditor: React.FC<{
  attributes: IMetricAttributes;
  setAttributes: (attributes: IMetricAttributes) => void;
}> = ({ attributes, setAttributes }) => {
  return (
    <Host>
      <List subheader={<ListSubheader>Attributes</ListSubheader>}>
        {Object.entries(attributes).map(([key, value]) => (
          <MetricAttributeEditor
            key={key}
            attribute={value}
            onChange={(attribute) => {
              const newAttributes = { ...attributes };
              newAttributes[key] = attribute;
              setAttributes(newAttributes);
            }}
          />
        ))}

        <ListItem key={"add_new_attribute"}>
          <ListItemText>
            <ListItemTextField onBlur={(newValue: string) => alert(newValue)} />
          </ListItemText>
        </ListItem>
      </List>
    </Host>
  );
};

const Host = styled("div")`
  border-radius: 4px;
  border: 1px solid rgb(0 0 0 / 23%);
`;
