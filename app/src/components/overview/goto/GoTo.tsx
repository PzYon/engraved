import { TextField } from "@mui/material";
import { useRef, useState } from "react";
import { useSearchEntitiesQuery } from "../../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { PageSection } from "../../layout/pages/PageSection";
import { OverviewList } from "../overviewList/OverviewList";
import { OverviewItemCollection } from "../overviewList/wrappers/OverviewItemCollection";
import { useHotkeys } from "react-hotkeys-hook";

export const GoTo: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  useHotkeys("alt+up", () => {
    console.log("alt+up");
  });

  const result = useSearchEntitiesQuery(searchText);

  return (
    <PageSection>
      <OverviewList
        items={result?.entities?.map((entity) => entity.entity) ?? []}
        renderBeforeList={(collection: OverviewItemCollection) => {
          return (
            <SearchField
              collection={collection}
              value={searchText}
              onChange={setSearchText}
            />
          );
        }}
        renderItem={(entity) => <div>{renderItem(entity)}</div>}
      />
    </PageSection>
  );

  function renderItem(entity: IEntity) {
    // this is a temporary hack! should be something like:
    // if (item.entityType === "Entry") {
    if ((entity as IJournal).type) {
      return (entity as IJournal).name;
    }

    return (entity as IScrapEntry).title || `Entry: ${entity.id}`;
  }
};

const SearchField: React.FC<{
  collection: OverviewItemCollection;
  value: string;
  onChange: (text: string) => void;
}> = ({ collection, value, onChange }) => {
  const textFieldRef = useRef<HTMLInputElement>(undefined);

  useHotkeys("alt+down", () => {
    console.log("alt+down");
    collection.setFocus(0);
  });

  return (
    <TextField
      inputRef={textFieldRef}
      value={value}
      id={Math.random().toString()}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      style={{ width: "100%" }}
    />
  );
};
