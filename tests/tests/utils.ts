import { Page } from "@playwright/test";

export async function addNewJournal(
  page: Page,
  name: string,
  typeLabel: "Value" | "Scraps",
) {
  await page.getByLabel("Add journal").nth(2).click();

  await page.getByLabel("Name").fill(name);

  if (typeLabel !== "Scraps") {
    await page.getByLabel("Journal Type").click();
    await page.getByText(typeLabel).click();
  }

  await page.getByLabel("Description").click();
  await page.getByLabel("Description").fill("This is my description");

  await page.getByRole("button", { name: "Create" }).click();
}
