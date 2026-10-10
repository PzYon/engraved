export interface IScratchpad {
  content: string;
  // Never set for a scratchpad that has not been saved yet.
  editedOn?: string;
}
