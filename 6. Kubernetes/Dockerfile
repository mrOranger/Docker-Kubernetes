FROM node:latest

WORKDIR /var/www

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "run", "start"]
