#!/usr/bin/env bash

_TEMP_PATH=$(dirname $0)
SCRIPT_DIR=${_TEMP_PATH/\.\./$(dirname $(pwd))}
SCRIPT_DIR=${SCRIPT_DIR/\.\//$(pwd)\/}

export GM_MYSQL_HOST="localhost"
export GM_MYSQL_PORT=3306
export GM_MYSQL_USER="root"
export GM_MYSQL_PASSWORD=""
export GM_MYSQL_DATABASE="hyqxz_gm"

# Usage:    ./run.sh
pushd ${SCRIPT_DIR} > /dev/null
if [ "$1" == "debug" ]; then
    node ${SCRIPT_DIR}/scripts/account.js
else
    LOGS_DIR="${SCRIPT_DIR}/logs"
    if [ ! -z ${G_LOG_DIR} ]; then
        LOGS_DIR=${G_LOG_DIR}
    fi

    echo "Use log directory: ${LOGS_DIR}"

    if [ ! -d ${LOGS_DIR} ]; then
        mkdir ${LOGS_DIR}
    fi
    LOG_NAME="account_$(date '+%F_%R')"
    nohup node ${SCRIPT_DIR}/scripts/account.js > ${LOGS_DIR}/${LOG_NAME}.log &
fi
popd > /dev/null