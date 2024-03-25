import React, { useEffect, useState } from "react";
import { Typer } from "./Typer";

export const Typing = (props: {
  textToType: string;
  renderOnComplete: React.ReactNode;
  noTypos?: boolean;
}) => {
  const [currentValue, setCurrentValue] = useState<React.ReactNode>("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const typer = new Typer(
      props.textToType,
      setCurrentValue,
      undefined,
      props.noTypos ? 0 : 0.05,
    );
    typer.start().then(() => setIsComplete(true));

    return () => typer.end();
  }, [props.textToType, props.noTypos]);

  return (
    <>
      {currentValue}
      {isComplete ? props.renderOnComplete : null}
    </>
  );
};
