import React, { Children, isValidElement, ReactChild, ReactNode } from "react";
import { ForgeModule } from "@/components/ForgeModule";
import { useAsync } from "react-use";
import { getForgeContext } from "@/lib/forge-context";

interface Props {
  children?: ReactNode;
}

/**
 * Defines different application modules to render depending on the current context's `moduleKey`.
 * The `moduleKey` is the same as defined in the manifest.
 *
 * @example
 * // This will render `Main` when the context contains `moduleKey` is `main` and `Panel` when `moduleKey` is `panel`.
 * <ForgeModules>
 *     <ForgeModule moduleKey="main" element={<Main/>} />
 *     <ForgeModule moduleKey="panel" element={<Panel/>} />
 * </ForgeModules>
 */
export function ForgeModules({ children }: Props) {
  const modules = createForgeModuleObjectsFromChildren(children);
  const contextState = useAsync(() => getForgeContext());
  return (
    <>
      {contextState.value &&
        (modules.find(
          ({ moduleKey }) => moduleKey === contextState.value?.moduleKey
        )?.element ?? (
          <div>unknown module key {contextState.value?.moduleKey}</div>
        ))}
    </>
  );
}

interface ForgeModuleObject {
  moduleKey: string;
  element: ReactChild;
}

function createForgeModuleObjectsFromChildren(
  children: ReactNode
): ForgeModuleObject[] {
  const modules: ForgeModuleObject[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    if (child.type !== ForgeModule) {
      const childName =
        typeof child.type === "string" ? child.type : child.type.name;
      throw new Error(
        `[${childName}] is not a <ForgeModule> component. All component children of <ForgeModules> must be a <ForgeModule>`
      );
    }
    modules.push(child.props);
  });
  return modules;
}
