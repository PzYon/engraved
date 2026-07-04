import { ListItemCollection } from "./ListItemCollection";

describe("ListItemCollection", () => {
  describe("addItem", () => {
    it("should add first item", () => {
      new ListItemCollection([], (updatedItems) => {
        expect(updatedItems.length).toBe(1);
      }).addItem(0);
    });

    it("should add second item at end", () => {
      new ListItemCollection([createRandomItem()], (updatedItems) => {
        expect(updatedItems.length).toBe(2);
      }).addItem(0);
    });

    it("should add item in the middle", () => {
      new ListItemCollection(
        [createRandomItem(), createRandomItem(), createRandomItem()],
        (updatedItems) => {
          expect(updatedItems.length).toBe(4);
          expect(updatedItems[2].label).toBe("");
        },
      ).addItem(1);
    });

    it("should consider depth of parent", () => {
      new ListItemCollection(
        [createRandomItem(), createRandomItem("x", 1)],
        (updatedItems) => {
          expect(updatedItems.length).toBe(3);
          expect(updatedItems[0].depth).toBe(0);
          expect(updatedItems[1].depth).toBe(1);
          expect(updatedItems[2].depth).toBe(1);
        },
      ).addItem(1);
    });
  });

  describe("removeItem", () => {
    it("should remove item", () => {
      new ListItemCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(1);
          expect(updatedItems[0].label).toBe("b");
        },
      ).removeItem(0);
    });
  });

  describe("deleteAllChecked", () => {
    it("should keep an empty line when all items are deleted", () => {
      const collection = new ListItemCollection(
        [createRandomItem("a", 0, true), createRandomItem("b", 0, true)],
        () => {},
      );

      collection.deleteAllChecked();

      expect(collection.items.length).toBe(1);
      expect(collection.items[0].label).toBe("");
    });

    it("should not add an empty line when items remain", () => {
      const collection = new ListItemCollection(
        [createRandomItem("a", 0, true), createRandomItem("b")],
        () => {},
      );

      collection.deleteAllChecked();

      expect(collection.items.length).toBe(1);
      expect(collection.items[0].label).toBe("b");
    });
  });

  describe("ensureNotEmpty", () => {
    it("should add an empty line to an empty collection", () => {
      const collection = new ListItemCollection([], () => {});

      collection.ensureNotEmpty();

      expect(collection.items.length).toBe(1);
      expect(collection.items[0].label).toBe("");
    });

    it("should not change a non-empty collection", () => {
      let wasChanged = false;
      const collection = new ListItemCollection([createRandomItem("a")], () => {
        wasChanged = true;
      });

      collection.ensureNotEmpty();

      expect(collection.items.length).toBe(1);
      expect(collection.items[0].label).toBe("a");
      expect(wasChanged).toBe(false);
    });
  });

  describe("moveItem...", () => {
    it("...down: move item down", () => {
      new ListItemCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("b");
          expect(updatedItems[1].label).toBe("a");
        },
      ).moveItemDown(0);
    });

    it("...down: move last item to top", () => {
      new ListItemCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("b");
          expect(updatedItems[1].label).toBe("a");
        },
      ).moveItemDown(1);
    });

    it("...up: move item up", () => {
      new ListItemCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("b");
          expect(updatedItems[1].label).toBe("a");
        },
      ).moveItemUp(1);
    });

    it("...up: move first item to bottom", () => {
      new ListItemCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("b");
          expect(updatedItems[1].label).toBe("a");
        },
      ).moveItemUp(0);
    });

    it("...right: move item right", () => {
      new ListItemCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("a");
          expect(updatedItems[0].depth).toBe(0);
          expect(updatedItems[1].label).toBe("b");
          expect(updatedItems[1].depth).toBe(1);
        },
      ).moveItemRight(1);
    });

    it("...right: not move item right to depth >=+1 of parent", () => {
      new ListItemCollection(
        [createRandomItem("a"), createRandomItem("b", 1)],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("a");
          expect(updatedItems[0].depth).toBe(0);
          expect(updatedItems[1].label).toBe("b");
          expect(updatedItems[1].depth).toBe(1);
        },
      ).moveItemRight(1);
    });

    it("...left: move item left", () => {
      new ListItemCollection(
        [createRandomItem("a"), createRandomItem("b", 1)],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("a");
          expect(updatedItems[0].depth).toBe(0);
          expect(updatedItems[1].label).toBe("b");
          expect(updatedItems[1].depth).toBe(0);
        },
      ).moveItemLeft(1);
    });

    it("...left: not move item left to depth <0", () => {
      new ListItemCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("a");
          expect(updatedItems[0].depth).toBe(0);
          expect(updatedItems[1].label).toBe("b");
          expect(updatedItems[1].depth).toBe(0);
        },
      ).moveItemLeft(1);
    });
  });
});

function createRandomItem(label = "x", depth = 0, isCompleted = false) {
  return {
    label: label,
    isCompleted: isCompleted,
    depth: depth,
  };
}
