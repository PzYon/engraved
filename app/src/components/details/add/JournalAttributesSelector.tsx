import React from "react";
import { IJournalAttributeValues } from "../../../serverApi/IJournalAttributeValues";
import { IJournalAttribute } from "../../../serverApi/IJournalAttribute";
import { JournalAttributeSelector } from "./JournalAttributeSelector";
import { IJournalAttributes } from "../../../serverApi/IJournalAttributes";
import { FormElementContainer } from "../../common/FormUtils";

export const JournalAttributesSelector: React.FC<{
  attributes: IJournalAttributes;
  selectedAttributeValues: IJournalAttributeValues;
  onChange: (attributesValues: IJournalAttributeValues) => void;
}> = ({ attributes, selectedAttributeValues, onChange }) => {
  return (
    <>
      {Object.keys(attributes)
        .sort()
        .map((attributeKey) => {
          const attribute: IJournalAttribute = attributes[attributeKey];

          return (
            <FormElementContainer key={attributeKey}>
              <JournalAttributeSelector
                attributeKey={attributeKey}
                attribute={attribute}
                selectedAttributeValues={selectedAttributeValues}
                onChange={onChange}
              />
            </FormElementContainer>
          );
        })}
    </>
  );
};
