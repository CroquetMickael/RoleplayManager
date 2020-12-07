import React from "react";
import { render } from "@testing-library/react";
import { Button } from "./Button";

it("renders correctly", () => {
  const tree = render(<Button>button children :)</Button>).container;
  expect(tree).toMatchSnapshot();
});
