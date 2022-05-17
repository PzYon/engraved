import { render } from "@testing-library/react";
import { App } from "./App";

test("placeholder test (that doesn't fail)", () => {
  render(
    <App
      user={{
        name: "Gebhard",
        imageUrl: "https://www.foo.ch/gebhard.jpg",
        id: "1234",
      }}
    />
  );
});
