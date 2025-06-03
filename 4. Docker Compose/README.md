# Docker Compose for Orchestrating Multiple Containers

In the previous chapter, I attached a [entrypoint.sh](../3.%20Networking/entrypoint.sh) file, where you can find all the commands that must be used to create the Containers. However, let's take a look at one random of these commands:

```bash
docker run -d --rm \
    --env-file=./database/.env \
    --name=database \
    --network=custom-network \
    --volume=database-book:/var/www/book \
    --volume=database-author:/var/www/author \
    --volume=database-node-modules:/var/www/node_modules \
    database
```

this is a quite longer command to be executed in the shell. Moreover, the Container is not so complicated, that is in real-world application, writing commands directly inside the console, about Docker commands, is quite a cumbersome task.

Luckily, there is an additional tool offered by Docker, that is the __Docker Compose__. The Docker Compose tools allows us to avoid using long Docker commands, and use a single declaration file, to build an entire environment, made by many different Containers, using Volumes and Networks.

## Docker Compose Structure

As mentioned before, Docker Compose is a tool to avoid writing longer Docker commands, and uses a single declaration file, to create a complex Container infrastructure. Moreover, Docker Compose does not replace Dockerfile since these are the basic structures used by Docker to create Image.

In fact, Docker Compose does not create Images or Container, moreover is an orchestrating tool. Creating Images will require always a Dockerfile and its set of instructions. We can use Docker Compose to orchestrate small projects or single Container application, however, it is not a recommended approach, since we are over-engineering our project.

Explaining Docker Compose requires an example: let's suppose to create an application, with a backend, a frontend and a database. Each of these elements composing our applications are known as __Services__. Each Service is connected with others using a Network, moreover, each Container represented by a Service, has a Volume to ensure data persistency. Each of these element, must be orchestrated to ensure that the application works correctly, and then Docker Compose creates a single file, known as __docker-compose.yaml__, where we describe our application in form of Services, just like the following image:

<div style="width: 100%">
    <img src="../assets/4. Docker Compose/Example.png" alt="Example"/>
</div>

as you can observe, each Container with its Volume, has been stored inside a Service. Moreover, each Service uses an internal Network, and can expose a port to the host machine. Docker Compose, ables us to create such a structure, and define each element in term of Services.

## Docker Compose File Configuration

In this chapter we will use the sample application that we implemented in the previous chapter, but we will replace the [entrypoint.sh](../3.%20Networking/entrypoint.sh) with [docker-compose.yaml](./docker-compose.yaml). As you can observe, the Docker compose configuration file, starts with the following declaration:

```docker-compose
version: "3.8"
```

Docker Compose configuration's file follows a specific set of instructions, just like XML files. That is, this instructions allows us to declare which specification version of Docker Compose we would like to use. Different versions defines commands in different ways, nowadays the 3.8 version is the latest version used by Docker.

The next instruction that you will find in [docker-compose.yaml](docker-compose.yaml) is:

```docker-compose
services:
    author:
    book:
    database:
```

`services` is the keyword used to define our Service. In this example, we have three operating Services representing our Containers. Each Service must have an unique name, and the below instructions under the Service's name are used to declare the configuration of each Service. Notice that, up to this moment, the indentation matters, since YAML files use indentation for start and ending blocks.

### Connecting Dockerfile in Docker Compose

Let's start configuring each services, starting from the author Container. In the previous chapter, we defined the Image up to build the Container, using the following [Dockerfile](../3.%20Networking/author/Dockerfile), and the following command to create the Container:

```bash
docker run -d -p=8000:80 --rm \
    --env-file=./author/.env \
    --name=author \
    --network=custom-network \
    --volume=author-node-modules:/var/www/node_modules \
    author
```

We just created the Service named 'author', however, we have to specify that the Container is based on an Image defined in the Dockerfile inside another folder. Specifying where to find a Dockerfile to create such Service, can be done using another command:

```docker-compose
services:
    <service-name>:
        build:
            dockerfile: <docker-file-name>
            context: <docker-file-path>
```

using `build` we are indicating to Docker the instructions where to find the Dockerfile to create the Image. Thus `dockerfile` is used to specify the name of the Dockerfile to use; while `context` indicates there to find that Dockerfile.

### Volumes and `volumes` keyword

Now that we indicated the Dockerfile to use to create the Image, we have to deal with Volumes. Specifying a Volume for a service, can be done using the keyword `volumes`. Then, we have to define a list of volumes with the same syntax used for previous command.

```docker-compose
volumes:
    - <volume-name>:<volume-path>
```

