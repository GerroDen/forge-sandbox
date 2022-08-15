#!/bin/bash
# see http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

NODE_ENV=${NODE_ENV:-}
ENV_FILE=".env.local"

COMMAND=$1
shift

case $COMMAND in
    register)
        echo "Registering app"
        export NODE_ENV=$NODE_ENV
        npm run build
        cd app/dist
        forge register
        APP_ID="$(sed -n "s/  id: ari:cloud:ecosystem::app\///p" manifest.yml)"
        cd -
        echo "APP_ID=\"${APP_ID}\"" | tee $ENV_FILE
    ;;

    deploy | install | tunnel | lint)
        export "$(grep -v "^#" $ENV_FILE | xargs)"
        echo "Building forge app with id $APP_ID"
        if [ "$COMMAND" == tunnel ]; then
          export NODE_ENV="development"
        fi
        npm run build
        cd app/dist
        if [ "$COMMAND" == tunnel ]; then
          npm i
        else
          ## Forge tunnel cannot be called within a bash script.
          ## This leads to an error log "Error: spawn ts-node ENOENT", which could be an implementation flaw in forge cli.
          forge "$COMMAND" "$@"
        fi
    ;;

    *)
        forge "$COMMAND" "$@"
esac
