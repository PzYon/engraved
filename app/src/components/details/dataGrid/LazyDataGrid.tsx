import React from "react";
import {
  DataGrid as XDataGrid,
  GridColDef,
  GridRowsProp,
} from "@mui/x-data-grid";
import { IDataGridProps } from "./IDataGridProps";
import styled from "styled-components";
import { format } from "date-fns";

const LazyDataGrid: React.FC<IDataGridProps> = ({ measurements }) => {
  const rows: GridRowsProp = measurements.map((m) => ({
    id: m.dateTime,
    col1: format(new Date(m.dateTime), "dd.LL.yyyy kk:mm:ss"),
    col2: m.value,
  }));

  const columns: GridColDef[] = [
    { field: "col1", headerName: "Date", width: 300 },
    { field: "col2", headerName: "Value" },
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
