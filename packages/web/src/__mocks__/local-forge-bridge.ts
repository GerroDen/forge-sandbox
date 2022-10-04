// implementation of `@forge/bridge` with fetch requests to a remote jira cloud intance to run the web application locally without embedding inside jira cloud
// import type {
//   invoke as invokeType,
//   requestJira as requestJiraType,
// } from "@forge/bridge";
import type bridgeType from "@forge/bridge";
import { Flag } from "@forge/bridge/out/flag/flag";
import { InvokePayload } from "@forge/bridge/out/types";
import { createBrowserHistory, History } from "history";
import {
  AllExtensios,
  ForgeContext,
  IssuePanelExtension,
} from "@/lib/forge-context";

console.warn("mocking '@forge/bridge' in dev mode");

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
const bridge: DeepPartial<typeof bridgeType> = {
  requestJira(restPath: string, fetchOptions?: RequestInit): Promise<Response> {
    return fetch(restPath, fetchOptions);
  },

  async invoke<T>(functionKey: string, payload?: InvokePayload): Promise<T> {
    console.log("called", functionKey, payload);
    // this can be replaced with fetch and weburls for each functionKey
    switch (functionKey) {
      case "getText":
        return "text" as never;
      default:
        throw new Error(`unknown call to functionKey "${functionKey}"`);
    }
  },

  showFlag(options: bridgeType.FlagOptions): Flag {
    window.alert(`showFlag(${JSON.stringify(options, null, 2)})`);
    return {
      async close(): Promise<void> {
        console.info("mocked close flag");
      },
    };
  },

  view: {
    async createHistory(): Promise<History> {
      return createBrowserHistory();
    },
    /**
     * Mocks the forge context.
     * The forge context can be overridden by query parameters or environment variables.
     * i.e.
     * http://localhost:3000/?moduleKey=main
     * or
     * FORGE_CONTEXT_MODULEKEY=main yarn dev:local
     * or
     * FC_MODULEKEY=main yarn dev:local
     * is the same.
     * Query parameters have precedence over env vars and over defaults.
     * If no default is defined, the param itself is used as default value, which is only sufficient for string typed context parameters.
     */
    async getContext(): Promise<ForgeContext<AllExtensios>> {
      return {
        accountId: getContextProp("accountId"),
        cloudId: getContextProp("cloudId"),
        extension: {
          type: getContextProp("extension.type"),
          issue: {
            id: getContextProp("extension.issue.id"),
            key: getContextProp("extension.issue.key"),
            type: getContextProp("extension.issue.type"),
            typeId: getContextProp("extension.issue.typeId"),
          },
          project: {
            id: getContextProp("extension.project.id"),
            key: getContextProp("extension.project.key"),
            type: getContextProp("extension.project.type"),
          },
          isNewToIssue: getContextProp("extension.isNewToIssue", false),
        },
        localId: getContextProp("localId"),
        locale: getContextProp("locale"),
        moduleKey: getContextProp("moduleKey", "agile-hive-main"),
        siteUrl: getContextProp("siteUrl"),
        timezone: getContextProp("timezone"),
      };
    },
  },
};

const forgeContextEnvVars = process.env.FORGE_CONTEXT;
function getContextProp(param: string): string;
function getContextProp<T>(param: string, defaultResult?: T): T;
function getContextProp<T>(param: string, defaultResult?: T): T {
  const envVar = paramToEnvVar(param);
  return (new URLSearchParams(window.location.search).get(param) ??
    forgeContextEnvVars?.[envVar] ??
    defaultResult ??
    param) as T;
}

function paramToEnvVar(string: string) {
  return string.replace(/\./g, "_").toUpperCase();
}

export const requestJira = bridge.requestJira;
export const invoke = bridge.invoke;
export const showFlag = bridge.showFlag;
export const view = bridge.view;
