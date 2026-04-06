import React from "react";
import { useScrapContext } from "./ScrapContext";
import { ScrapMarkdown } from "./markdown/ScrapMarkdown";
import { ReadonlyTitle } from "../../overview/ReadonlyTitle";
import { Markdown } from "./markdown/Markdown";
import { SimpleDateSelector } from "../../common/DateSelector";

export const LogBookInner: React.FC = () => {
  const { isEditMode, setIsEditMode, date, setDate, scrapToRender, hasFocus } =
    useScrapContext();

  return (
    <div
      onClick={(e) => {
        if (e.detail === 2) {
          setIsEditMode(true);
        }
      }}
      data-testid={"scrap-" + (scrapToRender.id || "new")}
      data-scrap-type={scrapToRender.scrapType}
    >
      {isEditMode ? (
        <SimpleDateSelector setDate={setDate} date={date} />
      ) : (
        <ReadonlyTitle
          entity={scrapToRender}
          hasFocus={hasFocus}
          title={<Markdown useBasic={true} value={date.toJSON()} />}
        />
      )}

      <ScrapMarkdown />
    </div>
  );
};
