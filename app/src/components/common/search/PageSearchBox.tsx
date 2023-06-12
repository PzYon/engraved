import React from "react";
import { usePageContext } from "../../layout/pages/PageContext";
import { SearchBox } from "./SearchBox";

export const PageSearchBox: React.FC = () => {
  const { searchText, setSearchText, showFilters } = usePageContext();

  if (!showFilters) {
    return null;
  }

  return <SearchBox searchText={searchText} setSearchText={setSearchText} />;
};
