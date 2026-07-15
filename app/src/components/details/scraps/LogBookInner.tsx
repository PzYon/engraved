import React from "react";
import { styled } from "@mui/material";
import { useScrapContext } from "./ScrapContext";
import { ScrapMarkdown } from "./markdown/ScrapMarkdown";
import { ReadonlyTitle } from "../../overview/ReadonlyTitle";
import { Markdown } from "./markdown/Markdown";
import { RichTextEditor } from "../../common/RichTextEditor";
import { SimpleDateSelector } from "../../common/DateSelector";
import { format } from "date-fns";
import { getDayKey, utcToDateOnly } from "../../../util/utils";
import { useJournalEntriesQuery } from "../../../serverApi/reactQuery/queries/useJournalEntriesQuery";

import { TitleRow } from "./TitleRow";

export const LogBookInner: React.FC = () => {
  const {
    journal,
    isEditMode,
    setIsEditMode,
    date,
    setDate,
    scrapToRender,
    hasFocus,
    notes,
    title,
    setTitle,
    setHasTitleFocus,
  } = useScrapContext();

  // Fetch the journal's entries directly (rather than via JournalContext) so day-deduplication
  // works wherever this component is rendered - the "add entry" action lives in the app header,
  // outside the JournalContextProvider. Empty conditions reuse the cache the view page populates
  // and ensure we always check all entries, not a filtered subset.
  const entries = useJournalEntriesQuery(
    journal?.id ?? scrapToRender.parentId ?? "",
    {},
    {},
    "",
  );

  // Days that already have an entry (other than the one currently being edited) must not be
  // selectable, so we can keep at most one entry per day.
  const usedDays = React.useMemo(() => {
    const days = new Set<string>();
    for (const entry of entries) {
      if (!entry.dateTime || entry.id === scrapToRender.id) {
        continue;
      }
      days.add(getDayKey(utcToDateOnly(new Date(entry.dateTime))));
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
        <>
          <SimpleDateSelector
            setDate={setDate}
            date={date}
            shouldDisableDate={(d) => usedDays.has(getDayKey(d))}
          />
          <TitleEditorHost>
            <RichTextEditor
              initialValue={title}
              placeholder="Title (optional)"
              isTitle={true}
              setValue={setTitle}
              onFocus={() => setHasTitleFocus(true)}
              onBlur={() => setHasTitleFocus(false)}
            />
          </TitleEditorHost>
        </>
      ) : (
        <TitleRow
          hasFocus={hasFocus}
          hasNoContent={!notes?.trim().length}
          hasTitle={true}
        >
          <ReadonlyTitle
            entity={scrapToRender}
            hasFocus={hasFocus}
            title={
              <Markdown
                useBasic={true}
                value={
                  format(date, "EEEE, do MMMM yy") +
                  (title?.trim() ? ` - ${title.trim()}` : "")
                }
              />
            }
          />
        </TitleRow>
      )}

      <ScrapMarkdown />
    </div>
  );
};

// Mirrors the title styling of ParseableDate, which the (scrap) title editor uses elsewhere.
const TitleEditorHost = styled("div")`
  margin-top: ${(p) => p.theme.spacing(1)};

  .ngrvd-text-editor {
    font-size: 1.8rem;
    color: ${(p) => p.theme.palette.primary.main};
    font-weight: lighter;
  }
`;
