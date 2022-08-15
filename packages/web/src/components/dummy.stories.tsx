import React from "react";
import { Dummy } from "@/components/dummy";

export default {
  component: Dummy,
};

export function Base() {
  return <Dummy foo={"hi"} />;
}

export function Is() {
  return <Dummy foo={"hi"} is />;
}

export function Children() {
  return (
    <Dummy foo={"hi"}>
      foooooo
      <strong>öööö</strong>
      bar
    </Dummy>
  );
}
