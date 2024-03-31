import { IEntity } from "../../../serverApi/IEntity";
import { useCollection } from "../../common/wrappers/useCollection";
import { JournalWrapperCollection } from "../JournalWrapperCollection";
import { NavigatableListItem } from "./NavigatableListItem";

export const NavigatableList: React.FC<{
  items: IEntity[];
  renderItem: (
    item: IEntity,
    index: number,
    isFocused: boolean,
  ) => React.ReactNode;
}> = ({ items, renderItem }) => {
  const { collection, addItem } = useCollection(
    (focusIndex, setFocusIndex) =>
      new JournalWrapperCollection(focusIndex, setFocusIndex),
    [items],
  );

  return (
    <>
      {items.map((item, index) => {
        return (
          <NavigatableListItem
            index={index}
            key={item.id}
            onClick={() => collection.setFocus(index)}
            addWrapperItem={addItem}
            item={item}
          >
            {renderItem(item, index, index === collection.currentIndex)}
          </NavigatableListItem>
        );
      })}
    </>
  );
};
