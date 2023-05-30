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

HEADER="Accept: application/vnd.github.v3+json"
AUTHORIZATION="Authorization: token ${GITHUB_TOKEN}"
COMMIT=$(curl -sSL -H "${HEADER}" -H "${AUTHORIZATION}" "${API_URL}")

COMMIT_HASH=$(echo "${COMMIT}" | jq -r '.[0].sha')

API_URL="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${COMMIT_HASH}"
FILES=$(curl -sSL -H "${HEADER}" -H "${AUTHORIZATION}" "${API_URL}" | jq -r '.files[].filename')

OUTPUT_FILE="files"
echo "${FILES}" > "output/${OUTPUT_FILE}"