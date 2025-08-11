FROM node:latest

WORKDIR /var/www

RUN groupadd -r products-group && useradd -r -g products-group products-user

COPY --chown=products-user:products-group package.json .

RUN npm install

COPY --chown=products-user:products-group app.js .
copy --chown=products-user:products-group controllers controllers

ENV APP_NAME clients
ENV APP_PORT 80

EXPOSE ${APP_PORT}

CMD ["npm", "run", "start"]
