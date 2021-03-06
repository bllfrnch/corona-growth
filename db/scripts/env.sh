#!/bin/sh

BASEDIR=$(dirname "$BASH_SOURCE")

export CORONA_GIT_REPO_NAME=COVID-19
export CORONA_GIT_REPO_PATH=git@github.com:CSSEGISandData/$CORONA_GIT_REPO_NAME.git
export JS_BIN=$BASEDIR/../../build
export CORONA_DB_DIR=$BASEDIR/..
export CORONA_DB=$CORONA_DB_DIR/corona.db
export CORONA_DB_GIT_REPO_DIR=$CORONA_DB_DIR/$CORONA_GIT_REPO_NAME
export CORONA_DB_SCRIPTS_DIR=$CORONA_DB_DIR/scripts
export CORONA_DAILY_REPORTS_DIR=$CORONA_DB_DIR/$CORONA_GIT_REPO_NAME/csse_covid_19_data/csse_covid_19_daily_reports
export CORONA_DAILY_REPORTS_US_DIR=$CORONA_DB_DIR/$CORONA_GIT_REPO_NAME/csse_covid_19_data/csse_covid_19_daily_reports_us

