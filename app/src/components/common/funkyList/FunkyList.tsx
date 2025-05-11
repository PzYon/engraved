import { useEffect, useState } from "react";

const items = [
  {
    id: "a",
    label: "Foo",
  },
  {
    id: "b",
    label: "Bar",
  },
  {
    id: "c",
    label: "Baz",
  },
];

function giveFocusToElement(id: string) {
  document.getElementById("funky-list-" + id).focus();
}

export const FunkyList: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState<string>(undefined);

  useEffect(() => {
    console.log("active item id", activeItemId);
  }, [activeItemId]);

  return (
    <div>
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <div
            id={"funky-list-" + item.id}
            key={item.id}
            tabIndex={index}
            onFocus={() => {
              console.log("on focus", item.id);
              setActiveItemId(item.id);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "ArrowDown" && isLast) {
                giveFocusToElement(items[0].id);
              } else if (e.key === "ArrowUp" && isFirst) {
                giveFocusToElement(items[items.length - 1].id);
              }
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};
