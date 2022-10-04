/// <reference types="vite/client" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FORGE_CONTEXT?: Record<string, string>;
    }
  }
}

// convert into a module with empty export in order to let typescript autoload the types
export {};
