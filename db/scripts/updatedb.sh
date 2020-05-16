#!/bin/sh

BASEDIR=$(dirname "$BASH_SOURCE")

source $BASEDIR/env.sh

# Does data repo exist? 
# Yes? Pull and and update database with the latest data.
if [ -d "$CORONA_DB_DIR" ]; then
  echo "Pulling latest from $CORONA_GIT_REPO_PATH"
  git submodule update --init --recursive
else
  echo "No repo found at $CORONA_DB_GIT_REPO_DIR. Have you run 'npm run db:create'?"
fi
# No? Error.

# echo "Creating database $CORONA_DB"
# node --harmony $BASEDIR/createdb.js
# sqlite3 $CORONA_DB
