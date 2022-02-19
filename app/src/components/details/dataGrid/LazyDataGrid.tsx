import React from "react";
import {
  DataGrid as XDataGrid,
  GridColDef,
  GridRowsProp,
} from "@mui/x-data-grid";
import { IDataGridProps } from "./IDataGridProps";
import styled from "styled-components";
import { format } from "date-fns";
import { translations } from "../../../i18n/translations";

enum ColumnName {
  Date = "date",
  Value = "value",
  Notes = "notes",
}

const LazyDataGrid: React.FC<IDataGridProps> = ({ measurements }) => {
  const rows: GridRowsProp = measurements.map((m) => ({
    id: m.dateTime,
    [ColumnName.Date]: format(new Date(m.dateTime), "dd.LL.yyyy kk:mm:ss"),
    [ColumnName.Value]: m.value,
    [ColumnName.Notes]: m.notes,
  }));

  const columns: GridColDef[] = [
    {
      field: ColumnName.Date,
      headerName: translations.columnName_date,
      width: 300,
    },
    { field: ColumnName.Value, headerName: translations.columnName_value },
    {
      field: ColumnName.Notes,
      headerName: translations.columnName_notes,
      width: 500,
    },
  ];

  return (
    <Host>
      <XDataGrid rows={rows} columns={columns} autoHeight={true} />
    </Host>
  );
};

export default LazyDataGrid;

const Host = styled.div`
  .MuiDataGrid-footerContainer {
    display: none;
  }
`;
