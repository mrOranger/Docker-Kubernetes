FROM node:latest

WORKDIR /var/www

RUN groupadd -r course-group && useradd -r -g course-group course-user

COPY --chown=course-user:course-group package.json .

RUN npm install

COPY --chown=course-user:course-group ./tsconfig.json ./tsconfig.json

COPY --chown=course-user:course-group ./src ./src

RUN npm run build

EXPOSE ${PORT}

USER course-user

CMD ["npm", "run", "start"]
