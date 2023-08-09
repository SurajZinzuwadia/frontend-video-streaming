#!/bin/bash

# Cleanup docker containers
for container in $(docker ps -a -q); do
    echo "container: $container"
    docker stop $container
    docker rm $container
    if [ $? -ne 0 ]; then
        echo "[ERROR]: FAILED to remove the container : $container"
        continue
    fi
done

# Cleanup docker images
for image in $(docker images -a -q); do
    echo "Image: $image"
    docker rmi -f $image
    if [ $? -ne 0 ]; then
        echo "[ERROR]: FAILED to delete the image: $image"
        continue
    fi
done