#!/bin/bash

pkill node

cd /home/charlie/actions-runner/_work/spamtong/spamtong
nohup npm run dev > /dev/null 2>&1 & disown &

exit 0
