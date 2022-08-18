// implementation of `@forge/bridge` with fetch requests to a remote jira cloud intance to run the web application locally without embedding inside jira cloud
// import type {
//   invoke as invokeType,
//   requestJira as requestJiraType,
// } from "@forge/bridge";
import type bridgeType from "@forge/bridge";
import { Flag } from "@forge/bridge/out/flag/flag";
import { InvokePayload } from "@forge/bridge/out/types";
import { createBrowserHistory, History } from "history";

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
  },
};

export const requestJira = bridge.requestJira;
export const invoke = bridge.invoke;
export const showFlag = bridge.showFlag;
export const view = bridge.view;
