import { GoToTextField } from "./GoToTextField";
import {
  knownQueryParams,
  useEngravedSearchParams,
} from "../../common/actions/searchParamHooks";
import { useDebounced } from "../../common/useDebounced";
import { RefObject, useRef } from "react";
import { GoToSimple } from "./GoToSimple";
import { PageSection } from "../../layout/pages/PageSection";

export const GoTo: React.FC = () => {
  const { appendSearchParams, getSearchParam } = useEngravedSearchParams();
  const searchText = getSearchParam("q") ?? "";

  const debouncedSearchText = useDebounced(searchText);

  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  return (
    <PageSection>
      <GoToSimple
        searchText={debouncedSearchText}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            return;
          }

          inputRef?.current?.focus();
          appendSearchParams({
            [knownQueryParams.query]: getValue(searchText, e.key),
          });
        }}
        renderBeforeList={(selectItem) => (
          <GoToTextField
            initialValue={searchText}
            onChange={(value) => {
              appendSearchParams({ [knownQueryParams.query]: value });
            }}
            inputRef={inputRef}
            onDownKey={() => selectItem(0)}
          />
        )}
      />
    </PageSection>
  );
};

function getValue(value: string, key: string): string {
  if (key === "Backspace" || key === "Delete") {
    return value.substring(0, value.length - 1);
  } else if (key.length === 1) {
    return value + key;
  } else {
    // do nothing in case we don't know what ;)
    return value;
  }
}
