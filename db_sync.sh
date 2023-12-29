#!/bin/bash

base_path="dbsync"
timestamp=$(date +%s)
year=$(date +%Y)
month=$(date +%B)
day=$(date +%d)

new_folder_path="$base_folder/$year/$month/$day/"

if [ -d "$base_path" ]; then
  sudo rm -r "$base_path"
fi

sudo mkdir -p "$new_folder_path"
sudo cp -r ./db/* "$new_folder_path"