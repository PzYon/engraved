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

export const FunkyList: React.FC = () => {
  return (
    <div>
      {items.map((item, index) => {
        return (
          <div
            key={item.id}
            tabIndex={index}
            onFocusCapture={(e) => console.log("captured focus", item.id, e)}
            onFocus={() => console.log("on focus", item.id)}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};
