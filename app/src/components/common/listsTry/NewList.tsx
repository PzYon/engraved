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

export const NewList: React.FC = () => {
  return (
    <div>
      <h2>New List</h2>
      {items.map((item) => {
        return <div key={item.id}>{item.label}</div>;
      })}
    </div>
  );
};
