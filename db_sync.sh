#!/bin/bash

base_path="./dbsync"
timestamp=$(date +%s)
year=$(date +%Y)
month=$(date +%B)
day=$(date +%d)

new_folder_path="$base_folder/$year/$month/$day/"

if [ -d "$base_path" ]; then
  rm -r "$base_path"
fi

mkdir "$new_folder_path"
cp -r ./db/* "$new_folder_path"