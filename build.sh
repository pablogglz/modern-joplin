#!/bin/sh
# Empaqueta cada plugin en dist/<id>.jpl (un .jpl es un .tar)
set -e
cd "$(dirname "$0")"
mkdir -p dist
for d in features theme; do
  id=$(sed -n 's/.*"id": *"\([^"]*\)".*/\1/p' "$d/manifest.json")
  (cd "$d" && tar -cf "../dist/$id.jpl" *)
  echo "dist/$id.jpl"
done
