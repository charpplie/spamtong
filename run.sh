#!/bin/bash

screen -ls | grep spamtong | cut -d. -f1 | awk '{print $1}' | xargs -r kill

screen -dmS spamtong npm run dev
