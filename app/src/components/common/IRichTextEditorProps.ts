import { IAction } from "./actions/IAction";

export interface IRichTextEditorProps {
  setGiveFocus?: (giveFocus: () => void) => void;
  initialValue?: string;
  setValue: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onKeyUp?: (e: KeyboardEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  css?: React.CSSProperties;
  isTitle?: boolean;
  showFormattingOptions?: boolean;
  editModeActions?: IAction[];

  // Called when images are pasted or dropped into the editor. The editor knows how to place an
  // image, not where one comes from - uploading, and whatever owns the result, stays with the
  // caller, which is also why this returns the sources to insert rather than taking them.
  onInsertImages?: (files: File[]) => Promise<{ src: string; alt: string }[]>;
}
