import React from "react";
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

const onIsPlainTextChange = vi.fn();

const Editor: React.FC<{
  initialValue: string;
  initialIsPlainText?: boolean;
}> = ({ initialValue, initialIsPlainText }) => {
  return (
    <LazyRichTextEditor
      initialValue={initialValue}
      setValue={setValue}
      initialIsPlainText={initialIsPlainText}
      onIsPlainTextChange={onIsPlainTextChange}
      showFormattingOptions={true}
    />
  );
};

describe("LazyRichTextEditor", () => {
  beforeEach(() => {
    setValue.mockClear();
    onIsPlainTextChange.mockClear();
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

  it("tells the caller what it was switched to", () => {
    render(<Editor initialValue={"text"} />);

    switchMode("Plain text is off");
    expect(onIsPlainTextChange).toHaveBeenLastCalledWith(true);

    switchMode("Plain text is on");
    expect(onIsPlainTextChange).toHaveBeenLastCalledWith(false);
  });

  it("can be switched without a caller that wants to know", () => {
    render(
      <LazyRichTextEditor
        initialValue={"some **bold** text"}
        setValue={setValue}
        showFormattingOptions={true}
      />,
    );

    switchMode("Plain text is off");

    expect(getEditor().textContent).toBe("some **bold** text");
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
