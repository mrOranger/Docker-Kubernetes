FROM node:latest

WORKDIR /var/www

COPY package.json .

RUN npm install

RUN mkdir documents
COPY index.js .
COPY .env .

EXPOSE 80

VOLUME ["/var/www/node_modules"]

CMD ["npm", "run", "start"]
