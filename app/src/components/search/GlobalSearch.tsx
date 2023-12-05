import React from "react";
import { usePageContext } from "../layout/pages/PageContext";
import { useSearchEntitiesQuery } from "../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { ISearchEntitiesResult } from "../../serverApi/ISearchEntitiesResult";

export const GlobalSearch: React.FC = () => {
  const { searchText } = usePageContext();
  const result: ISearchEntitiesResult = useSearchEntitiesQuery(searchText);

  return (
    <div>
      {JSON.stringify(result)}
      <br />
      {result.entities.map((e) => {
        return <div key={e.entity.id}>{e.entityType}</div>;
      })}
    </div>
  );
};
