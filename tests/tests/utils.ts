import { expect, Page } from "@playwright/test";

export async function navigateToHome(page: Page) {
  await page.getByRole("link", { name: "engraved." }).click();

  await expect(page.getByRole("tab", { name: "Entries" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Journals" })).toBeVisible();
}

export async function addNewJournal(
  page: Page,
  name: string,
  typeLabel: "Value" | "Scraps",
) {
  await page.getByRole("link", { name: "Add journal" }).click();

  await page.getByLabel("Name").fill(name);

  if (typeLabel !== "Scraps") {
    await page.getByLabel("Journal Type").click();
    await page.getByText(typeLabel).click();
  }

  await page.getByLabel("Description").click();
  await page.getByLabel("Description").fill("This is my description");

  await page.getByRole("button", { name: "Create" }).click();

  await expect(page.getByRole("heading", { name: name })).toBeVisible();
}
