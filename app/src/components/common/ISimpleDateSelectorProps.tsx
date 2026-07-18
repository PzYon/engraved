export interface ISimpleDateSelectorProps {
  setDate: (date: Date | null) => void;
  date: Date | undefined;
  label?: string;
  hasFocus?: boolean;
  shouldDisableDate?: (date: Date) => boolean;
}
