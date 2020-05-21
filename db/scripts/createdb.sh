#!/bin/sh

BASEDIR=$(dirname "$BASH_SOURCE")

source $BASEDIR/env.sh

# Does data repo exist? Yes?
if [[ -d "$CORONA_DB_GIT_REPO_DIR" && -f "$CORONA_DB_GIT_REPO_DIR/.git" ]]; then
  # TODO: normalize paths to print as absolute
  echo "Existing git submodule found at $CORONA_DB_GIT_REPO_DIR."
  # Does database exist?
  # Yes? Call updatedb.sh and exit
  if [ -f "$CORONA_DB" ]; then
    echo "Existing database found at $CORONA_DB"
    git submodule foreach git pull origin master
    echo "Rebuilding Database"
    rm $CORONA_DB
    node $JS_BIN/createdb.js db=$CORONA_DB dataDir=$CORONA_DAILY_REPORTS_US_DIR
  # No? Create database from data in repo
  else
    echo "Creating database from existing repository data."
    node $JS_BIN/createdb.js db=$CORONA_DB dataDir=$CORONA_DAILY_REPORTS_US_DIR
    echo "Created database $CORONA_DB"
  fi
# No? Clone it and create database.
else
  echo "Creating $CORONA_GIT_REPO_PATH git submodule at $CORONA_DB_DIR..."
  git submodule add $CORONA_GIT_REPO_PATH $CORONA_DB_GIT_REPO_DIR
  git submodule update --init
  echo "Creating database $CORONA_DB"
  node $JS_BIN/createdb.js db=$CORONA_DB dataDir=$CORONA_DAILY_REPORTS_US_DIR
  # sqlite3 $CORONA_DB
fi
