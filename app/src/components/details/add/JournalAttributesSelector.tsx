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
  noBorderTop?: boolean;
}> = ({ attributes, selectedAttributeValues, onChange, noBorderTop }) => {
  return (
    <>
      {Object.keys(attributes)
        .sort()
        .map((attributeKey) => {
          const attribute: IJournalAttribute = attributes[attributeKey];

          return (
            <FormElementContainer
              className="journal-attribute-selector-wrapper"
              key={attributeKey}
              noBorderTop={noBorderTop}
            >
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
