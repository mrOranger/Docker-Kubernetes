FROM node:latest

WORKDIR /var/www

RUN groupadd -r professor-group && useradd -r -g professor-group professor-user

COPY --chown=professor-user:professor-group package.json .

RUN npm install

COPY --chown=professor-user:professor-group ./tsconfig.json ./tsconfig.json

COPY --chown=professor-user:professor-group ./src ./src

RUN npm run build

EXPOSE ${PORT}

USER professor-user

CMD ["npm", "run", "start"]
