import React from "react";
import { Chip, styled } from "@mui/material";
import AttachFile from "@mui/icons-material/AttachFile";
import { useScrapContext } from "../ScrapContext";
import { useAppContext } from "../../../../AppContext";
import { ServerApi } from "../../../../serverApi/ServerApi";
import { IFileRef } from "../../../../serverApi/IFileRef";

export const ScrapFiles: React.FC = () => {
  const { files, removeFile, isEditMode } = useScrapContext();
  const { setAppAlert } = useAppContext();

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
          onDelete={isEditMode ? () => removeFile(file.id) : undefined}
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

// Separated from the content above it the same way the footer row is, so the two read as sibling
// sections rather than the files looking like part of the scrap's body.
const Host = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing(1)};
  margin-top: ${(p) => p.theme.spacing(2)};
  padding-top: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;

// The default chip grey is not part of the palette anywhere else, so the page background is used
// instead - the same colour the separator above already uses.
const FileChip = styled(Chip)`
  background-color: ${(p) => p.theme.palette.background.default};

  &:hover {
    background-color: ${(p) => p.theme.palette.background.default};
  }
`;
