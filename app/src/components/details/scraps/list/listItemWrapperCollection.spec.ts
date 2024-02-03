import { ListItemWrapperCollection } from "./ListItemWrapperCollection";

describe("ListItemWrapperCollection", () => {
  describe("addItem", () => {
    it("should add first item", () => {
      new ListItemWrapperCollection([], (updatedItems) => {
        expect(updatedItems.length).toBe(1);
      }).addItem(0);
    });

    it("should add second item at end", () => {
      new ListItemWrapperCollection([createRandomItem()], (updatedItems) => {
        expect(updatedItems.length).toBe(2);
      }).addItem(1);
    });

    it("should add item in the middle", () => {
      new ListItemWrapperCollection(
        [createRandomItem(), createRandomItem(), createRandomItem()],
        (updatedItems) => {
          expect(updatedItems.length).toBe(4);
          expect(updatedItems[1].label).toBe("");
        },
      ).addItem(1);
    });

    it("should consider depth of parent", () => {
      new ListItemWrapperCollection(
        [createRandomItem(), createRandomItem("x", 1)],
        (updatedItems) => {
          expect(updatedItems.length).toBe(3);
          expect(updatedItems[0].depth).toBe(0);
          expect(updatedItems[1].depth).toBe(1);
          expect(updatedItems[2].depth).toBe(1);
        },
      ).addItem(2);
    });
  });

  describe("removeItem", () => {
    it("should remove item", () => {
      new ListItemWrapperCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(1);
          expect(updatedItems[0].label).toBe("b");
        },
      ).removeItem(0);
    });
  });

  describe("moveItem...", () => {
    it("...down: move item down", () => {
      new ListItemWrapperCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("b");
          expect(updatedItems[1].label).toBe("a");
        },
      ).moveItemDown(0);
    });

    it("...down: move last item to top", () => {
      new ListItemWrapperCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("b");
          expect(updatedItems[1].label).toBe("a");
        },
      ).moveItemDown(1);
    });

    it("...up: move item up", () => {
      new ListItemWrapperCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("b");
          expect(updatedItems[1].label).toBe("a");
        },
      ).moveItemUp(1);
    });

    it("...up: move first item to bottom", () => {
      new ListItemWrapperCollection(
        [createRandomItem("a"), createRandomItem("b")],
        (updatedItems) => {
          expect(updatedItems.length).toBe(2);
          expect(updatedItems[0].label).toBe("b");
          expect(updatedItems[1].label).toBe("a");
        },
      ).moveItemUp(0);
    });

    it("...right: move item right", () => {
      new ListItemWrapperCollection(
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
      new ListItemWrapperCollection(
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
      new ListItemWrapperCollection(
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
      new ListItemWrapperCollection(
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

function createRandomItem(label = "x", depth = 0) {
  return {
    label: label,
    isCompleted: false,
    depth: depth,
  };
}
