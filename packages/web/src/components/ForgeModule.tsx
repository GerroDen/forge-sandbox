import { ReactChild } from "react";

interface Props {
  moduleKey: string;
  element: ReactChild;
}

/**
 * Used inside `ForgeModules` to define different application modules.
 */
export function ForgeModule(_props: Props): null {
  throw new Error(
    "A <ForgeModule> is only ever to be used as the child of <ForgeModules> element, never rendered directly. Please wrap your <ForgeModule> in a <ForgeModules>.",
  );
}
