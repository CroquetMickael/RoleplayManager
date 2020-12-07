import React from "react";
import { render } from "@testing-library/react";
import {Tooltip} from "./Tooltip";

it("renders correctly", () => {
  const tree = render(<Tooltip>A tooltip</Tooltip>).container;
  expect(tree).toMatchSnapshot();
});
