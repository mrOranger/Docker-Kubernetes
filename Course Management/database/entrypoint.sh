#!/bin/bash

set -e

echo "Running migration ..."
mysql -u "${MYSQL_ROOT_USER}" -p "${MYSQL_ROOT_PASSWORD}" ${MYSQL_DATABASE} < /docker-entrypoint-initdb.d/dump.sql
