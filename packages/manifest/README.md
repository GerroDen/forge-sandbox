Builder of different manifest files for development and production purposes.

# Motivation

Forge does not offer a way to add development overrides to add debug data or necessary options for tunnelling.
This approach offers a way to merge a `manifest.yml` from a `base` and a `dev` template depending on the typical `NODE_ENV` environment variable.
In addition it is possible to provide different `APP_ID`s via envvar in order to bundle the same code for different registered apps.

# Developer notes

`base.yml` contains all manifest entries that are generally necessary for production.
`dev.yml` only contains all manifest entries that add additional configurations for development purposes.
The generated `manifest.yml` is the `base.yml` merged with all overrides from the `dev.yml`
