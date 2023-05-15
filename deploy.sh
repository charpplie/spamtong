#!/bin/bash

cd /home/charlie/actions-runner/_work/spamtong/spamtong
npm run dev

if [ $? -eq 0 ]; then
  exit 0
else
  exit 1
fi
