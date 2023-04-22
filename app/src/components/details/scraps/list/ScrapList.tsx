import React, { useState } from "react";
import { Button, Checkbox, styled, TextField } from "@mui/material";
import { PageSection } from "../../../layout/pages/PageSection";

export interface ISCrapListItem {
  label: string;
  isCompleted: boolean;
}

export const ScrapList: React.FC = () => {
  const [listItems, setListItems] = useState<ISCrapListItem[]>([]);

  return (
    <PageSection>
      <List>
        {listItems.map((item, index) => (
          <ScrapListItem
            key={index}
            listItem={item}
            onChange={(updatedItem) => {
              const updatedItems = [...listItems];
              updatedItems[index] = updatedItem;
              setListItems(updatedItems);
            }}
            onKeyUp={(direction) => {
              switch (direction) {
                case "enter":
                  addNew();
                  break;
                case "up":
                  break;
                case "down":
                  break;
              }
            }}
          />
        ))}
      </List>
      <Button onClick={addNew}>Add new</Button>
    </PageSection>
  );

  function addNew() {
    setListItems([...listItems, { label: "", isCompleted: false }]);
  }
};

const ScrapListItem: React.FC<{
  listItem: ISCrapListItem;
  onChange: (listItem: ISCrapListItem) => void;
  onKeyUp: (direction: "up" | "down" | "enter") => void;
}> = ({ listItem, onChange, onKeyUp }) => {
  const [label, setLabel] = useState(listItem.label);
  const [isCompleted, setIsCompleted] = useState(listItem.isCompleted);

  return (
    <ListItem>
      <StyledCheckbox
        checked={isCompleted}
        onChange={(_, checked) => {
          setIsCompleted(checked);
          emitOnChange(checked);
        }}
      />
      <StyledTextField
        value={label}
        variant="standard"
        autoComplete={"off"}
        sx={{ padding: 0, flexGrow: 1, border: 0 }}
        autoFocus={!listItem.label}
        onChange={(event) => setLabel(event.target.value)}
        onKeyUp={keyUp}
        onBlur={() => emitOnChange()}
      />
    </ListItem>
  );

  function keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "Enter":
        onKeyUp("enter");
        break;
      case "ArrowUp":
        onKeyUp("up");
        break;
      case "ArrowDown":
        onKeyUp("down");
        break;
    }
  }

  function emitOnChange(isCompletedOverride: boolean = undefined) {
    onChange({
      label,
      isCompleted:
        isCompletedOverride === undefined ? isCompleted : isCompletedOverride,
    });
  }
};

const StyledCheckbox = styled(Checkbox)`
  padding: 5px;
`;

const StyledTextField = styled(TextField)`
  input {
    padding: 2px 6px;
  }
`;

const List = styled("ul")`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled("li")`
  display: flex;
  align-items: center;
`;
