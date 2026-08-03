import React from "react";
import { Chip, styled } from "@mui/material";
import AttachFile from "@mui/icons-material/AttachFile";
import { useScrapContext } from "../ScrapContext";
import { useAppContext } from "../../../../AppContext";
import { ServerApi } from "../../../../serverApi/ServerApi";
import { IFileRef } from "../../../../serverApi/IFileRef";
import { getReferencedFileIds } from "../../../../fileStorage/fileReferences";

export const ScrapFiles: React.FC = () => {
  const { files, removeFile, isEditMode, notes } = useScrapContext();
  const { setAppAlert } = useAppContext();

  // Removing a file from an entry deletes its blob once the save goes through, so offering that for
  // an image the text still places would destroy the bytes and leave the markdown pointing at
  // nothing. Take it out of the text first and the chip becomes removable.
  const placedFileIds = new Set(getReferencedFileIds(notes ?? ""));

  if (!files.length) {
    return null;
  }

  return (
    <Host>
      {files.map((file) => (
        <FileChip
          key={file.id}
          icon={<AttachFile fontSize="small" />}
          label={`${file.fileName} (${formatSize(file.contentLength)})`}
          onClick={() => openFile(file)}
          // A chip only shows its delete affordance when onDelete is set, so this is also what keeps
          // removal out of view mode.
          onDelete={
            isEditMode && !placedFileIds.has(file.id)
              ? () => removeFile(file.id)
              : undefined
          }
          size="small"
        />
      ))}
    </Host>
  );

  async function openFile(file: IFileRef) {
    try {
      // Asked for on demand rather than held: the URL is signed and expires, so one fetched when the
      // scrap was rendered could be dead by the time it is clicked.
      const url = await ServerApi.getFileUrl(file.id);

      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setAppAlert({
        title: `Could not open "${file.fileName}".`,
        type: "error",
      });
    }
  }
};

function formatSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const Host = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing(1)};
  margin-top: ${(p) => p.theme.spacing(2)};
  padding-top: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;

const FileChip = styled(Chip)`
  background-color: ${(p) => p.theme.palette.background.default};
  color: ${(p) => p.theme.palette.primary.main};

  &:hover {
    background-color: ${(p) => p.theme.palette.background.default};
  }

  /* Both icons colour themselves rather than following the label, so they need to be told. */
  .MuiChip-icon,
  .MuiChip-deleteIcon {
    color: inherit;
  }
`;
