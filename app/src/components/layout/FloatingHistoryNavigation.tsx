import React, { useRef } from "react";
import { Popover, styled } from "@mui/material";
import { ActionIconButton } from "../common/actions/ActionIconButton";
import { HistoryOutlined } from "@mui/icons-material";
import { GoToSimple } from "../overview/goto/GoToSimple";
import { PageSection } from "./pages/PageSection";
import { useEngravedHotkeys } from "../common/actions/useEngravedHotkeys";

export const FloatingHistoryNavigation: React.FC = () => {
  const domElementRef = useRef<HTMLSpanElement>(undefined);

  const [showMenu, setShowMenu] = React.useState(false);

  useEngravedHotkeys("alt+b", () => setShowMenu(!showMenu));

  return (
    <Host>
      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span ref={domElementRef} style={{ height: 16 }}></span>
        <ActionIconButton
          action={{
            sx: {
              backgroundColor: "primary.main",
              color: "common.white",
            },
            key: "history",
            label: "Recently viewed journals",
            icon: <HistoryOutlined fontSize="large" />,
            onClick: () => setShowMenu(!showMenu),
          }}
        />
      </div>

      <Popover
        disableScrollLock={true}
        onClose={() => setShowMenu(false)}
        open={true}
        style={{
          display: showMenu ? "initial" : "none",
          margin: 0,
        }}
        anchorEl={{
          getBoundingClientRect: () =>
            domElementRef.current.getBoundingClientRect(),
          nodeType: 1,
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <PageSection style={{ margin: "0 !important" }}>
          <GoToSimple
            onClick={() => {
              setShowMenu(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setShowMenu(false);
              }
            }}
          />
        </PageSection>
      </Popover>
    </Host>
  );
};

const Host = styled("div")`
  position: sticky;
  bottom: 10px;
`;
