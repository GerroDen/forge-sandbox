Forge functions in general can be implemented like any vanilla FaaS implementation.

This approach includes a shared `bridge` layer for function types and definitions, which can be used in the backend and frontend.

```typescript
// bridge/get-text

export interface GetTextPayload {
  text: string;
}

export enum Functions {
  getText = "getText",
}
```

The backend implements a function via a resolver and uses types and function names from `bridge`.

```typescript
// app/index.ts

import Resolver from "@forge/resolver";
import { Functions, GetTextPayload } from "bridge/get-text";

const resolver = new Resolver();

resolver.define(Functions.getText, async (req) => {
  // code goes here
});

export const handler = resolver.getDefinitions();
```

The resolver **must** be registered in the `manifest.yml` (here part of the `base.yml`) and every module **must** reference that same resolver.

```
# manifest/base.yml

modules:
  jira:globalPage:
    - …
      resolver:
        function: resolver
  function:
    - key: resolver
      handler: index.handler
```

With that setup, within `web` it is possible to implement a client to call that function and shared typing.

```typescript
// web/lib/get-text-client.ts

import { Functions, GetTextPayload } from "bridge/get-text";
import { invoke } from "@forge/bridge";

export function getText(payload: GetTextPayload): Promise<string> {
  return invoke<string>(Functions.getText, payload);
}
```

# Permission check

The `manifest.yml` may declare permission scopes that expand the capability of a normal user's permissions.
To avoid miss treatment, it is probably necessary to check permissions based on your applications needs.
`permission.ts` offers a simple approach to check the global Jira admin permission.
Every permission check is an asynchronous Jira API call.
See [Authorize API](https://developer.atlassian.com/platform/forge/runtime-reference/authorize-api/#authorize-api) for more information.

```typescript
// app/index.ts

resolver.define(Functions.getText, async (req) => {
  console.log("called getText()");
  await requireAccess();
  console.log("accessed getText()");
  // code goes here
});

async function requireAccess() {
  const isAdmin = await isJiraGlobalAdmin();
  if (!isAdmin) {
    throw new Error("not permitted");
  }
}
```

# Payload validation

Accepting payload is dangerous and requires a strong validation.
This approach uses [Zod](https://zod.dev/) for payload validation.
The schema is implemented per function module as `get-text-schema.ts` next to the function implementation `get-text.ts`.

```typescript
// get-text-schema.ts

import { z } from "zod";

export const getTextSchema = z.object({
  text: z.string().min(2).max(255),
});
```

`schema.parse()` throws an exception when the payload is invalid.
Sadly also the `req.context` from Forge is not strongly typed.

```typescript
// app/index.ts

resolver.define(Functions.getText, async (req) => {
  console.log("called getText()");
  const accountId = requireAccountId(req);
  const payload: GetTextPayload = getTextSchema.parse(req.payload);
  console.log("accessed getText()");
  return getText({ ...payload, accountId });
});

function requireAccountId(req: { context: Record<string, unknown> }): string {
  return z.string().parse(req.context.accountId);
}
```
