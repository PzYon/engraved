import React, { useState } from "react";
import { InputAdornment, styled, TextField } from "@mui/material";
import { usePageContext } from "./pages/PageContext";
import { SearchOutlined } from "@mui/icons-material";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";

export const SearchBox: React.FC = () => {
  const deviceWidth = useDeviceWidth();

  const { searchText, setSearchText, showSearchBox } = usePageContext();

  const [currentFieldValue, setCurrentFieldValue] = useState(searchText);

  if (!showSearchBox) {
    return null;
  }

  return (
    <StyledTextField
      defaultValue={searchText}
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
      sx.mt = 2;
    }

    return sx;
  }
};

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    border-radius: 30px;
  }
`;
