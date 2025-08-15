FROM node:latest

WORKDIR /var/www

RUN groupadd -r clients-group && useradd -r -g clients-group clients-user

COPY --chown=clients-user:clients-group package.json .

RUN npm install

COPY --chown=clients-user:clients-group . .

ENV APP_NAME clients
ENV APP_PORT 80
ENV ORDERS_SERVICE_HOST orders-application-service.default
ENV PRODUCTS_SERVICE_HOST products-application-service.default

EXPOSE ${APP_PORT}

CMD ["npm", "run", "start"]
