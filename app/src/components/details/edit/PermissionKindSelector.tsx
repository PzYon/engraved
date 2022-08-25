import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { PermissionKind } from "../../../serverApi/PermissionKind";

export const PermissionKindSelector: React.FC<{
  permissionKind: PermissionKind;
  onChange: (kind: PermissionKind) => void;
}> = ({ permissionKind, onChange }) => {
  return (
    <FormControl>
      <InputLabel id="permission-kind-label">Permission</InputLabel>
      <Select
        id="permission-kind"
        labelId="permission-kind-label"
        label={"Permission"}
        value={permissionKind.toString()}
        onChange={(event: SelectChangeEvent) => {
          // onChange(event.target.value);
        }}
      >
        <MenuItem value="bar">Bar</MenuItem>
        <MenuItem value="doughnut">Doughnut</MenuItem>
      </Select>
    </FormControl>
  );
};
