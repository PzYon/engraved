import React, { useEffect, useRef } from "react";
import { IJournal } from "../../serverApi/IJournal";
import { Box, Typography } from "@mui/material";
import { JournalHeaderActions } from "./JournalHeaderActions";
import { JournalProperties } from "./JournalProperties";
import { JournalTypeIcon } from "../common/JournalTypeIcon";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { IconStyle } from "../common/Icon";
import { PageSection } from "../layout/pages/PageSection";
import { JournalItemWrapper } from "./JournalItemWrapper";
import { Wrapper } from "../common/wrappers/Wrapper";
import { ActionLink } from "../common/actions/ActionLink";
import { ActionFactory } from "../common/actions/ActionFactory";

export const JournalListItem: React.FC<{
  journal: IJournal;
  addWrapper?: (scrapWrapper: JournalItemWrapper) => void;
  index?: number;
  onClick?: () => void;
  isFocused?: boolean;
}> = ({ journal, addWrapper, index, onClick, isFocused }) => {
  const deviceWidth = useDeviceWidth();
  const domElementRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!addWrapper) {
      return;
    }

    addWrapper(new JournalItemWrapper(domElementRef, journal));
  }, [addWrapper, journal]);

  return (
    <Wrapper ref={domElementRef} tabIndex={index} onClick={onClick}>
      <PageSection key={journal.id}>
        <Box sx={{ display: "flex" }}>
          <JournalTypeIcon type={journal.type} style={IconStyle.Overview} />
          <Box sx={{ flexGrow: 1, pl: 3, wordBreak: "break-all" }}>
            <ActionLink
              action={ActionFactory.goToJournal(journal.id, isFocused)}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "lighter",
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 1,
                  marginTop: "-3px",
                }}
              >
                {journal.name}
              </Typography>
            </ActionLink>
            <JournalProperties journal={journal} />
            {deviceWidth === DeviceWidth.Small ? (
              <Box sx={{ display: "flex", mt: 2 }}>
                <JournalHeaderActions
                  journal={journal}
                  enableHotkeys={isFocused}
                />
              </Box>
            ) : null}
          </Box>
          {deviceWidth !== DeviceWidth.Small ? (
            <Box>
              <JournalHeaderActions
                journal={journal}
                enableHotkeys={isFocused}
              />
            </Box>
          ) : null}
        </Box>
      </PageSection>
    </Wrapper>
  );
};
