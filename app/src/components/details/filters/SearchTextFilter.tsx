import React from "react";
import { useJournalContext } from "../JournalContext";
import { SearchBox } from "../../common/search/SearchBox";

export const SearchTextFilter: React.FC = () => {
  const { searchText, setSearchText } = useJournalContext();

  return <SearchBox searchText={searchText} setSearchText={setSearchText} />;
};
