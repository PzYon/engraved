import React, { useEffect, useRef } from "react";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { useScrapContext } from "./ScrapContext";
import { ScrapMarkdown } from "./markdown/ScrapMarkdown";
import { ScrapList } from "./list/ScrapList";
import { useDisplayModeContext } from "../../overview/overviewList/DisplayModeContext";
import { IScrapListItem } from "./list/IScrapListItem";
import { ReadonlyTitle } from "../../overview/ReadonlyTitle";
import { ParseableDate } from "../edit/ParseableDate";
import { Markdown } from "./markdown/Markdown";
import { AutoFixHigh } from "@mui/icons-material";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { TitleRow } from "./TitleRow";

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
    changeScrapType,
    isDirty,
    upsertScrap,
    hasPendingBackgroundUpdate,
    isAutoSaveEnabled,
    setIsAutoSaveEnabled,
  } = useScrapContext();

  const { isCompact } = useDisplayModeContext();

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-save: when the user is editing an existing scrap and then clicks/taps
  // somewhere outside the scrap, save the pending changes so that work is not
  // lost when one forgets to hit "save".
  //
  // We use a "click outside" detector (pointerdown anywhere outside the scrap)
  // rather than a blur handler on purpose: a blur cannot reliably tell "tapped
  // outside the scrap" apart from "tapped a non-focusable area inside the scrap"
  // (both report a null relatedTarget), which on touch devices led to premature
  // saves. Pointer position, on the other hand, is unambiguous.
  //
  // We deliberately keep this conservative: only existing (already persisted)
  // scraps with unsaved changes are auto-saved, and never while a newer version
  // of the scrap is pending resolution - saving then would clobber a concurrent
  // edit and bypass the "scrap has changed" merge flow. Switching browser tab or
  // application does not produce a pointerdown, so those never trigger a save.
  useEffect(() => {
    if (!isEditMode || !scrapToRender.id || !isAutoSaveEnabled) {
      return;
    }

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (
        !target ||
        containerRef.current?.contains(target) ||
        !isDirty ||
        hasPendingBackgroundUpdate
      ) {
        return;
      }

      // keep the user in edit mode - auto-save only persists, it does not close
      // the editor. Edit mode is closed only via the explicit save/cancel action.
      upsertScrap(undefined, true);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [
    isEditMode,
    scrapToRender.id,
    isDirty,
    hasPendingBackgroundUpdate,
    isAutoSaveEnabled,
    upsertScrap,
  ]);

  // Auto-save only applies to already persisted scraps, so the toggle is offered
  // for those only (a brand-new, unsaved scrap has nothing to auto-save yet).
  const autoSaveActions = scrapToRender.id
    ? [ActionFactory.toggleAutoSave(isAutoSaveEnabled, setIsAutoSaveEnabled)]
    : [];

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (e.detail === 2) {
          setIsEditMode(true);
        }
      }}
      data-testid={"scrap-" + (scrapToRender.id || "new")}
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
        <TitleRow hasFocus={hasFocus}>
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
        </TitleRow>
      )}

      {scrapToRender.scrapType === ScrapType.List ? (
        <div style={{ marginTop: "2px" }}>
          <ScrapList editModeActions={autoSaveActions} />
        </div>
      ) : (
        <ScrapMarkdown
          editModeActions={[
            ...autoSaveActions,
            {
              onClick: () => {
                changeScrapType(
                  (notes ?? "")
                    .split("\n")
                    .filter((line) => !!(line ?? "").trim()),
                  ScrapType.List,
                );
              },
              key: "toggle-type",
              icon: <AutoFixHigh fontSize="small" />,
              label: "Change type to list",
            },
          ]}
        />
      )}
    </div>
  );

  function getText() {
    switch (scrapToRender.scrapType) {
      case ScrapType.Markdown:
        return notes;

      case ScrapType.List:
        return (JSON.parse(notes ?? "[]") as IScrapListItem[])[0]?.label;

      default:
        throw new Error(`Unknown scrap type ${scrapToRender.scrapType}`);
    }
  }
};
