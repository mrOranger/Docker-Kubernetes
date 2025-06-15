FROM node:latest AS build
WORKDIR /var/www
RUN groupadd -r professor-group && useradd -r -g professor-group professor-user
COPY --chown=professor-user:professor-group package.json .
RUN npm install
COPY --chown=professor-user:professor-group ./tsconfig.json ./tsconfig.json
COPY --chown=professor-user:professor-group ./src ./src
RUN npm run build

FROM node:latest
COPY --from=build /var/www/dist ./dist
EXPOSE ${PORT}
COPY package*.json ./
RUN npm install --only=production
CMD ["npm", "run", "start"]
