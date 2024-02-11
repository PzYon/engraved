import React, { CSSProperties, useState } from "react";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { AutogrowTextField } from "../../common/AutogrowTextField";
import { ScrapListBody } from "./list/ScrapListBody";
import { ScrapMarkdownBody } from "./markdown/ScrapMarkdownBody";
import { styled, Typography } from "@mui/material";
import { useScrapContext } from "./ScrapContext";

export const ScrapInner: React.FC<{
  style?: CSSProperties;
  hasFocus?: boolean;
}> = ({ style, hasFocus }) => {
  const [hasTitleFocus, setHasTitleFocus] = useState(false);

  const { isEditMode, setIsEditMode, title, setTitle, scrapToRender } =
    useScrapContext();

  return (
    <div
      style={style}
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

      {scrapToRender.scrapType === ScrapType.List ? (
        <ScrapListBody hasTitleFocus={hasTitleFocus} hasFocus={hasFocus} />
      ) : (
        <ScrapMarkdownBody hasFocus={hasFocus} />
      )}
    </div>
  );
};

const ReadonlyTitleContainer = styled(Typography)`
  color: ${(p) => p.theme.palette.primary.main};
  font-size: 2rem;
  font-weight: 200;
`;
