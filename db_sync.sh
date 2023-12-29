#!/bin/bash

base_path="./db_sync"
timestamp=$(date +%S)
date_time=$(date -d "@$timestamp" "+%Y/%m/%d/")

new_folder_path="$base_folder/$date_time/$timestamp/"

if [ -d "$base_path" ]; then
  rm -r "$base_path"
fi

mkdir "$new_folder_path"
cp -r ./db/* "$new_folder_path"