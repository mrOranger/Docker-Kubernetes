FROM node:latest AS build
WORKDIR /var/www
RUN groupadd -r course-group && useradd -r -g course-group course-user
COPY --chown=course-user:course-group package.json .
RUN npm install
COPY --chown=course-user:course-group ./tsconfig.json ./tsconfig.json
COPY --chown=course-user:course-group ./src ./src
RUN npm run build

FROM node:latest
COPY --from=build /var/www/dist ./dist
EXPOSE ${PORT}
COPY package*.json ./
RUN npm install --only=production
CMD ["npm", "run", "start"]
