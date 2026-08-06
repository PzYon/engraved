import React from "react";
import { Chip, styled, Tooltip } from "@mui/material";
import AttachFile from "@mui/icons-material/AttachFile";
import Image from "@mui/icons-material/Image";
import { useScrapContext } from "../ScrapContext";
import { useAppContext } from "../../../../AppContext";
import { IFileRef } from "../../../../serverApi/IFileRef";
import { getReferencedFileIds } from "../../../../fileStorage/fileReferences";
import { usePlaceImage } from "../markdown/PlaceImageContext";
import { useFileUrl } from "../../../../fileStorage/useFileUrls";

export const ScrapFiles: React.FC = () => {
  const { files, removeFile, isEditMode, notes } = useScrapContext();
  const { setAppAlert } = useAppContext();

  // Only set while a markdown scrap is being edited - there is nowhere to place an image otherwise.
  const placeImage = usePlaceImage();

  const getFileUrl = useFileUrl();

  // Removing a file from an entry deletes its blob once the save goes through, so offering that for
  // an image the text still places would destroy the bytes and leave the markdown pointing at
  // nothing. Take it out of the text first and the chip becomes removable.
  const placedFileIds = new Set(getReferencedFileIds(notes ?? ""));

  if (!files.length) {
    return null;
  }

  return <Host>{files.map(renderChip)}</Host>;

  function renderChip(file: IFileRef) {
    // A file placed in the text and one merely attached behave differently - the placed one cannot be
    // removed here - so they should not look identical either. The outline and the icon say which is
    // which at a glance; the tooltip says why, for the one where it matters.
    const isPlaced = placedFileIds.has(file.id);

    // An image that is attached but not placed can be put into the text - which is also the only way
    // back after deleting one from it, since removing it there keeps the file.
    const canPlace =
      !!placeImage && !isPlaced && file.contentType.startsWith("image/");

    return (
      <Tooltip key={file.id} title={getHint(isPlaced, canPlace)}>
        <FileChip
          icon={
            isPlaced ? (
              <Image fontSize="small" />
            ) : (
              <AttachFile fontSize="small" />
            )
          }
          variant={isPlaced ? "outlined" : "filled"}
          label={`${file.fileName} (${formatSize(file.contentLength)})`}
          onClick={() => (canPlace ? place(file) : openFile(file))}
          // A chip only shows its delete affordance when onDelete is set, so this is also what keeps
          // removal out of view mode.
          onDelete={
            isEditMode && !isPlaced ? () => removeFile(file.id) : undefined
          }
          size="small"
        />
      </Tooltip>
    );
  }

  // The signed URL rather than the reference, because the editor has to show the image. Saving turns
  // it back into a reference, exactly as it does for a pasted one.
  async function place(file: IFileRef) {
    try {
      placeImage?.({
        src: await getFileUrl(file.id),
        alt: file.fileName,
      });
    } catch {
      setAppAlert({
        title: `Could not place "${file.fileName}".`,
        type: "error",
      });
    }
  }

  async function openFile(file: IFileRef) {
    try {
      // Asked for on demand rather than held: the URL is signed and expires, so one fetched when the
      // scrap was rendered could be dead by the time it is clicked.
      const url = await getFileUrl(file.id);

      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setAppAlert({
        title: `Could not open "${file.fileName}".`,
        type: "error",
      });
    }
  }
};

function getHint(isPlaced: boolean, canPlace: boolean) {
  if (isPlaced) {
    return "Shown in the text above. Delete it there to detach the file.";
  }

  return canPlace ? "Click to place in the text." : "";
}

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

  /* Outlined marks a file the text already shows, so it reads as quieter than a plain attachment. */
  &.MuiChip-outlined {
    background-color: transparent;
    border-color: ${(p) => p.theme.palette.background.default};

    &:hover {
      background-color: transparent;
    }
  }

  /* Both icons colour themselves rather than following the label, so they need to be told. */
  .MuiChip-icon,
  .MuiChip-deleteIcon {
    color: inherit;
  }
`;
