import React, { Suspense } from "react";
import { IDataGridProps } from "./IDataGridProps";

export const DataGrid: React.FC<IDataGridProps> = (props: IDataGridProps) => {
  const LazyDataGrid = React.lazy(() => import("./LazyDataGrid"));

  return (
    <Suspense fallback={<div />}>
      <LazyDataGrid {...props} />
    </Suspense>
  );
};
