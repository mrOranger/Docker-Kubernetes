FROM node:latest

WORKDIR /var/www

RUN groupadd -r orders-group && useradd -r -g orders-group orders-user

COPY --chown=orders-user:orders-group package.json .

RUN npm install

COPY --chown=orders-user:orders-group . .

ENV APP_NAME clients
ENV APP_PORT 80
ENV CLIENTS_SERVICE_HOST clients-application-service.default
ENV PRODUCTS_SERVICE_HOST products-application-service.default

EXPOSE ${APP_PORT}

CMD ["npm", "run", "start"]
