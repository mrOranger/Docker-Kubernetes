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
    author:
        build:
            dockerfile: author.dockerfile
            context: ./author
```

using `build` we are indicating to Docker the instructions where to find the Dockerfile to create the Image. Thus `dockerfile` is used to specify the name of the Dockerfile to use; while `context` indicates there to find that Dockerfile.

### Volumes and `volumes` keyword

Now that we indicated the Dockerfile to use to create the Image, we have to deal with Volumes. Specifying a Volume for a service, can be done using the keyword `volumes`. Then, we have to define a list of volumes with the same syntax used for previous command.

```docker-compose
volumes:
    - author-node-modules:/var/www/node_modules
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
