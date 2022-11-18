import React from "react";
import { ComponentMeta } from "@storybook/react";
import { ForgeBridgeLink } from "@/components/ForgeBridgeLink";
import { Product } from "@/lib/forge-context";

export default {
  component: ForgeBridgeLink,
} as ComponentMeta<typeof ForgeBridgeLink>;

export function Example() {
  return (
    <ForgeBridgeLink href="/somewhere" product={Product.jira}>
      Click Me!
    </ForgeBridgeLink>
  );
}

export function FullUrl() {
  return (
    <ForgeBridgeLink href="https://google.com" product={Product.jira}>
      https://google.com
    </ForgeBridgeLink>
  );
}

export function NewWindow() {
  return (
    <ForgeBridgeLink href="https://google.com" product={Product.jira} newWindow>
      https://google.com
    </ForgeBridgeLink>
  );
}

export function OverrideOnClick() {
  const onClick = () => window.alert("Overridden onClick");
  return (
    <ForgeBridgeLink
      href="https://google.com"
      product={Product.jira}
      onClick={onClick}
    >
      https://google.com
    </ForgeBridgeLink>
  );
}
