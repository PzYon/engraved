import React, { useEffect, useState } from "react";
import { Typer } from "./Typer";

export const Typing = (props: {
  textToType: string;
  renderOnComplete: React.ReactNode;
}) => {
  const [currentValue, setCurrentValue] = useState<React.ReactNode>("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const typer = new Typer(props.textToType, setCurrentValue);
    typer.start().then(() => setIsComplete(true));

    return () => typer.end();
  }, []);

  return (
    <>
      {currentValue}
      {isComplete ? props.renderOnComplete : null}
    </>
  );
};
