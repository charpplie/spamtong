#!/bin/bash

pkill -f "npm run dev"

npm run dev > /dev/null 2>&1 &
