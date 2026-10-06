import { useState } from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { IParsedDate } from "../edit/parseDate";

// Everything that holds the user's unsaved edits, kept in one place so that discarding them cannot
// leave a part behind.
export function useScrapToRender(initialScrap: IScrapEntry) {
  const [scrapToRender, setScrapToRender] = useState(initialScrap);
  const [parsedDate, setParsedDate] = useState<IParsedDate | undefined>(
    undefined,
  );
  const [editorKey, setEditorKey] = useState(0);

  return {
    scrapToRender,
    setScrapToRender,
    parsedDate,
    setParsedDate,
    editorKey,
    resetToInitialScrap: () => {
      setScrapToRender(initialScrap);

      // What was typed into the title is also kept as a parsed date, and that is what gets saved in
      // place of the title. Left behind, a discarded title would come back with the next save.
      setParsedDate(undefined);

      setEditorKey((key) => key + 1);
    },
  };
}
