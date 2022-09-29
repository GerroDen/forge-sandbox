# Vite

This project runs with vite2 for now, because some plugins are not compatible with vite3 at the moment of this project's creation.

# Development Workflow

There are 3 ways to develop the UI:

1. Forge tunnel to develop within an Atlassian context
2. a limited local dev mode
3. [Storybook](https://storybook.js.org/) to develop and document UI components in an isolated environment

## Forge tunnel

To develop the whole app within an Atlassian Cloud context, use the `yarn forge-tunnel` and `yarn dev` in 2 terminals from the repository root dir.
This is also necessary when only working on the web UI.
The use of `@forge/bridge` prohibits the use of a normal vite dev mode outside the tunnel workflow.

## Storybook

If you need more information about what storybook is, please read their docs: https://storybook.js.org/.

To start development with storybook use:

```
yarn storybook
```

This automatically opens a browser window.
In this mode, any changes to sources update the browser view like the vite dev server.

### Build

Storybook can create a static site from the sources.

```
yarn build-storybook
```

When finished, the result is available in the folder `storybook-static`.

### How to Use

Every component should be in its own file.
The component itself must be exported as named export in order for storybook to generate the prop documentation and component name properly.
Storybook works best with props types described by interfaces.

Example for `Dummy.tsx`:

```typescript jsx
import React, { useState } from "react";

interface Props {
  foo: string;
  bar?: string;
  flag?: boolean;
  children?: Array<JSX.Element | string>;
}

export function Dummy({ foo, bar = "hiii", flag = false, children }: Props) {
  // …
}
```

Any story file with the ending `.stories.tsx` is included in the storybook.
The file must export a default export to generate the component docs.
The story file and each story may contain any additional necessary code with dummy data or additions worth to document.

Example for `Dummy.stories.tsx` next to the component file:

```typescript jsx
import React from "react";
import { Dummy } from "@/components/dummy";

export default {
  component: Dummy,
};

export function Base() {
  return <Dummy foo={"hi"} />;
}

export function Is() {
  return <Dummy foo={"hi"} is />;
}

export function Children() {
  return (
    <Dummy foo={"hi"}>
      foooooo
      <strong>öööö</strong>
      bar
    </Dummy>
  );
}
```

More information what and how to document in the Storybook docs with DocPage plugin: https://storybook.js.org/docs/react/writing-docs/docs-page.

### Configuration

Configuration is located within the folder `.storybook`.
See [Storybook docs](https://storybook.js.org/docs/react/configure/overview) for more information.

## Local dev mode

When do not need any Atlassian cloud context around the UI to work on, the local dev mode might be interesting and save some time.
In this mode, you still need a valid Atlassian Cloud instance, but all requests are proxied through the vite dev server.

To make the local dev mode work, create a `.env.local` file with the following content:

```
ATLASSIAN_BASE_URL=<Atlassian Cloud instance>
ATLASSIAN_AUTH_USER=<your Atlassian account mail address>
ATLASSIAN_AUTH_TOKEN=<create a token here https://id.atlassian.com/manage-profile/security/api-tokens>
```

To ensure correctness, quote all environment variable values.
So for example:

```
ATLASSIAN_BASE_URL="https://your-domain.atlassian.net"
ATLASSIAN_AUTH_EMAIL="you@self.com"
ATLASSIAN_AUTH_TOKEN="abcdefghijklmnop"
```

Then run the following command to run the local dev mode:

```
yarn dev:local
```

### How it works

The local dev mode configures 2 things:

1. a local proxy to pass all requests to the Atlassian Cloud instance with authentication and CORS headers
2. replaces `@forge/bridge` with a custom implementation found in `__mocks__/local-forge-bridge.ts`

The switch between normal vite dev mode and the local dev mode is decided by setting the environment variable `LOCAL_DEV=true`.

# Developer Notes

## Styling

We use (S)CSS Modules for styling in this project. There are utility classes derivated from our design-tokens which can be imported in the following way:

```tsx
import utils from "design-tokens/utils.module.scss";
import lightTheme from "design-tokens/dark-theme.module.scss";
import darkTheme from "design-tokens/dark-theme.module.scss";
```

`utils` provides utility classes for Tailwind-esque styling, while the theme files only export one class, which sets the color variables accordingly.

To apply styles to an element you simply apply one of its exports to `className` for an element.

```tsx
import utils from 'design-tokens/utils.module.scss'

export default function Component (props) {
  const conditional = false;

  return (
    <element className={[
      utils.textLink,
      conditional? utils.bgRedR100 : utils.bgGreenG100
    ].join(" ")}>
  )
}
```

For custom styles simply add a `.module.scss` file next to you component and apply it in the same fashion. SCSS Variables for our design tokens are available by default through the `$` syntax.

## Global Styles

If you find yourself needing global styles for some odd reason, add the styles to `global.module.css` or in a separate file that is imported into it.

## Forge Modules

Different Forge modules must be registered in the manifest.
In order to save the hassle of creating various vite projects, on top level this project renders different applications depending on the current context provided by Forge during runtime.

To start the different application parts it is necessary to mock the parameters inside that context.
Every parameter can be overridden by query params or environment variables preceded with `FORGE_CONTEXT_` or `FC_`.

To override the parameter `moduleKey` in the context:

```
http://localhost:3000/?moduleKey=main
# or
FORGE_CONTEXT_MODULEKEY=main yarn dev:local
# or
FC_MODULEKEY=main yarn dev:local
```

To override a nested parameter like `extension.issue.key` in the context:

```
http://localhost:3000/?moduleKey=main
# or
FORGE_CONTEXT_EXTENSION_ISSUE_KEY=main yarn dev:local
# or
FC_EXTENSION_ISSUE_KEY=main yarn dev:local
```
