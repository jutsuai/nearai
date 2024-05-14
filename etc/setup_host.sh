#!/bin/bash
set -e

JASNAH_DATA=/home/setup/.jasnah
CLI_REPO="$JASNAH_DATA/jasnah-cli"
CLI_CMD="/home/setup/.local/bin/jasnah-cli"

HOST_ID="$1"
shift 1

mkdir -p $JASNAH_DATA

# Download jasnah-cli
if [ ! -d "$CLI_REPO" ]; then
    git clone git@github.com:nearai/jasnah-cli.git $CLI_REPO
fi

# Update latest version
cd $CLI_REPO
git checkout main
git pull

python3 -m pip install --upgrade pip

# If binary is not available install it
"$CLI_CMD" version || python3 -m pip install -e .

CURRENT_INSTALLATION=$("$CLI_CMD" location)

if [[ "$CLI_REPO" == "$CURRENT_INSTALLATION" ]]; then
    python3 -m pip install -e .
fi

"$CLI_CMD" config set supervisor_id "$HOST_ID"
"$CLI_CMD" supervisor install
"$CLI_CMD" supervisor start
