import { IJournalAttributes } from "../IJournalAttributes";
import { IJournalThresholds } from "../IJournalThresholds";
import { IJournalCustomProps } from "../IJournalCustomProps";

export interface IEditJournalCommand {
  journalId: string;
  name: string;
  description: string;
  notes: string;
  attributes: IJournalAttributes;
  thresholds: IJournalThresholds;
  customProps: IJournalCustomProps;
}
