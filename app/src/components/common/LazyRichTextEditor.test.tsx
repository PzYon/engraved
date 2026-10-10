import React, { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import LazyRichTextEditor from "./LazyRichTextEditor";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  useSearch: ({ select }: { select: (search: object) => unknown }) =>
    select({}),
}));

class IntersectionObserverStub {
  observe = vi.fn();
  disconnect = vi.fn();
}

const setValue = vi.fn();

const Editor: React.FC<{
  initialValue: string;
  initialIsPlainText?: boolean;
  canSwitch?: boolean;
}> = ({ initialValue, initialIsPlainText = false, canSwitch = true }) => {
  const [isPlainText, setIsPlainText] = useState(initialIsPlainText);

  return (
    <LazyRichTextEditor
      initialValue={initialValue}
      setValue={setValue}
      isPlainText={isPlainText}
      onIsPlainTextChange={canSwitch ? setIsPlainText : undefined}
      showFormattingOptions={true}
    />
  );
};

describe("LazyRichTextEditor", () => {
  beforeEach(() => {
    setValue.mockClear();
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the markdown itself after switching to plain text", () => {
    render(<Editor initialValue={"some **bold** text"} />);

    expect(getEditor().querySelector("strong")?.textContent).toBe("bold");

    switchMode("Plain text is off");

    expect(getEditor().querySelector("strong")).toBeNull();
    expect(getEditor().textContent).toBe("some **bold** text");
  });

  it("reads plain text as markdown after switching back", () => {
    render(
      <Editor initialValue={"some **bold** text"} initialIsPlainText={true} />,
    );

    expect(getEditor().textContent).toBe("some **bold** text");

    switchMode("Plain text is on");

    expect(getEditor().querySelector("strong")?.textContent).toBe("bold");
  });

  it("does not change the value by switching", () => {
    render(<Editor initialValue={"some **bold** text"} />);

    switchMode("Plain text is off");
    switchMode("Plain text is on");

    expect(setValue).not.toHaveBeenCalled();
  });

  it("offers the formatting options for markdown only", () => {
    render(<Editor initialValue={"text"} />);

    expect(screen.queryByLabelText("Bold")).toBeTruthy();

    switchMode("Plain text is off");

    expect(screen.queryByLabelText("Bold")).toBeNull();
  });

  it("does not offer switching unless asked to", () => {
    render(<Editor initialValue={"text"} canSwitch={false} />);

    expect(screen.queryByLabelText("Plain text is off")).toBeNull();
    expect(screen.queryByLabelText("Bold")).toBeTruthy();
  });
});

function getEditor() {
  return screen.getByRole("textbox").querySelector(".ProseMirror")!;
}

function switchMode(label: string) {
  act(() => {
    fireEvent.click(screen.getByLabelText(label));
  });
}
