FROM node:latest

WORKDIR /var/www

RUN groupadd -r orders-group && useradd -r -g orders-group orders-user

COPY --chown=orders-user:orders-group package.json .

RUN npm install

COPY --chown=orders-user:orders-group app.js .
COPY --chown=orders-user:orders-group controllers controllers
COPY --chown=orders-user:orders-group services services

ENV APP_NAME clients
ENV APP_PORT 80

EXPOSE ${APP_PORT}

CMD ["npm", "run", "start"]
