import { IJournalAttributes } from "../IJournalAttributes";
import { IJournalThresholdDefinitions } from "../IJournalThresholdDefinitions";
import { IJournalCustomProps } from "../IJournalCustomProps";

export interface IEditJournalCommand {
  journalId: string;
  name: string;
  description: string;
  notes: string;
  attributes: IJournalAttributes;
  thresholds: IJournalThresholdDefinitions;
  customProps: IJournalCustomProps;
}
