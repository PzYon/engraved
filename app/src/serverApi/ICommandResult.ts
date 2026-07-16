export interface ICommandResult {
  entityId: string;
  // true when the command was accepted but deliberately not applied, because it targeted an
  // entity that no longer exists (e.g. an offline edit replayed after the entry was deleted).
  discarded?: boolean;
}
