FROM node:latest

ARG PORT 80

WORKDIR /var/www

COPY package.json .

RUN npm install

COPY index.js .

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
