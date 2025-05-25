FROM node

WORKDIR /var/www

CMD [ "node", "-e", "console.log('Hello World from Docker!')"]
