import { BasePage } from "./basePage";
import { expect, Locator } from "@playwright/test";

export abstract class OverviewPage extends BasePage {
  // --- items ---

  items(): Locator {
    return this.page.locator("ul.overview-list > li.overview-list-item");
  }

  async expectToShowNEntities(number: number) {
    await expect(this.items()).toHaveCount(number);
  }

  async expectItemVisible(name: string) {
    await expect(this.itemByName(name)).toBeVisible();
  }

  async expectItemHidden(name: string) {
    await expect(this.itemByName(name)).toBeHidden();
  }

  // --- cursor navigation ---

  // Keys are dispatched to the focused element. Before anything is selected
  // that is the document body; once an item is selected it is the focused
  // <li>. Both are handled by the global OverviewList hotkey listener.

  async arrowDown() {
    await this.page.keyboard.press("ArrowDown");
  }

  async arrowUp() {
    await this.page.keyboard.press("ArrowUp");
  }

  async typeToFilter(text: string) {
    await this.page.keyboard.type(text);
  }

  async pressBackspace() {
    await this.page.keyboard.press("Backspace");
  }

  async pressEscape() {
    await this.page.keyboard.press("Escape");
  }

  // Items render in list (index) order, so focus is asserted by position.
  async expectFocusedItem(index: number) {
    await expect(this.items().nth(index)).toBeFocused();
  }

  private itemByName(name: string): Locator {
    return this.page.locator("ul.overview-list > li.overview-list-item", {
      hasText: name,
    });
  }
}
