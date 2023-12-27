// implementation of `@forge/bridge` with fetch requests to a remote jira cloud intance to run the web application locally without embedding inside jira cloud
import type bridgeType from "@forge/bridge";
import { Flag } from "@forge/bridge/out/flag/flag";
import { InvokePayload, Subscription } from "@forge/bridge/out/types";
import { createBrowserHistory, History } from "history";
import {
  AllExtensions,
  CustomModalContext,
  ForgeContext,
} from "@/lib/forge-context";
import { showDialog } from "@/__mocks__/local-forge-bridge/dialog.ts";

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
    const dialog = showDialog({ payload: options });
    return {
      async close(): Promise<void> {
        dialog.close();
      },
    } as Flag;
  },

  router: {
    async navigate(url: string): Promise<void> {
      window.alert(`navigate("${url}")`);
    },
    async open(url: string): Promise<void> {
      window.alert(`open("${url}")`);
    },
    async reload(): Promise<void> {
      window.alert(`reload()`);
    },
  },

  events: {
    async emit(...params: unknown[]): Promise<void> {
      console.log("events.emit()", params);
    },
    async on(...params: unknown[]): Promise<Subscription> {
      console.log("events.on()", params);
      return {
        unsubscribe(): void {
          // noop
        },
      };
    },
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
    async getContext(): Promise<ForgeContext<AllExtensions>> {
      return {
        accountId: getContextProp("accountId"),
        cloudId: getContextProp("cloudId"),
        environmentId: getContextProp("environmentId"),
        environmentType: getContextProp("environmentType", "DEVELOPMENT"),
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
          modal: hasContextProp("extension.modal")
            ? ({
                type: getContextProp("extension.modal.type"),
              } as CustomModalContext)
            : undefined,
          isNewToIssue: getContextProp("extension.isNewToIssue", false),
        },
        localId: getContextProp(
          "localId",
          "ari:cloud:ecosystem::extension/appId/envId/route",
        ),
        locale: getContextProp("locale"),
        moduleKey: getContextProp("moduleKey", "agile-hive-main"),
        siteUrl: getContextProp("siteUrl", ""),
        timezone: getContextProp("timezone"),
        theme: {
          dark: "dark",
          light: "light",
          colorMode: getContextProp("theme.colorMode", "light"),
        },
      };
    },
    theme: {
      async enable() {
        const htmlElement = document.querySelector("html");
        if (!htmlElement) return;

        const setTheme = (colorScheme: "dark" | "light"): void => {
          htmlElement.dataset.colorMode = colorScheme;
        };

        const initialColorScheme = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches
          ? "dark"
          : "light";
        setTheme(initialColorScheme);

        window
          .matchMedia("(prefers-color-scheme: dark)")
          .addEventListener("change", (event) => {
            setTheme(event.matches ? "dark" : "light");
          });
      },
    },
    async close(payload?: unknown): Promise<void> {
      showDialog({ payload });
    },
  },

  Modal: class {
    constructor(private readonly options?: bridgeType.ModalOptions) {}
    open(): void {
      showDialog({
        payload: this.options?.context,
        onClose: (response) => {
          this.options?.onClose?.(response);
        },
      });
    }
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
function hasContextProp(param: string): boolean {
  const envVar = paramToEnvVar(param);
  const envVarKeys = Object.keys(forgeContextEnvVars ?? {});
  const queryParamKeys = Array.from(
    new URLSearchParams(window.location.search).keys(),
  );
  return (
    envVarKeys.some((key) => key.startsWith(envVar)) ||
    queryParamKeys.some((key) => key.startsWith(param))
  );
}

function paramToEnvVar(string: string): string {
  return string.replace(/\./g, "_").toUpperCase();
}

export const requestJira = bridge.requestJira;
export const invoke = bridge.invoke;
export const showFlag = bridge.showFlag;
export const router = bridge.router;
export const events = bridge.events;
export const view = bridge.view;
export const Modal = bridge.Modal;
