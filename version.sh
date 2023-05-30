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
COMMITS=$(curl -sSL -H "${HEADER}" -H "${AUTHORIZATION}" "${API_URL}")

COMMIT_MESSAGES=$(echo "${COMMITS}" | jq -r '.[].commit.message')

OUTPUT_FILE="files"
echo "${COMMIT_MESSAGES}" > "output/${OUTPUT_FILE}"

#
