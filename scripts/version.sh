#!/bin/bash

env_file="../.env"

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

while [ "$#" -gt 0 ]; do
    if [ "$1" = "-github" ]; then
        GITHUB_TOKEN="$2"
        shift
    elif [ "$1" = "-branch" ]; then
        BRANCH="$2"
        shift
    else
        echo "Error: Invalid argument: $1"
        exit 1
    fi
    shift
done

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: The GITHUB_TOKEN argument is missing."
    exit 1
fi

if [ -z "$BRANCH" ]; then
    echo "Error: The BRANCH argument is missing."
    exit 1
fi

RANDOM=$$

rm -rf output
mkdir output

echo "$VERSION" > output/version
echo "$RANDOM" > output/spamtong+

REPO_OWNER="charpplie"
REPO_NAME="spamtong"

API_URL="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits"
HEADER="Accept: application/vnd.github.v3+json"
AUTHORIZATION="Authorization: token ${GITHUB_TOKEN}"
if [ "$BRANCH" = "dev" ]; then
    API_URL+="?sha=dev"
fi

COMMIT=$(curl -sSL -H "${HEADER}" -H "${AUTHORIZATION}" "${API_URL}")

COMMIT_HASH=$(echo "${COMMIT}" | jq -r '.[0].sha')

API_URL="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${COMMIT_HASH}"
FILES=$(curl -sSL -H "${HEADER}" -H "${AUTHORIZATION}" "${API_URL}" | jq -r '.files[].filename')

OUTPUT_FILE="changed_files.txt"
echo "$FILES" > "output/${OUTPUT_FILE}"
