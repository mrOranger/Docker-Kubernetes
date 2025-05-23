# Starting from node image https://hub.docker.com/_/node
FROM node

# Everything will be executed inside /var/www folder
WORKDIR /var/www

# Starts from copying just the package.json and package-lock.json
COPY package.json .
COPY package-lock.json .

# Installing dependencies
RUN npm install

# Copy everything from /src in /var/www/src
COPY ./src ./src

# Just for documenting image ...
EXPOSE 80

# Execute 'npm run start' command
CMD [ "npm", "run", "start" ]
