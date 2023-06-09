#!/bin/bash

env_file=".env"

if [ -f "$env_file" ]; then
    if ! [ -r "$env_file" ] || ! [ -f "$env_file" ]; then
        echo "Error: Missing read permissions for .env file or the file is not a regular file."
        exit 1
    fi

    version=$(head -n 1 "$env_file")

    if grep -Eq '[^A-Za-z0-9_./]"' "$version"; then
        echo "Error: The .env file contains invalid characters."
        exit 1
    fi

    source "$env_file" || . "$env_file"
else
    echo "The .env file was not found."
    exit 1
fi

if [ -z "$VERSION" ]; then
    echo "Error: The VERSION environment variable is not set."
    exit 1
fi

RANDOM=$$

rm -rf output
mkdir output

echo "$VERSION" > output/version
echo "$RANDOM" > output/spamtong+
