import React, { useState, useSyncExternalStore } from "react";
import { Tooltip } from "@mui/material";
import { SharedTooltipContext } from "./SharedTooltipContext";
import { SharedTooltipStore } from "./SharedTooltipStore";

export const SharedTooltipProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [store] = useState(() => new SharedTooltipStore());

  return (
    <SharedTooltipContext.Provider value={store}>
      {children}
      <SharedTooltip store={store} />
    </SharedTooltipContext.Provider>
  );
};

const SharedTooltip: React.FC<{ store: SharedTooltipStore }> = ({ store }) => {
  const state = useSyncExternalStore(store.subscribe, store.getState);

  if (!state) {
    return null;
  }

  return (
    <Tooltip
      title={state.title}
      open={state.isOpen}
      // Called for the escape key - everything else is up to the store.
      onClose={store.close}
      slotProps={{ popper: { anchorEl: state.element } }}
      disableInteractive={true}
      // Both keep the title off the placeholder below: it would be found as
      // a second element with the label of the one the tooltip is for.
      describeChild={true}
      disableHoverListener={true}
    >
      {/* MUI attaches a tooltip to its child. This one is placed at the
          element it is for instead, so the child is only here to be there. */}
      <span hidden={true} />
    </Tooltip>
  );
};
