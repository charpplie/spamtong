#!/bin/bash
RANDOM=$$

rm -rf output

mkdir output

echo $RANDOM > output/spamtong+

REPO_OWNER="charpplie"
REPO_NAME="spamtong"

GITHUB_TOKEN="$1"

if [[ -z "${GITHUB_TOKEN}" ]]; then
  exit 1
fi

API_URL="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits"
HEADER="Accept: application/vnd.github.v3+json"
AUTHORIZATION="Authorization: token ${GITHUB_TOKEN}"
COMMIT=$(curl -sSL -H "${HEADER}" -H "${AUTHORIZATION}" "${API_URL}")

# Get the hash of the latest commit
COMMIT_HASH=$(echo "${COMMIT}" | jq -r '.[0].sha')

# Request the list of changed files in the latest commit
API_URL="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${COMMIT_HASH}"
FILES=$(curl -sSL -H "${HEADER}" -H "${AUTHORIZATION}" "${API_URL}" | jq -r '.files[].filename')

# Write the list of files to a file
OUTPUT_FILE="changed_files.txt"
echo "${FILES}" > "output/${OUTPUT_FILE}"