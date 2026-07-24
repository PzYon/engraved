// Migration for issue #2977: backfill the missing UserId on auto-created
// "Quick Scraps" journals.
//
// Background:
//   The first-login flow used to create the "Quick Scraps" journal *before* a
//   brand-new user had been assigned an Id, so the journal was persisted with
//   UserId = null and became invisible to its owner. The owning user is the one
//   whose FavoriteJournalIds still references the orphaned journal.
//
// What it does:
//   1. find all "Quick Scraps" journals where UserId is null (metrics collection)
//   2. for each, find the user whose FavoriteJournalIds contains that journal id
//   3. set the journal's UserId to that user's id
//
// Usage (mongosh):
//   Preview (default, no writes):
//     mongosh "<connection-string>/metrix_test" scripts/migrations/2977-backfill-quick-scraps-userid.js
//   Apply:
//     mongosh "<connection-string>/metrix_test" --eval "DRY_RUN=false" scripts/migrations/2977-backfill-quick-scraps-userid.js

// Default to a dry run so the script is safe to run as-is. Override with
// --eval "DRY_RUN=false".
if (typeof DRY_RUN === "undefined") {
  var DRY_RUN = true;
}

const journals = db.getCollection("metrics");
const users = db.getCollection("users");

// { UserId: null } matches both an explicit null and a missing field.
const orphans = journals.find({ UserId: null, Name: "Quick Scraps" }).toArray();

print(
  `Found ${orphans.length} orphaned "Quick Scraps" journal(s) with a null UserId.`,
);

let updated = 0;
const unmatched = [];

orphans.forEach((journal) => {
  const journalId = journal._id.toString();

  // FavoriteJournalIds stores journal ids as their hex string.
  const owner = users.findOne({ FavoriteJournalIds: journalId });

  if (!owner) {
    unmatched.push(journalId);
    return;
  }

  const ownerId = owner._id.toString();

  print(`  journal ${journalId} -> user ${ownerId} (${owner.Name})`);

  if (!DRY_RUN) {
    journals.updateOne({ _id: journal._id }, { $set: { UserId: ownerId } });
  }

  updated++;
});

print(
  DRY_RUN
    ? `DRY RUN: would update ${updated} journal(s). Re-run with --eval "DRY_RUN=false" to apply.`
    : `Updated ${updated} journal(s).`,
);

if (unmatched.length > 0) {
  print(
    `WARNING: ${unmatched.length} journal(s) are not referenced by any user's ` +
      `FavoriteJournalIds and were left unchanged:`,
  );
  unmatched.forEach((id) => print(`  ${id}`));
}
