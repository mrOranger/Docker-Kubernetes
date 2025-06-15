FROM node:latest AS build
WORKDIR /var/www
RUN groupadd -r student-group && useradd -r -g student-group student-user
COPY --chown=student-user:student-group package.json .
RUN npm install
COPY --chown=student-user:student-group tsconfig.json .
COPY --chown=student-user:student-group ./src ./src
RUN npm run build

FROM node:latest
COPY --from=build /var/www/dist ./dist
EXPOSE ${PORT}
COPY package*.json ./
RUN npm install --only=production
CMD ["npm", "run", "start"]
