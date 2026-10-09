import React from "react";
import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { AppContextProvider } from "./AppContextProvider";
import { IAppContext, useAppAlert, useAppContext } from "./AppContext";
import { IUser } from "./serverApi/IUser";

describe("AppContextProvider", () => {
  // Nearly every component uses the app context, so one that changed with
  // every alert would re-render nearly everything on screen.
  it("does not re-render users of the app context when an alert is shown", () => {
    const rendered = vi.fn();
    let appContext: IAppContext | undefined;

    const AppContextUser = () => {
      appContext = useAppContext();
      rendered();
      return null;
    };

    const AlertReader = () => <div>{useAppAlert()?.title}</div>;

    render(
      <AppContextProvider user={{ id: "user-id" } as IUser}>
        <AppContextUser />
        <AlertReader />
      </AppContextProvider>,
    );

    rendered.mockClear();

    act(() => appContext!.setAppAlert({ title: "Saved", type: "success" }));

    expect(screen.getByText("Saved")).toBeTruthy();
    expect(rendered).not.toHaveBeenCalled();
  });
});
