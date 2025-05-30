FROM node:latest

WORKDIR /var/www

COPY package.json .

RUN npm install

RUN mkdir documents

COPY index.js .

COPY .env .

ARG DEFAULT_PORT=80

ENV PORT ${DEFAULT_PORT}

EXPOSE ${PORT}

VOLUME ["/var/www/node_modules"]

CMD ["npm", "run", "start"]
