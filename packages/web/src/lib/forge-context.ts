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
 * Union of all possible extension types
 */
export type AllExtensions = IssuePanelExtension;

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

export async function getAppRootUrl(product: Product): Promise<string> {
  const { siteUrl, localId } = await getForgeContext();
  const { appId, envId } = parseLocalId(localId);
  return `${siteUrl}/${product}/apps/${appId}/${envId}`;
}

/**
 * Parses a `localId` of a `ForgeContext` and resolves the `appId` and `envId` part.
 *
 * A `localId` has the form `ari:cloud:ecosystem::extension/d514accc-9103-4507-ac09-016210a35de8/ea2ca26d-2070-4ae5-97e5-42066813da57/static/agile-hive-issue-hierarchy-panel-ef3b5116-1665998886908`,
 * then `d514accc-9103-4507-ac09-016210a35de8` is the `appId` and `ea2ca26d-2070-4ae5-97e5-42066813da57` is the `envId`.
 * The `envId` is different between each installation and development, staging and production environment of the Forge app.
 */
export function parseLocalId(localId: string): {
  appId: string;
  envId: string;
} {
  if (!localId.startsWith(localIdPrefix)) {
    throw new InvalidLocalIdError();
  }
  const [, appId, envId] = localId.split("/");
  return { appId, envId };
}

export enum Product {
  jira = "jira",
  confluence = "confluence",
}

const localIdPrefix = "ari:cloud:ecosystem::extension/";

export class InvalidLocalIdError extends Error {
  constructor() {
    super(`the localId is invalid, it must start with "${localIdPrefix}"`);
  }
}
