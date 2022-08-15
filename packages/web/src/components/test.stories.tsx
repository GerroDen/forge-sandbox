import React from "react";
import { Test } from "./test";

export default {
  component: Test,
};

export function Base() {
  return <Test foo={"hi"} />;
}

export function Is() {
  return <Test foo={"hi"} is />;
}

export function Children() {
  return (
    <Test foo={"hi"}>
      foooooo
      <strong>öööö</strong>
      bar
    </Test>
  );
}
