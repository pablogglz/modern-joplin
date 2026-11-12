#!/bin/sh
# Packages each plugin as dist/<id>.jpl (a .jpl is a .tar)
set -e
cd "$(dirname "$0")"
mkdir -p dist
for d in features theme; do
  id=$(sed -n 's/.*"id": *"\([^"]*\)".*/\1/p' "$d/manifest.json")
  (cd "$d" && tar -cf "../dist/$id.jpl" *)
  echo "dist/$id.jpl"
done
