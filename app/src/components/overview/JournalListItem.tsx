import React, { useEffect, useRef } from "react";
import { IJournal } from "../../serverApi/IJournal";
import { Box, styled, Typography } from "@mui/material";
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
  index: number;
  addWrapper?: (scrapWrapper: JournalItemWrapper) => void;
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
    <Wrapper
      ref={domElementRef}
      tabIndex={index}
      onClick={onClick}
      data-testid={`journals-list-item-${index}`}
    >
      <PageSection key={journal.id} data-testid={journal.id}>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              flexGrow: 1,
              wordBreak: "break-all",
            }}
          >
            <TitleRow>
              <IconContainer>
                <JournalTypeIcon
                  type={journal.type}
                  style={IconStyle.Overview}
                />
              </IconContainer>

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
            </TitleRow>
            <JournalProperties journal={journal} position={"list"} />
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

const TitleRow = styled("div")`
  display: flex;
  padding-right: ${(p) => p.theme.spacing(1)};
`;

const IconContainer = styled("span")`
  padding-right: ${(p) => p.theme.spacing(2)};
`;
