import React from "react";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { useScrapContext } from "./ScrapContext";
import { ScrapMarkdown } from "./markdown/ScrapMarkdown";
import { ScrapList } from "./list/ScrapList";
import { useDisplayModeContext } from "../../overview/overviewList/DisplayModeContext";
import { ISCrapListItem } from "./list/IScrapListItem";
import { ReadonlyTitle } from "../../overview/ReadonlyTitle";
import { ParseableDate } from "../edit/ParseableDate";

export const ScrapInner: React.FC = () => {
  const {
    isEditMode,
    setIsEditMode,
    title,
    setParsedDate,
    notes,
    setTitle,
    scrapToRender,
    hasFocus,
  } = useScrapContext();

  const { isCompact } = useDisplayModeContext();

  return (
    <div
      onClick={(e) => {
        if (e.detail === 2) {
          setIsEditMode(true);
        }
      }}
      data-testid={"scrap-" + scrapToRender.id}
    >
      {isEditMode ? (
        <ParseableDate
          onChange={(x) => {
            setParsedDate(x);
            setTitle(x.input);
          }}
          onSelect={setParsedDate}
          textFieldProps={{
            fieldType: "title",
            placeholder: "Title",
            variant: "outlined",
            value: title,
            disabled: !isEditMode,
            sx: { width: "100%" },
          }}
        />
      ) : (
        <ReadonlyTitle
          entity={scrapToRender}
          hasFocus={hasFocus}
          title={
            !isCompact || hasFocus || title
              ? title
              : getText()?.substring(0, 20) + " (...)"
          }
        />
      )}

      {scrapToRender.scrapType === ScrapType.List ? (
        <ScrapList />
      ) : (
        <ScrapMarkdown />
      )}
    </div>
  );

  function getText() {
    switch (scrapToRender.scrapType) {
      case ScrapType.Markdown:
        return notes;

      case ScrapType.List:
        return (JSON.parse(notes) as ISCrapListItem[])[0].label;

      default:
        throw new Error(`Unknown scrap type ${scrapToRender.scrapType}`);
    }
  }
};
