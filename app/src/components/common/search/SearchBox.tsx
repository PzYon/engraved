import React, { useEffect, useState } from "react";
import { FormControl, IconButton, TextField } from "@mui/material";
import { usePageContext } from "../../layout/pages/PageContext";
import { Clear, SearchOutlined } from "@mui/icons-material";

export const SearchBox: React.FC = () => {
  const { searchText, setSearchText, showFilters } = usePageContext();

  const [currentFieldValue, setCurrentFieldValue] = useState(searchText);

  useEffect(() => {
    setCurrentFieldValue(searchText);
  }, [searchText]);

  if (!showFilters) {
    return null;
  }

  return (
    <FormControl margin="dense">
      <TextField
        value={currentFieldValue ?? ""}
        label="Search"
        placeholder="Search"
        autoFocus={true}
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            setSearchText(currentFieldValue);
          }
        }}
        onChange={(event) => {
          setCurrentFieldValue(event.target.value);
        }}
        sx={{ width: "100%" }}
        InputProps={{
          endAdornment: (
            <>
              <IconButton
                sx={{ visibility: currentFieldValue ? "visible" : "hidden" }}
                onClick={() => {
                  setSearchText("");
                  setCurrentFieldValue("");
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setSearchText(currentFieldValue);
                }}
              >
                <SearchOutlined fontSize="small" />
              </IconButton>
            </>
          ),
        }}
      />
    </FormControl>
  );
};
