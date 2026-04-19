/**
 * DEMO: Scoped Hotkeys Test Component
 *
 * This component demonstrates scoped hotkeys in action.
 * You can use this to test and verify that scoping is working correctly.
 *
 * To test:
 * 1. Render this component
 * 2. Click on different items to give them focus
 * 3. Press Alt+E or Alt+D
 * 4. Observe that only the focused item responds to the hotkey
 */

import React, { useState } from "react";
import { styled } from "@mui/material";
import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { IAction } from "./IAction";
import { createItemScope } from "./scopeUtils";
import { useScopedFocus } from "./useScopedFocus";
import { ActionIconButtonGroup } from "./ActionIconButtonGroup";

interface DemoItem {
  id: string;
  name: string;
}

export const ScopedHotkeysDemo: React.FC = () => {
  const [items] = useState<DemoItem[]>([
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
  ]);

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [message, ...prev].slice(0, 10));
  };

  return (
    <Container>
      <h2>Scoped Hotkeys Demo</h2>
      <Instructions>
        <p>Click on an item to give it focus, then press:</p>
        <ul>
          <li>
            <strong>Alt+E</strong> - Edit the focused item
          </li>
          <li>
            <strong>Alt+D</strong> - Delete the focused item
          </li>
        </ul>
        <p>
          Without scoping, ALL items would respond. With scoping, only the
          focused item responds.
        </p>
      </Instructions>

      <ItemsList>
        {items.map((item) => (
          <DemoListItem
            key={item.id}
            item={item}
            hasFocus={activeItemId === item.id}
            onFocus={() => setActiveItemId(item.id)}
            onAction={(action) => addLog(`${action} on ${item.name}`)}
          />
        ))}
      </ItemsList>

      <LogContainer>
        <h3>Action Log (most recent first):</h3>
        {log.length === 0 ? (
          <EmptyLog>No actions yet. Click an item and press a hotkey!</EmptyLog>
        ) : (
          <ul>
            {log.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        )}
      </LogContainer>
    </Container>
  );
};

const DemoListItem: React.FC<{
  item: DemoItem;
  hasFocus: boolean;
  onFocus: () => void;
  onAction: (action: string) => void;
}> = ({ item, hasFocus, onFocus, onAction }) => {
  // Create a unique scope for this item
  const scope = createItemScope("demo-item", item.id);

  // Enable/disable the scope based on focus
  useScopedFocus(scope, hasFocus);

  // Create actions with the scope
  const actions: IAction[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined fontSize="small" />,
      hotkey: "alt+e",
      scope: scope, // <-- The scope ensures this only works when item has focus
      onClick: () => onAction("Edit"),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined fontSize="small" />,
      hotkey: "alt+d",
      scope: scope, // <-- The scope ensures this only works when item has focus
      onClick: () => onAction("Delete"),
    },
  ];

  return (
    <ItemContainer
      onClick={onFocus}
      hasFocus={hasFocus}
      data-testid={`demo-item-${item.id}`}
    >
      <ItemName hasFocus={hasFocus}>{item.name}</ItemName>
      <span style={{ fontSize: "12px", opacity: 0.6 }}>
        {hasFocus
          ? "(focused - hotkeys active)"
          : "(not focused - hotkeys disabled)"}
      </span>
      {hasFocus && (
        <ActionsContainer>
          <ActionIconButtonGroup actions={actions} />
        </ActionsContainer>
      )}
    </ItemContainer>
  );
};

const Container = styled("div")`
  padding: ${(p) => p.theme.spacing(4)};
  max-width: 800px;
  margin: 0 auto;
`;

const Instructions = styled("div")`
  background-color: ${(p) => p.theme.palette.background.default};
  padding: ${(p) => p.theme.spacing(2)};
  border-radius: 8px;
  margin-bottom: ${(p) => p.theme.spacing(3)};
`;

const ItemsList = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(2)};
  margin-bottom: ${(p) => p.theme.spacing(4)};
`;

const ItemContainer = styled("div")<{ hasFocus: boolean }>`
  padding: ${(p) => p.theme.spacing(2)};
  border: 2px solid
    ${(p) =>
      p.hasFocus ? p.theme.palette.primary.main : p.theme.palette.divider};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(p) =>
    p.hasFocus ? p.theme.palette.action.selected : "transparent"};

  &:hover {
    border-color: ${(p) => p.theme.palette.primary.light};
  }
`;

const ItemName = styled("div")<{ hasFocus: boolean }>`
  font-size: 18px;
  font-weight: ${(p) => (p.hasFocus ? 600 : 400)};
  margin-bottom: ${(p) => p.theme.spacing(1)};
`;

const ActionsContainer = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
  display: flex;
  justify-content: flex-end;
`;

const LogContainer = styled("div")`
  background-color: ${(p) => p.theme.palette.background.default};
  padding: ${(p) => p.theme.spacing(2)};
  border-radius: 8px;

  h3 {
    margin-top: 0;
  }

  ul {
    margin: 0;
    padding-left: ${(p) => p.theme.spacing(3)};
  }

  li {
    padding: ${(p) => p.theme.spacing(0.5)} 0;
  }
`;

const EmptyLog = styled("div")`
  color: ${(p) => p.theme.palette.text.secondary};
  font-style: italic;
`;
