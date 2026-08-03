import React, { useMemo } from "react";
import { ActionFactory } from "../../../common/actions/ActionFactory";
import { ScrapBody } from "../ScrapBody";
import { useAppContext } from "../../../../AppContext";
import { useScrapContext } from "../ScrapContext";
import { RichTextEditor } from "../../../common/RichTextEditor";
import { Markdown } from "./Markdown";
import { IAction } from "../../../common/actions/IAction";
import {
  getReferencedFileIds,
  resolveFileUrls,
  toStoredMarkdown,
} from "../../../../fileStorage/fileReferences";
import { useFileUrls } from "../../../../fileStorage/useFileUrls";
import { useUploadFile } from "../../../../fileStorage/useUploadFile";

export const ScrapMarkdown: React.FC<{ editModeActions?: IAction[] }> = ({
  editModeActions = [],
}) => {
  const { setAppAlert } = useAppContext();

  const { notes, title, setNotes, isEditMode, files, addFile, journal } =
    useScrapContext();

  const upload = useUploadFile();

  // Stored markdown places images by file id; a URL for one is signed, expires, and so cannot be
  // stored. Resolving here rather than inside the renderer keeps that concern out of a component
  // that is also used for titles and list items, where images cannot occur.
  const referencedFileIds = useMemo(
    () => getReferencedFileIds(notes ?? ""),
    [notes],
  );

  const fileUrls = useFileUrls(referencedFileIds);

  const notesToRender = useMemo(
    () => resolveFileUrls(notes ?? "", fileUrls),
    [notes, fileUrls],
  );

  return (
    <ScrapBody
      actions={[ActionFactory.copyValueToClipboard(notes, setAppAlert)]}
    >
      {isEditMode ? (
        <div style={{ marginTop: "10px" }}>
          <RichTextEditor
            initialValue={notesToRender}
            // The editor hands back what it is showing, which is resolved URLs. Turning them back
            // into references here is what keeps a signature out of the saved scrap - it would
            // render for an hour and then break, on content already stored.
            setValue={(value) =>
              setNotes(
                toStoredMarkdown(
                  value,
                  files.map((f) => f.id),
                ),
              )
            }
            autoFocus={!!title}
            showFormattingOptions={true}
            editModeActions={[...editModeActions]}
            onInsertImages={insertImages}
          />
        </div>
      ) : (
        <Markdown value={notesToRender} />
      )}
    </ScrapBody>
  );

  // An inline image is an ordinary file that the markdown additionally places somewhere, so it goes
  // on the entry exactly like one added from the footer. Nothing marks it as inline: where it is
  // rendered is the markdown's business, and a second flag would be free to drift out of sync.
  async function insertImages(imageFiles: File[]) {
    const sources: { src: string; alt: string }[] = [];

    for (const imageFile of imageFiles) {
      try {
        const uploaded = await upload(journal.id ?? "", imageFile);

        addFile(uploaded.file);

        // The signed URL, not the reference: the editor has to show the image. It is turned back
        // into a reference by setValue above, before anything is saved.
        sources.push({ src: uploaded.readUrl, alt: uploaded.file.fileName });
      } catch (error) {
        setAppAlert({
          title: `Could not upload "${imageFile.name}".`,
          message: error instanceof Error ? error.message : undefined,
          type: "error",
        });
      }
    }

    return sources;
  }
};
