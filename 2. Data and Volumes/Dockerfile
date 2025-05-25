FROM node:latest

WORKDIR /var/www

COPY package.json .

RUN npm install

RUN mkdir documents
COPY index.js .
COPY .env .

EXPOSE 80

CMD ["npm", "run", "start"]
