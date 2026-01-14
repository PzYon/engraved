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
}