Just like the `--volume` option in the `docker run` command, we can specify the type of volume using a semi-column after the folder inside the Volume. Moreover, notice that we specified each Volume using the `-` just like a list. Sometimes, in Docker Compose you will use this syntax, while sometimes not. It is necessary to use this syntax, when we are dealing with lists of single values. On the other hand, if we specify a list of values like `<key>: <value>`, we do not need to place the `-` in the beginning of each item.

Once we defined a named Volume for a Service, Docker Compose requires to specify each of these Volumes outside the Services' declaration. That is like the following example:

```docker-compose
services:
    <service-name>
        volumes:
            - <volume-name>:<volume-path>
volumes:
    <volume-name>:
```

### Environment Variables with `env_file`

The next step, will to assign the environment variables to a Service that will be transformed in a Container. There are two different ways to specify Environment Variables in Docker Compose, both of them are shown here:

```docker-compose
environment:
    - APP_NAME=<application-name>
    - APP_PORT=<application-port>
env_file:
    - <relative-path-to-env-file>
```

that is, we can pass Environment Variables directly to the Services, specifying them just like a list under the `environment` keyword, or we can link an external environment file, using the `env_file` keyword, with the relative path of the file.

### Network in Docker Compose

Finally, we have to create the internal Network through the Containers will communicate each other. Fortunately, Docker Compose creates automatically a Network when we define a docker-compose file. That is, we do not need to specify any Network to be used by the Containers. On the other hand, I would like to show you how to specify a network and which kind of options we can use in Docker Compose.

A Network can be created in Docker Compose, using the keyword `networks`, just like the following example:

```docker-compose
services:
    <service-name>
    networks:
        - <network-name>
```

Once we created a Network, just like in `docker run` we have to specify that there is an extra entity Network, to be declared outside of the services' declarations. Moreover, we can specify an alternatively driver to use and to be different from __bridge__, which is the default Network's driver:

```docker-compose
services:
    <service-name>
    networks:
        - <network-name>

networks:
    <network-name>:
        driver: <driver-name>
```

Alternatively, you can avoid the use of `driver` keyword, if you would like to use the default driver. Moreover, you have to specify the name of the network with the semi-columns, since it is a Docker Compose convention.

### Publish a Port with `ports`

We configured the Volumes and the Network, however, up to this moment we are not able to communicate from our host machine to the Services, because we did not exposed any internal port. As we saw in the starting command, we used the command `p=<host-port>:<container-port>` to expose a Container's port to the host machine. In the same way, we can use the `ports` option, to bind a port from the Service to the host machine:

```docker-compose
services:
    <service-name>:
        ports:
            - <host-port>:<container-port>
```

Moreover, now we can understand the usefulness of the `EXPOSE` keyword in the Dockerfile. In fact, if we did not have any reminder about the exposed port of the Container, it is useful to have a look inside its Dockerfile, before starting to write the Docker Compose configuration's file.

### Starting Order

Most of the time, we have to define a starting order between the Services, such that a Service must be started only after another has been started. Just like in real-context application, we would like to start a backend application, only once the database has been successfully started.

Defining an order between the services can be done using the `depends_on` label:

```docker-compose
services:
    <service-A>:
        depends_on:
            - <service-B>
    <service-B>:
        ports:
            - <host-port>:<container-port>
```

That is, in this shorter example, the Service A must be started only once the Service B has been started successfully, even though the Service A is defined before the Service B in the Docker Compose file. Moreover, as you can see, a Service can depends on a set of Services, not only by once.

### Start Docker Services

Once our Docker Compose's configuration file is completed, we can proceed to start each Service by using the command `docker compose up`. However, using only this command will start the Services in attached mode. On the other hand, if we would like to start each Service in detached mode, we have to attach the `-d` option to the command.

```docker-compose
docker compose up -d
```

Shutting down the Services requires to use `docker compose down`. However, the Volumes won't be removed, since it is required another option that is `-v`, to indicate to delete all the Volumes attached to the Services.

```docker-compose
docker compose down -v
```

### Naming in Docker Compose

After that the Services has been started successfully, you would probably notice that the generated Containers have a quite strange name. The reason is that in Docker Compose file we assigned names only to Services, not to Container.

To assign a name to a Container created using the Docker Compose, we have to use the `container_name` label, for each Service that we defined. Of course we cannot assign the same name to different Containers, otherwise an error will be thrown by the Docker Compose.

However, if the name assigned to Containers from Docker are random values. How can the Container still works if we used a different name for the communication between Containers? The reason is that, for Network's internal communication in Docker Compose, specify the name of the Service is enough to Docker to understand which one is the destination Container.
