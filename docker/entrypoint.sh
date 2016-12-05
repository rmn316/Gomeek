#!/usr/bin/env bash

set -x
set -e

su application -l -c $WEB_DIR/bin/install-dev-dependencies
su application -l -c $WEB_DIR/bin/build-projects

exec "$@"