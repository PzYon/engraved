import React from "react";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { AutogrowTextField } from "../../common/AutogrowTextField";
import { styled, Typography } from "@mui/material";
import { useScrapContext } from "./ScrapContext";
import { ScrapMarkdown } from "./markdown/ScrapMarkdown";
import { ScrapList } from "./list/ScrapList";
import { useDisplayModeContext } from "../../overview/overviewList/DisplayModeContext";

export const ScrapInner: React.FC = () => {
  const {
    isEditMode,
    setIsEditMode,
    title,
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
    >
      {isEditMode ? (
        <AutogrowTextField
          fieldType={"title"}
          placeholder={"Title"}
          variant="outlined"
          value={title}
          disabled={!isEditMode}
          onChange={(event) => setTitle(event.target.value)}
          onFocus={() => setHasTitleFocus(true)}
          onBlur={() => setHasTitleFocus(false)}
          sx={{ width: "100%" }}
        />
      ) : (
        <ReadonlyTitleContainer>{title}</ReadonlyTitleContainer>
      )}

      {isCompact && !hasFocus ? null : scrapToRender.scrapType ===
        ScrapType.List ? (
        <ScrapList />
      ) : (
        <ScrapMarkdown />
      )}
    </div>
  );
};

const ReadonlyTitleContainer = styled(Typography)`
  color: ${(p) => p.theme.palette.primary.main};
  font-size: 2rem;
  font-weight: 200;
  line-height: 1;
`;
