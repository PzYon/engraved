export interface ICleanupUserTagsCommandResult {
  affectedUserIds: string[];
  dryRun: boolean;
  entityId: string;
  journalIdsToRemove: string[];
}
