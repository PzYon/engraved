import { render } from "@testing-library/react";
import { App } from "./App";

test("placeholder test (that doesn't fail)", () => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: (): object => null,
    unobserve: (): object => null,
    disconnect: (): object => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;

  render(
    <App
      user={{
        name: "gebhard@gmail.com",
        displayName: "Gebhard",
        imageUrl: "https://www.foo.ch/gebhard.jpg",
        id: "1234",
        favoriteMetricIds: ["123"],
      }}
    />
  );
});
