#!/usr/bin/env bash

# Usage:    ./run.sh [port with ':']

_TEMP_PATH=$(dirname $0)
SCRIPT_DIR=${_TEMP_PATH/\.\./$(dirname $(pwd))}
SCRIPT_DIR=${SCRIPT_DIR/\.\//$(pwd)\/}

if [ -z $1 ]; then
    echo "Please input the db name as argument 1."
    exit 1
fi

# $1: db_name
# $2: port start with ':'
# $3: flyway command, default is migrate

URL=jdbc:mysql://localhost$2/$1
LOCATIONS=filesystem:${SCRIPT_DIR}
if [ -z $3 ]; then
    flyway -url=${URL} -locations=${LOCATIONS} migrate
    exit 0
fi
flyway -url=${URL} -locations=${LOCATIONS} $3 $4 $5 $6 $7 $8 $9