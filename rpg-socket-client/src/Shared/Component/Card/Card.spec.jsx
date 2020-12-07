import React from "react";
import { render } from "@testing-library/react";
import { Card } from "./Card";

it("renders correctly a vertical Card with left, right text", () => {
  const tree = render(
    <Card
      isVertical={true}
      leftSidetext={"lefttext"}
      rightSideText={"righttext"}
    >
      children
    </Card>
  ).container;
  expect(tree).toMatchSnapshot();
});

it("renders correctly a vertical Card without left, right text", () => {
  const tree = render(<Card isVertical={true}>children</Card>).container;
  expect(tree).toMatchSnapshot();
});

it("renders correctly a non vertical Card with left, right text", () => {
  const tree = render(
    <Card
      isVertical={false}
      leftSidetext={"lefttext"}
      rightSideText={"righttext"}
    >
      children
    </Card>
  ).container;
  expect(tree).toMatchSnapshot();
});

it("renders correctly a non vertical Card without left, right text", () => {
  const tree = render(<Card isVertical={false}>children</Card>).container;
  expect(tree).toMatchSnapshot();
});
