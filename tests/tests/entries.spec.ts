import { test } from "@playwright/test";
import { addNewJournal } from "../src/utils/addNewJournal";
import { login } from "../src/utils/login";
import { DeleteDialog } from "../src/poms/deleteDialog";

test.beforeEach(async ({ page }) => {
  await login(page, "measurements");
});

const value1 = "23";
const value2 = "19.5";

test("add new value journal, add some entries, delete entry", async ({
  page,
}) => {
  const journalPage = await addNewJournal(page, "Value", "Journal with values");

  await journalPage.addValue(value1);
  await journalPage.addValue(value2);

  await journalPage.validateNumberOfTableRows(2);
  await journalPage.expectTableCellToHaveValue(value1);
  await journalPage.expectTableCellToHaveValue(value2);

  const deleteEntryDialog: DeleteDialog =
    await journalPage.navigateToDeleteEntryDialog(1);
  await deleteEntryDialog.clickFirstDeleteButton();

  await journalPage.validateNumberOfTableRows(1);
});
