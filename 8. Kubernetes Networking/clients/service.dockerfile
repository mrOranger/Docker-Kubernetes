FROM node:latest

WORKDIR /var/www

RUN groupadd -r clients-group && useradd -r -g clients-group clients-user

COPY --chown=clients-user:clients-group package.json .

RUN npm install

COPY --chown=clients-user:clients-group app.js .
COPY --chown=clients-user:clients-group controllers controllers
COPY --chown=clients-user:clients-group services services

ENV APP_NAME clients
ENV APP_PORT 80

EXPOSE ${APP_PORT}

CMD ["npm", "run", "start"]
