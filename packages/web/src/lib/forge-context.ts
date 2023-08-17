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
  environmentId: string;
  environmentType: string;
  extension: EXTENSION;
  localId: string;
  locale: string;
  moduleKey: string;
  siteUrl: string;
  theme: ThemeContext;
  timezone: string;
}

interface ThemeContext {
  dark: string;
  light: string;
  colorMode: "dark" | "light";
}

interface Extension {
  type: string;
}

/**
 * Union of all possible extension types
 */
export type AllExtensions = Extension &
  Partial<IssuePanelExtension> &
  Partial<ProjectPageExtension>;

interface ContextProject {
  id: string;
  key: string;
  type: string;
}

interface ContextIssue {
  id: string;
  key: string;
  type: string;
  typeId: string;
}

/**
 * @see https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-issue-panel/#custom-ui
 */
export interface IssuePanelExtension extends Extension {
  issue: ContextIssue;
  project: ContextProject;
  isNewToIssue: boolean;
}

/**
 * @see https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-project-page/#custom-ui
 */
export interface ProjectPageExtension extends Extension {
  project: ContextProject;
}

function getTypedContext<EXTENSION extends Extension = Extension>(): Promise<
  ForgeContext<EXTENSION>
> {
  return view.getContext() as Promise<ForgeContext<EXTENSION>>;
}

export const getForgeContext = memoize(getTypedContext);

interface InstanceBaseInfo {
  siteUrl: string;
  appId: string;
  envId: string;
}

async function getInstanceBaseInfo(): Promise<InstanceBaseInfo> {
  const { siteUrl, localId } = await getForgeContext();
  const { appId, envId } = parseLocalId(localId);
  return { siteUrl, appId, envId };
}

export async function getAppRootUrl(
  product: Product = Product.jira,
): Promise<string> {
  if (process.env.LOCAL_DEV === "true") return "localhost:3000";
  const { siteUrl, appId, envId } = await getInstanceBaseInfo();
  return `${siteUrl}/${product}/apps/${appId}/${envId}`;
}

export async function getSettingsRootUrl(
  product: Product = Product.jira,
): Promise<string> {
  if (process.env.LOCAL_DEV === "true") return "localhost:3000";
  const { siteUrl, appId, envId } = await getInstanceBaseInfo();
  return `${siteUrl}/${product}/settings/apps/${appId}/${envId}`;
}

const localIdPattern =
  /ari:cloud:ecosystem::extension\/([\w-]+)\/([\w-]+)(?:\/.+)?/;

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
  const matches = localIdPattern.exec(localId);
  if (!matches) {
    throw new InvalidLocalIdError();
  }
  const [, appId, envId] = matches;
  return { appId, envId };
}

export enum Product {
  jira = "jira",
  confluence = "confluence",
}

export class InvalidLocalIdError extends Error {
  constructor() {
    super(
      `the localId is invalid, it must have the pattern "${localIdPattern.source}"`,
    );
  }
}
