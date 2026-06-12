import React from "react";
import { useScrapContext } from "./ScrapContext";
import { ScrapMarkdown } from "./markdown/ScrapMarkdown";
import { ReadonlyTitle } from "../../overview/ReadonlyTitle";
import { Markdown } from "./markdown/Markdown";
import { SimpleDateSelector } from "../../common/DateSelector";
import { format } from "date-fns";
import { useJournalContext } from "../JournalContext";
import { utcToDateOnly } from "../../../util/utils";

export const LogBookInner: React.FC = () => {
  const { isEditMode, setIsEditMode, date, setDate, scrapToRender, hasFocus } =
    useScrapContext();
  const { entries } = useJournalContext();

  // Days that already have an entry (other than the one currently being edited) must not be
  // selectable, so we can keep at most one entry per day.
  const usedDays = React.useMemo(() => {
    const days = new Set<string>();
    for (const entry of entries) {
      if (!entry.dateTime || entry.id === scrapToRender.id) {
        continue;
      }
      days.add(format(utcToDateOnly(new Date(entry.dateTime)), "yyyy-MM-dd"));
    }
    return days;
  }, [entries, scrapToRender.id]);

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
        <SimpleDateSelector
          setDate={setDate}
          date={date}
          shouldDisableDate={(d) => usedDays.has(format(d, "yyyy-MM-dd"))}
        />
      ) : (
        <ReadonlyTitle
          entity={scrapToRender}
          hasFocus={hasFocus}
          title={
            <Markdown
              useBasic={true}
              value={format(date, "EEEE, do MMMM yy")}
            />
          }
        />
      )}

      <ScrapMarkdown />
    </div>
  );
};
