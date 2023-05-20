#!/bin/bash

script /dev/null

if screen -ls | grep -q "spamtong"; then
  screen -X -S spamtong quit
  screen -dmS spamtong
  screen -S spamtong bash -c "echo bebra > catx"