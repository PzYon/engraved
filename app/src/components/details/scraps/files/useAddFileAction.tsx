import React, { useRef, useState } from "react";
import AttachFile from "@mui/icons-material/AttachFile";
import { useScrapContext } from "../ScrapContext";
import { useAppContext } from "../../../../AppContext";
import { IAction } from "../../../common/actions/IAction";
import { uploadFile } from "./uploadFile";

// Returns the action plus the file input it drives: a hidden <input type="file"> is the only way to
// open the picker, and it has to be rendered somewhere, so the caller places it.
export function useAddFileAction(): {
  action: IAction;
  fileInput: React.ReactNode;
} {
  const { addFile, journal } = useScrapContext();
  const { setAppAlert } = useAppContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const action: IAction = {
    key: "add-file",
    label: isUploading ? "Uploading..." : "Add file",
    icon: <AttachFile fontSize="small" />,
    isDisabled: isUploading,
    onClick: () => inputRef.current?.click(),
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      style={{ display: "none" }}
      onChange={async (e) => {
        const file = e.target.files?.[0];

        // Reset immediately so picking the same file twice in a row still fires a change event.
        e.target.value = "";

        if (!file) {
          return;
        }

        setIsUploading(true);

        try {
          addFile(await uploadFile(journal.id ?? "", file));
        } catch (error) {
          setAppAlert({
            title: `Could not upload "${file.name}".`,
            message: error instanceof Error ? error.message : undefined,
            type: "error",
          });
        } finally {
          setIsUploading(false);
        }
      }}
    />
  );

  return { action, fileInput };
}
