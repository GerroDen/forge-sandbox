# Requirements

- [Node LTS](https://nodejs.org/en/), currently Node 16 (Forge is bound to Node LTS)
- [Forge CLI](https://developer.atlassian.com/platform/forge/cli-reference/)

# Build chain

```
web ----+
        +---> forge/dist
forge --+
```

# Initial Setup

The initial setup requires a certain sequence of operations to work with the app within a running Jira Cloud instance.
This sequence is [slightly different from the example from the Forge docs](https://developer.atlassian.com/platform/forge/getting-started/#hello-world-cli-overview) since the code already exists.

1. Create your own Atlassian developer instance: https://go.atlassian.com/cloud-dev
2. `npm ci` install all dependencies of the project locally
3. `npm run forge-login` authorizes the ForgeCLI with your Atlassian ID
4. `npm run forge-register` registers a new app for this project in [your developer console](https://developer.atlassian.com/console/myapps/)
5. `npm run forge-deploy` deploys the backend functions to the Atlassian Forge platform
6. `npm run forge-install` install the app into a specific Atlassian Cloud application instance, in this case a Jira Cloud instance
7. `npm run forge-tunnel` start a tunnel for local development with hot-reload to the deployed application ([see docs for more information](https://developer.atlassian.com/platform/forge/tunneling/))
8. `npm run dev` starts watcher and dev server during development

# IDE setup

Enable prettier and eslint support.
Prettier should format any file type that it knows.
Developers might need to set these file extensions explicitly in the IDE:

- For Prettier: `{**/*,*}.{css,scss,html,js,ts,jsx,tsx,md,mdx,sh,json,yaml,yml,xml,java}`.
- For ESlint: `{**/*,*}.{html,js,ts,jsx,tsx}`.
- For Stylint: `{**/*,*}.{css,scss}`.

# Development Workflow

After the initial setup is done, only a subset of steps is necessary during development.
The app is only accessible to the developer. To show the app to someone else, it is necessary to deploy to staging or production.

1. `npm run forge-deploy` is necessary if you changed the `manifest.yml`
2. `npm run forge-install --upgrade` is necessary if you changed the `manifest.yml`
3. `npm run forge-tunnel` start the tunnel with hot-deployment of local code changes and hot-reload for UI
4. in a new terminal run `npm run dev` to watch forge workspace and start vite dev server

# Deployment on staging

To show the results to someone else but yourself you have to deploy on staging and enable ap distribution once.
The app is completely separated from the dev version: it has separate entries in the app manager in the Atlassian product and menus.

1. `npm run forge-deploy -e staging` is necessary if you changed the `manifest.yml`
2. `npm run forge-install -e staging` is necessary if you changed the `manifest.yml`

In order to allow access for someone but the developer itself, app distribution must be enabled.
To enable app distribution, go to your app in [the console](https://developer.atlassian.com/console/myapps), choose "Distribution" and fill all fields.

# Scripts

Next to the Forge cli wrappers `forge-login`, `forge-register`, `forge-deploy`, `forge-install`, `forge-tunnel` the project contains the following scripts.
This setup uses [turborepo](https://turborepo.org/) to ease maintenance of the dependencies between workspaces.

## `dev`

Runs vite dev server and watcher on all workspaces.
The build result is located in `forge/dist`.

## `build`

Builds all workspaces and bundles them into `forge/dist`.

## `lint`

Runs lint in all workspaces.

# Forge Wrapper CLI `forge-wrapper.sh`

This is a wrapper script to manage local building steps before using the Forge CLI and app registration.
All listed commands call the corresponding Forge CLI command, i.e. `forge-wrapper.sh register` calls `forge register` but wraps some commands around it.
See [Forge CLI docs](https://developer.atlassian.com/platform/forge/cli-reference/) for more details.

## `register`

This command registers a new app for your personal account that you authenticated with `forge login` before.
When successful, the script creates a `.env.local` file with the created app's id.
You can manage your registered apps in your [Atlassian developer console](https://developer.atlassian.com/console/myapps/).

## `deploy`

`deploy` builds and uploads the app to the Atlassian Forge platform.
This forge command deploys to development stage by default.
Use `deploy -e staging` or `deploy -e production` for deploying to different stages.

## `install`

Builds and installs the app as plugin into an Atlassian Cloud product instance of your choice.
If you are missing an instance create one at https://go.atlassian.com/cloud-dev.

This forge command installs the development stage by default.
Use `install -e staging` or `install -e production` to install different stages of the app.

## `tunnel`

**! Due to an implementation flaw inside Forge cli, this command only prepares to `forge tunnel`. Using `npm run forge-tunnel` however starts the tunnel. !**

Builds and starts the tunnel for hot-reload and hot-deployment of local development.
To serve and run a build result, run `deploy` again.

Also run watch and vite dev server in a separate tab with the following command:

```
npm run dev
```

The `tunnel` command might log an ignorable warning on M1 chips which so far has no impact during development:

```
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
```

## `lint`

Runs the Forge linter within the project.

# Troubleshooting

## I have problem xyz with forge

Maybe we already documented what it is and how to workaround it here:
https://seibertmedia-cloud.atlassian.net/wiki/x/oADtzw

## I have a registered app but lost the app id

Find your app under https://developer.atlassian.com/console/myapps and copy the app id from the overview page.
Create a `.env.local` file with this content:

```
APP_ID=<your app's id>
```
