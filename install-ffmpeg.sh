#!/bin/bash

# From apt (If you got Ubuntu 20.04)

# sudo apt update
# sudo apt install ffmpeg=7:4.2.4-1ubuntu0.1 # We want version 4.2.4 at least

# From static build

wget https://www.johnvansickle.com/ffmpeg/old-releases/ffmpeg-4.4.1-amd64-static.tar.xz
tar xvf ./ffmpeg-4.4.1-amd64-static.tar.xz
# rm ./ffmpeg-4.4.1-amd64-static.tar.xz
mkdir -p ./ffmpeg-layer/bin
cp ./ffmpeg-4.4.1-amd64-static/ffmpeg ./ffmpeg-layer/bin
cp ./ffmpeg-4.4.1-amd64-static/ffprobe ./ffmpeg-layer/bin
# rm -rf ./ffmpeg-4.4.1-amd64-static
cd ./ffmpeg-layer
zip -r ../ffmpeg-layer.zip .
# rm -rf ./ffmpeg-layer
