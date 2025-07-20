FROM node:latest

WORKDIR /var/www

COPY package.json .

RUN npm install

COPY app.js .

RUN mkdir books

EXPOSE 80

CMD ["npm", "run", "start"]
