#!/bin/bash
mkdocs build
cd site
git add .
git commit -m "upload"
git push -f origin master
