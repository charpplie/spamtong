#!/bin/bash

script /dev/null

if screen -ls | grep -q "Spamtong"; then
  screen -X -S spamtong quit
  screen -dmS spamtong
  screen -S spamtong bash -c "cd actions-runner/_work/spamtong/spamtong && npm run dev"
else
  screen -dmS spamtong
  screen -S spamtong bash -c "cd actions-runner/_work/spamtong/spamtong && npm run dev"
fi