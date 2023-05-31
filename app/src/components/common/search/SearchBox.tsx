import React, { useEffect, useState } from "react";
import { IconButton, InputAdornment, styled, TextField } from "@mui/material";
import { usePageContext } from "../../layout/pages/PageContext";
import { Clear, SearchOutlined } from "@mui/icons-material";
import { DeviceWidth, useDeviceWidth } from "../useDeviceWidth";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";

export const SearchBox: React.FC = () => {
  const deviceWidth = useDeviceWidth();

  const { searchText, setSearchText, showFilters } = usePageContext();

  const [currentFieldValue, setCurrentFieldValue] = useState(searchText);

  useEffect(() => {
    setCurrentFieldValue(searchText);
  }, [searchText]);

  if (!showFilters) {
    return null;
  }

  return (
    <StyledTextField
      value={currentFieldValue ?? ""}
      onKeyUp={(event) => {
        if (event.key === "Enter") {
          setSearchText(currentFieldValue);
        }
      }}
      onChange={(event) => {
        setCurrentFieldValue(event.target.value);
      }}
      sx={getSx()}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlined fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: (
          <IconButton
            sx={{ visibility: currentFieldValue ? "visible" : "hidden" }}
            onClick={() => {
              setSearchText("");
              setCurrentFieldValue("");
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        ),
      }}
    />
  );

  function getSx(): SxProps<Theme> {
    const sx: SxProps<Theme> = {
      borderRadius: "30px",
      backgroundColor: "common.white",
      input: {
        p: 1,
      },
    };

    if (deviceWidth === DeviceWidth.Small) {
      sx.width = "100%";
    }

    return sx;
  }
};

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    border-radius: 30px;
  }

  fieldset {
    border-color: transparent;
  }
`;
