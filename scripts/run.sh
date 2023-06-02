#!/bin/bash

env_file="../.env"

if [ -f "$env_file" ]; then
    if ! [ -r "$env_file" ] || ! [ -f "$env_file" ]; then
        echo "Error: Missing read permissions for .env file or the file is not a regular file."
        exit 1
    fi
else
    echo "The .env file was not found."
    exit 1
fi

while [ "$#" -gt 0 ]; do
    if [ "$1" = "-discord" ]; then
        DISCORD_TOKEN="$2"
        shift
    elif [ "$1" = "-client" ]; then
        CLIENT_ID="$2"
        shift
    else
        echo "Error: Invalid argument: $1"
        exit 1
    fi
    shift
done

if [ -z "$DISCORD_TOKEN" ]; then
    echo "Error: The DISCORD_TOKEN argument is missing."
    exit 1
fi

if [ -z "$CLIENT_ID" ]; then
    echo "Error: The CLIENT_ID argument is missing."
    exit 1
fi

echo "token=$DISCORD_TOKEN" >> $env_file
echo "cliendId=$CLIENT_ID" >> $env_file

npm run dev