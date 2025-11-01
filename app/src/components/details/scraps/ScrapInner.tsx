import React from "react";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { useScrapContext } from "./ScrapContext";
import { ScrapMarkdown } from "./markdown/ScrapMarkdown";
import { ScrapList } from "./list/ScrapList";
import { useDisplayModeContext } from "../../overview/overviewList/DisplayModeContext";
import { IScrapListItem } from "./list/IScrapListItem";
import { ReadonlyTitle } from "../../overview/ReadonlyTitle";
import { ParseableDate } from "../edit/ParseableDate";
import { Markdown } from "./markdown/Markdown";

export const ScrapInner: React.FC = () => {
  const {
    isEditMode,
    setIsEditMode,
    title,
    setParsedDate,
    notes,
    setTitle,
    scrapToRender,
    setHasTitleFocus,
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
      data-scrap-type={scrapToRender.scrapType}
    >
      {isEditMode ? (
        <ParseableDate
          initialValue={title}
          placeholder="Title"
          isTitle={true}
          disabled={!isEditMode}
          noOutput={true}
          onChange={(d) => {
            setParsedDate(d);
            setTitle(d.input);
          }}
          onSelect={setParsedDate}
          onFocus={() => setHasTitleFocus(true)}
          onBlur={() => setHasTitleFocus(false)}
        />
      ) : (
        <ReadonlyTitle
          entity={scrapToRender}
          hasFocus={hasFocus}
          title={
            <Markdown
              useBasic={true}
              value={
                !isCompact || hasFocus || title
                  ? title
                  : getText()?.substring(0, 20) + " (...)"
              }
            />
          }
        />
      )}

      {scrapToRender.scrapType === ScrapType.List ? (
        <div style={{ marginTop: "2px" }}>
          <ScrapList />
        </div>
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
        return (JSON.parse(notes) as IScrapListItem[])[0].label;

      default:
        throw new Error(`Unknown scrap type ${scrapToRender.scrapType}`);
    }
  }
};
