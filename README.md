# Scripts

## Build

Builds the whole app.

```
npm run build
```

## Dev

Runs vite dev server in web and watches for manifest and forge workspaces.

```
npm run dev
```

## Tunnel

Builds the and starts `forge tunnel`.
After this run `npm run dev` in another terminal.

```
npm run tunnel
```

# Build chain

```
web ----+
        +---> forge/dist
forge --+
```
