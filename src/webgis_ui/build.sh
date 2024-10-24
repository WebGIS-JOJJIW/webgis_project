#!/usr/bin/bash

SCRIPT_DIR=$(dirname $(realpath ${BASH_SOURCE[0]}))
DIST_DIR=${SCRIPT_DIR}/../../artifact_serve/data
cd $SCRIPT_DIR
export NG_CLI_ANALYTICS="false"
npm install
npx ng build --configuration=development
mv $SCRIPT_DIR/dist/webgis_ui/browser/* $DIST_DIR
