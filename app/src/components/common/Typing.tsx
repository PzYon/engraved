import { useCallback, useEffect, useState } from "react";
import { Typer } from "./Typer";
import { useTheme } from "@mui/material";

export const Typing = (props: { textToType: string }) => {
  const [currentValue, setCurrentValue] = useState("");
  const [isCursorVisible, toggleIsCursorVisible] = useFlag(true);
  const theme = useTheme();

  useEffect(() => {
    const typer = new Typer(
      props.textToType,
      setCurrentValue,
      toggleIsCursorVisible
    );
    typer.start();

    return typer.end;
  }, []);

  return (
    <span
      style={
        isCursorVisible
          ? { borderRight: `2px solid ${theme.palette.common.white}` }
          : null
      }
    >
      {currentValue}
    </span>
  );
};

// thanks to https://github.com/streamich/react-use/blob/master/src/useToggle.ts
export const useFlag = (
  initialValue: boolean
): [boolean, (nextValue?: unknown) => void] => {
  const [flag, setFlag] = useState<boolean>(initialValue);

  const toggleFlag = useCallback(
    (nextValue?: unknown) => {
      if (typeof nextValue === "boolean") {
        setFlag(nextValue);
      } else {
        setFlag((currentValue) => !currentValue);
      }
    },
    [setFlag]
  );

  return [flag, toggleFlag];
};
