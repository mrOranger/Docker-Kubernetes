#!/bin/sh
set -e  # Ferma lo script se un comando fallisce

docker container stop $(docker ps -aq) || true
docker container rm $(docker ps -aq) || true

docker image prune -a -f
docker volume prune -f
docker network prune -f

docker network create kubernetes-network

docker login

for dir in clients orders products; do
    cd $dir
    docker compose up -d --build
    cd ..
done

images="
kubernetes-networking-clients-database
kubernetes-networking-clients-service
kubernetes-networking-orders-database
kubernetes-networking-orders-service
kubernetes-networking-products-database
kubernetes-networking-products-service
"

for img in $images; do
    docker push mroranger/$img:latest
done
