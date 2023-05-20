#!/bin/bash

tmux kill-session -t spamtong

tmux new-session -d -s spamtong "npm run dev"