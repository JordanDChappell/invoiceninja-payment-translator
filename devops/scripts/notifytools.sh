#!/bin/bash

DIR="$1"
inotifywait -m -q -e create -e moved_to --format "%w%f" "$DIR" | while read -r NEW_FILE
do
  echo "File discovered: $NEW_FILE"
  echo "Running node script"
  node /app/index.js $2 -i $NEW_FILE ${@:3}
done