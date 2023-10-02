import React from "react";
import { useJournalContext } from "./JournalDetailsContext";
import { JournalType } from "../../serverApi/JournalType";
import { styled, Typography } from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { EditJournalPermissionsLauncher } from "./edit/EditJournalPermissionsLauncher";
import { FormatDate } from "../common/FormatDate";
import { JournalViewPage } from "./JournalViewPage";
import { JournalEditPage } from "./edit/JournalEditPage";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { DeleteJournalLauncher } from "./edit/DeleteJournalLauncher";
import { IJournal } from "../../serverApi/IJournal";
import { SharedWith } from "../common/SharedWith";
import { ScrapsViewPage } from "./scraps/ScrapsViewPage";
import { ScrapsEditPage } from "./scraps/ScrapsEditPage";
import { ScrapsMovePage } from "./scraps/ScrapsMovePage";

export const JournalDetails: React.FC = () => {
  const { journal } = useJournalContext();
  const deviceWidth = useDeviceWidth();

  if (!journal) {
    return null;
  }

  return (
    <>
      <Typography component="div">
        <PropertiesContainer isSmall={deviceWidth === DeviceWidth.Small}>
          {journal.editedOn ? (
            <PropertyContainer>
              Edited <FormatDate value={journal.editedOn} />
            </PropertyContainer>
          ) : null}
          {Object.keys(journal.permissions).length > 0 ? (
            <PropertyContainer>
              Shared with <SharedWith journal={journal} />
            </PropertyContainer>
          ) : null}
          {journal.description ? (
            <PropertyContainer>{journal.description}</PropertyContainer>
          ) : null}
        </PropertiesContainer>
      </Typography>

      <Routes>
        {journal.type === JournalType.Scraps ? (
          <>
            <Route path="/edit" element={<ScrapsEditPage />} />
            <Route path="/*" element={<ScrapsViewPage />} />
            <Route path="/entries/:entryId/move" element={<ScrapsMovePage />} />
          </>
        ) : (
          <>
            <Route path="/edit" element={<JournalEditPage />} />
            <Route path="/*" element={<JournalViewPage />} />
          </>
        )}
      </Routes>
      <SubRoutes journal={journal} />
    </>
  );
};

const SubRoutes: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/permissions"
        element={<EditJournalPermissionsLauncher journal={journal} />}
      />
      <Route
        path="/delete"
        element={
          <DeleteJournalLauncher
            journal={journal}
            onDeleted={() => navigate("../../")}
          />
        }
      />
    </Routes>
  );
};

const PropertiesContainer = styled("div")<{
  isSmall?: boolean;
}>`
  padding: 0 ${(p) => (p.isSmall ? p.theme.spacing(2) : 0)};

  & > span:not(:last-of-type)::after {
    content: "\\00B7";
    margin: 0 ${(p) => p.theme.spacing(2)};
  }
`;

const PropertyContainer = styled("span")`
  color: ${(p) => p.theme.palette.text.primary};
`;
