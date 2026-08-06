import { IAction } from "./actions/IAction";

export interface IEditorImage {
  src: string;
  alt: string;
}

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

  // Both halves of one capability, so one prop rather than two. The editor knows how to place an
  // image, not where one comes from: uploading and whatever ends up owning the file stay with the
  // caller. onDropped therefore returns what to insert rather than inserting it, and setInsert hands
  // back the means to place one later - the editor owns its document, so nothing outside it can put
  // anything in by other means.
  images?: {
    onDropped: (files: File[]) => Promise<IEditorImage[]>;
    setInsert: (insert: (image: IEditorImage) => void) => void;
  };
}
