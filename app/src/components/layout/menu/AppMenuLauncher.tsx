import React, { useState } from "react";
import { AppMenu } from "./AppMenu";
import { Drawer, styled } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";

export const AppMenuLauncher: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEngravedHotkeys("alt+m", () => setIsMenuOpen(true));

  return (
    <>
      <StyledDrawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        sx={{ p: 0 }}
      >
        <AppMenu close={() => setIsMenuOpen(false)} />
      </StyledDrawer>
      <StyledMenuIcon
        sx={{
          color: "white",
          mr: 2,
          cursor: "pointer",
        }}
        fontSize="large"
        onClick={() => setIsMenuOpen(true)}
      />
    </>
  );
};

const StyledMenuIcon = styled(Menu)`
  @media screen and (min-width: 1265px) {
    position: fixed;
    top: 15px;
    left: 10px;
  }
`;

const StyledDrawer = styled(Drawer)`
  .MuiPaper-root {
    border-radius: 0;
  }
`;
