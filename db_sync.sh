base_path="dbsync"
timestamp=$(date +%s)
year=$(date +%Y)
month=$(date +%B)
day=$(date +%d)

new_folder_path="$base_path/$year/$month/$day/$timestamp/"

sudo mkdir -p "$base_path"

sudo cp -r "$year/*" "$base_path" 

sudo mkdir -p "$new_folder_path"
sudo cp -r ./db/* "$new_folder_path"