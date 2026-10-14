import React, { useState } from "react";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import { Drawer, styled } from "@mui/material";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { RecentlyViewedMenu } from "./RecentlyViewedMenu";

export const RecentlyViewedLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const deviceWidth = useDeviceWidth();

  return (
    <>
      <StyledDrawer
        anchor={deviceWidth === DeviceWidth.Small ? "bottom" : "right"}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <RecentlyViewedMenu close={() => setIsOpen(false)} />
      </StyledDrawer>
      <LauncherHost>
        <ActionIconButton
          action={{
            sx: {
              backgroundColor: "primary.main",
              color: "common.white",
            },
            key: "recently-viewed",
            label: "Recently viewed journals",
            hotkey: "alt+b",
            icon: <HistoryOutlined fontSize="large" />,
            onClick: () => setIsOpen(true),
          }}
        />
      </LauncherHost>
    </>
  );
};

const LauncherHost = styled("div")`
  position: fixed;
  bottom: 16px;
  right: 16px;
`;

const StyledDrawer = styled(Drawer)`
  .MuiPaper-root {
    border-radius: 0;
  }

  /* keeps the items close to the launcher. unlike justify-content: flex-end,
     an auto margin still lets the paper scroll to the top when the list overflows. */
  .MuiDrawer-paperAnchorRight > * {
    margin-top: auto;
  }
`;
