import React, { useState } from "react";
import { AppMenu } from "./AppMenu";
import { Drawer, IconButton, styled } from "@mui/material";
import Menu from "@mui/icons-material/Menu";
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
      <IconButton
        aria-label="Menu"
        onClick={() => setIsMenuOpen(true)}
        sx={{ color: "white", mr: 1, p: 0.5 }}
      >
        <Menu fontSize="large" />
      </IconButton>
    </>
  );
};

const StyledDrawer = styled(Drawer)`
  .MuiPaper-root {
    border-radius: 0;
  }
`;
