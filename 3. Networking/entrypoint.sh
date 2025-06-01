#!/bin/bash

set -e

echo ">>> Creating Network ..."
docker network create custom-network

echo ">>> Creating Database Image ..."
docker build -q --tag=database ./database

echo ">>> Creating Author Image ..."
docker build -q --tag=author ./author

echo ">>> Creating Book Image ..."
docker build -q --tag=book ./book

echo ">>> Creating Database Container ..."
docker run -d --rm \
    --env-file=./database/.env \
    --name=database \
    --network=custom-network \
    --volume=database-book:/var/www/book \
    --volume=database-author:/var/www/author \
    --volume=database-node-modules:/var/www/node_modules \
    database

echo ">>> Creating Author Container ..."
docker run -d -p=8000:80 --rm \
    --env-file=./author/.env \
    --name=author \
    --network=custom-network \
    --volume=author-node-modules:/var/www/node_modules \
    author

echo ">>> Creating Book Container ..."
docker run -d -p=8001:80 --rm \
    --env-file=./book/.env \
    --name=book \
    --network=custom-network \
    --volume=book-node-modules:/var/www/node_modules \
    book

echo "<<< Setup Completed Successfully! >>>"
