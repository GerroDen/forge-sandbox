import React from "react";
import { ComponentMeta } from "@storybook/react";
import { ForgeBridgeLink } from "@/components/ForgeBridgeLink";

export default {
  component: ForgeBridgeLink,
} as ComponentMeta<typeof ForgeBridgeLink>;

export function Example() {
  return <ForgeBridgeLink href="/somewhere">Click Me!</ForgeBridgeLink>;
}

export function FullUrl() {
  return (
    <ForgeBridgeLink href="https://google.com">
      https://google.com
    </ForgeBridgeLink>
  );
}

export function NewWindow() {
  return (
    <ForgeBridgeLink href="https://google.com" newWindow>
      https://google.com
    </ForgeBridgeLink>
  );
}

export function OverrideOnClick() {
  const onClick = () => window.alert("Overridden onClick");
  return (
    <ForgeBridgeLink href="https://google.com" onClick={onClick}>
      https://google.com
    </ForgeBridgeLink>
  );
}
