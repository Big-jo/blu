#!/bin/sh

# yarn install

# Run migration (non-watch, must exit)
yarn run migration:run

# Start the app
yarn run start:prod
