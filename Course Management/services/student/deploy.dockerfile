FROM node:latest

WORKDIR /var/www

RUN groupadd -r student-group && useradd -r -g student-group student-user

COPY --chown=student-user:student-group package.json .

RUN npm install

COPY --chown=student-user:student-group ./tsconfig.json ./tsconfig.json

COPY --chown=student-user:student-group ./src ./src

RUN npm run build

EXPOSE ${PORT}

USER student-user

CMD ["npm", "run", "start"]
