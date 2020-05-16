#!/bin/sh

BASEDIR=$(dirname "$BASH_SOURCE")

source $BASEDIR/env.sh

# Does data repo exist? Yes?
if [[ -d "$CORONA_DB_GIT_REPO_DIR" && -d "$CORONA_DB_GIT_REPO_DIR/.git" ]]; then
  # TODO: normalize paths to print as absolute
  echo "Existing repository found at $CORONA_DB_GIT_REPO_DIR."
  # Does database exist?
  # Yes? Call updatedb.sh and exit
  if [ -f "$CORONA_DB" ]; then
    echo "Existing database found at $CORONA_DB"
    echo "Falling back to update."
    exec $BASEDIR/updatedb.sh
  # No? Create database from data in repo
  else
    echo "Creating database from existing repository data."
    node $JS_BIN/createdb.js db=$CORONA_DB
    echo "Created database $CORONA_DB"
  fi
# No? Clone it and create database.
else
  echo "Cloning $CORONA_GIT_REPO_PATH to $CORONA_DB_DIR..."
  git clone $CORONA_GIT_REPO_PATH $CORONA_DB_GIT_REPO_DIR
  echo "Creating database $CORONA_DB"
  node $JS_BIN/createdb.js db=$CORONA_DB
  # sqlite3 $CORONA_DB
fi
