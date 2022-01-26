import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("contains title", () => {
  render(<App />);
  const title = screen.getByText(/Metrix/i);
  expect(title).toBeInTheDocument();
});
