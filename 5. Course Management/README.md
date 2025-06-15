# Midterm Project

In this section I will upload a midterm project, to have a recap of Docker and how can we use all the previous theoretical concepts in a practical example. We will implement a micro-service system used to manage professional supplied by an institutional organization.

The overall architecture can be represented in the following figure:

<div style="width: 100%">
    <img src="../assets/5. Course Management/architecture.png" alt="Architecture"/>
</div>

Moreover, attached to this project, you will find two Docker Compose file. The former [development.yaml](development.yaml) can be used during project's development; in fact, as you can notice, each service as an own bind mound volume, and an exposed port, allowing the service to be available from you host machine. The latter [deploy.yml](deploy.yaml), is the final project, having all the services running inside the Docker Engine, and not exposing any port. Moreover, only the final Compose's Image contains the Reverse Proxy made using Ngnix.

The Dockerfile of the service has a particular syntax that we did not see yet. For example, considering the file [deploy.dockerfile](./services/course/deploy.dockerfile):

```dockerfile
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
```

it seems that the Dockerfile is made by using two different Dockerfile, since there are two `FROM` instructions. However, each of these instructions define a layer of the final Image, and can be referenced by each other, using the `AS` keyword.

In fact, while the first layer is used to build the whole project, the second one is used to start the built source code, using the npm custom command `npm run start`. Moreover, it is a good practice to define a custom user inside a new group, to prevent any issues concerning acting as the root user in the Container.

To start the project, you can use the following two commands:

```bash
docker compose --file=development.yaml up -d    # Run the Containers in 'development mode'
docker compose --file=deploy.yaml up -d         # Run the Containers in 'deploy mode'
```
