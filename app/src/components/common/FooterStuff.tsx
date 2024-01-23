import { IPropertyDefinition } from "./IPropertyDefinition";
import { Properties } from "./Properties";
import { ActionGroup } from "./actions/ActionGroup";
import { styled } from "@mui/material";
import { IAction } from "./actions/IAction";

/* eslint-disable react/prop-types */

export const FooterStuff: React.FC<{
  actions: IAction[];
  properties: IPropertyDefinition[];
}> = ({ actions, properties }) => {
  return (
    <FooterContainer className={"fooooooooooooooooooooooooter"}>
      <Properties properties={properties}></Properties>
      <ActionGroup actions={actions} />
    </FooterContainer>
  );
};

const FooterContainer = styled("div")``;
