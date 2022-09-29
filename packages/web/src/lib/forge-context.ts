import { view } from "@forge/bridge";
import { FullContext } from "@forge/bridge/out/types";
import { memoize } from "lodash-es";

/**
 * A `FullContext` with property types.
 */
export interface ForgeContext<EXTENSION extends Extension = Extension>
  extends FullContext {
  accountId: string;
  cloudId: string;
  extension: EXTENSION;
  localId: string;
  locale: string;
  moduleKey: string;
  siteUrl: string;
  timezone: string;
}

interface Extension {
  type: string;
}

/**
 * @see https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-issue-panel/#extension-context
 */
export interface IssuePanelExtension extends Extension {
  type: string;
  issue: {
    id: string;
    key: string;
    type: string;
    typeId: string;
  };
  project: {
    id: string;
    key: string;
    type: string;
  };
  isNewToIssue: boolean;
}

function getTypedContext<EXTENSION extends Extension = Extension>(): Promise<
  ForgeContext<EXTENSION>
> {
  return view.getContext() as Promise<ForgeContext<EXTENSION>>;
}

export const getForgeContext = memoize(getTypedContext);
