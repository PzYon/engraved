import { useCallback, useEffect, useState } from "react";
import { Typer } from "./Typer";

export const Typing = (props: { textToType: string }) => {
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    const typer = new Typer(props.textToType, setCurrentValue);
    typer.start();

    return typer.end;
  }, []);

  return <>{currentValue}</>;
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
