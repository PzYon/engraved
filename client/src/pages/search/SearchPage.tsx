import * as React from "react";
import styled from "styled-components";
import { useTheme } from "../../common/Hooks";
import { Page } from "../Page";
import { GlobalSearchBox } from "./GlobalSearchBox";
import { ItemsList } from "./results/ItemsList";

export const SearchPage = () => {
  const theme = useTheme();

  return (
    <Page noCloser={true} backgroundColor={theme.colors.rootPageBackground}>
      <SearchContainerDiv key={"searchBox"}>
        <SearchInnerContainerDiv>
          <GlobalSearchBox />
        </SearchInnerContainerDiv>
      </SearchContainerDiv>
      <ItemsList key={"results"} />
    </Page>
  );
};

const SearchContainerDiv = styled.div`
  text-align: center;
  margin: 1rem 0;
  width: 100%;
`;

const SearchInnerContainerDiv = styled.div`
  width: 100%;
  max-width: 500px;
  display: inline-block;
  position: relative;
`;
