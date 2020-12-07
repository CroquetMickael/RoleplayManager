import React from "react";
import { render } from "@testing-library/react";
import { ErrorForm } from "./ErrorForm";

it("renders correctly", () => {
  const tree = render(<ErrorForm>error</ErrorForm>).container;
  expect(tree).toMatchSnapshot();
});
