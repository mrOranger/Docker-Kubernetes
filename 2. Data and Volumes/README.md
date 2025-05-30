# Data and Volumes

In the previous chapter, we saw how to copy files and folders from and to a Container, using the command `docker cp <container-id>:<source-file> <destination-folder>`. However, in real application development, it is not acceptable to execute this command, each time a change on a file has been made.

Fortunately, a Container's content can be permanently stored, such that data are not lost once the Container is stopped or deleted. Docker stores data in a data structure known as __Volumes__. Of course, any kind of data can be stored in a Volume, from application's data to source file that must be executed inside the Container.

Attached to this chapter of the repository, there is a simple node.js project, listening on port 80 for POST request containing body like `{"data": "content"}`, and that stores the content of the HTTP request inside a `.dat` file in the `documents` folder. Moreover, there is a [Dockerfile](./Dockerfile), used to create the application's container. You run the application by using the commands:

```bash
    docker build --name=data-and-volumes --file=anonymous.dockerfile .
    docker run -d --rm -p=80:80 data-and-volumes
```

Once you have ran the application, and made a `POST` request on `http://localhost`, you will notice that nothing inside the `documents` folder has been stored.

The reason behind this is that, we are storing data inside the Docker Container, not in the host machine directory, and we did not configured in any way the connection between the Docker Container and our machine. Moreover, stopping and restarting the application, will remove the data previously stored in the `documents` directory. In this chapter, we will see how overcome this behavior, introducing the Docker Volumes.

## Introducing Volumes

Before trying to solve our problem, we have to understand what Volumes are in Docker. According from the Docker documentation:

> Volumes are persistent data stores for containers, created and managed by Docker.

However, I prefer to say that: _Volumes are a bind mechanism between our Docker application, and our host machine. Such that, files in the Container can be persisted because they are stored inside the local hard drive_

Creating Volumes, a Docker application can use file independently from the host machine, since Docker can easily work on multi platform application. Moreover, in development scenarios, each developer can write its own code, without losing it after that the Container has been shut down or deleted.

Defining a Volume to attach to a Docker Container, requires to set this command inside the Dockerfile: `VOLUME ["/var/www/documents"]`. That is, a Volume will be created mapping everything inside the folder `/var/www/documents`, inside the Container. However, if you try to re-create the Image, and re-build the Container from that Image, nothing will happens ... moreover, data are lost forever.

The point is, we created an __anonymous Volume__, that is: Docker knows that have to create a Volume for the folder `/var/www/documents`. However, it stores this Volume in its internal cache, therefore, once the Container has been removed, the Volumes too. Moreover, if you run the Container in detached mode, and then write `docker volume ls`, you will see a Volume with a long id, that is the anonymous Volume created by the Docker automatically, and stores wherever in our host machine.

### Named Volumes

To overcome the previous problem, we have to define a __named volume__, that is assigning a name to a Volume such that the next time that a Container will use that Volume, the data inside the Volume will be restored.

We do not need the `VOLUME ["/var/www/documents"]` command, since it is used to create an anonymous Volume. Moreover, we have to specify the name of the Volume in the `docker run command`, just like the following way: `docker run -d -p=80:80 -v=data-and-volumes:/var/www/documents --name=data-and-volumes data-and-volumes`.

With the previous command, we are indicating to Docker Engine to create a new Volume named `data-and-volumes`, where the content of the folder `/var/www/documents` will be stored and persisted. Inside the [Dockerfile](./Dockerfile), you can see the commands used, like in the [anonymous.dockerfile](./anonymous.dockerfile) without the `VOLUME` command, that is not needed no more.

Now, once the container has been stopped and re-start, using the commands:

```shell
docker container stop data-and-volumes
docker container start data-and-volumes
```

we can see that data inside the Container has been persisted permanently, and will be available until the Volume will be deleted. Moreover, we can see the name and type of the Volume, using the command: `docker volume ls`. Eventually, all the unused Volumes can be deleted using the command: `docker volume prune`.

## Bind Mounts

If you are developers, I hope you will use Docker in you development's daily tasks. However, it seems that is not easy to use, in writing code that will change often. In fact, as we saw, each time we made a change in the source code, it is necessary to re-build the Image, so that the Dockerfile can copy again the code inside the next Containers. How can we solve this problem?

Docker defined __bind mounts__ to connect directly our host machine to a Container, such that, each time a change is made here, it will be reflected directly in the Container's content.

To use a bind mount, we have to add another volume to the Docker Container command, that has the following syntax: `-v <host-path>:<container-path>`. That is, the previous command to create and run a Docker Container, should be like this: `docker run -d -p=80:80 -v=data-and-volumes:/var/www/documents -v /host/user/app:/var/www --name=data-and-volumes data-and-volumes`. However, once we ran this command, the Container is stopped immediately, and seems that no command defined inside [Dockerfile](./Dockerfile) has been executed.

The explanation to this "strange" behavior stands in how Docker manages bind mounts. When we indicate to Docker that there is a bind mount, connecting the data from our host machine to a Docker Container, we are telling to Docker: "hey, copy the content from the host machine, and overwrite the Container's content". Event though in the Dockerfile there are instructions like `RUN npm install` that creates a `node_module` folder.

Therefore, we have to indicate Docker that the folder `node_module` must not be overwritten, when we are using bind mounts. There are two ways to achieve this: add `VOLUME ["/www/var/node_modules"]` inside the Dockerfile, or using another flag `-v /var/www/node_modules` in the Container's executions' script (of course, the first path needs that the Image must be re-build).

In both cases, we are creating an anonymous Volume, where the content of the `/var/www/node_module` will be store. Moreover, once the container will be removed, the Volume will be removed too.

### Volume's Permissions

Defining a bind mound like `-v /home/user/workspace/app:/var/www`, we are allowing the current folder to write inside the Container. Now, since it is perfectly right to write inside the Container, it is not recommended to allow the Container to write in a specific directory, because, write operations can delete some critical files, and waste our time in creating the Docker Container.

To ensure that a Container can only read the content of a folder, using a bind mount, we have to specify permissions of the Container. That is, we have to add an extra option to the bind mount, that is `readonly` or `ro`.

Finally, the command to create a bind mount, should be like the following example: `-v /home/user/workspace/app:/var/www:readonly`

## Volume's Commands

Let's go back to the previous command:

```bash
docker run
    -d
    --rm
    -p=80:80
    -v=data-and-volumes:/var/www/documents
    -v=/host/user/app:/var/www
    --name=data-and-volumes
    data-and-volumes
```

after that the Volume has been created, we can have additional information about the volumes using the command: `docker volume ls`. The command shows a list of all the available volumes, anonymous or not. Anonymous volumes have a random identifier generated by the Docker Engine.

Let's have a look on the details of our named volume `data-and-volumes`, using the command `docker volume inspect <volume-name>`. After running this command, a JSON like this will appear:

```json
[
    {
        "CreatedAt": "2025-05-27T06:36:18Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/data-and-volumes/_data",
        "Name": "data-and-volumes",
        "Options": null,
        "Scope": "local"
    }
]
```

as we can see, there are different useful information about our Volumes. However, we are interested in `Mountpoint`, indicating the absolute path of Docker's internal Virtual Machine, where Volume's data are actually stored. Moreover, if we created the Volume as readonly, in the `options` field, we will see the `readonly` option.

If we would like to remove a Volume, we have to use the command `docker volume rm <volume-name>`. However, observing the previous command `docker run`, where we indicated that the Container should be removed after have been stopped, we can observe that once the Container has been stopped, the attached anonymous Volumes have been deleted. This behavior can be explained by the fact that, anonymous Volumes are single-use Volumes, that can be deleted after that are no more useful, that is, once the Container has been removed.

## .dockerignore

Let's go back to our [Dockerfile](./Dockerfile), where we specified the command: `COPY . .`. Now, do we need everything to be copied from our host machine, inside the Container? Shall we lighten the size of the Container, and make the building-process of the Image lighter? Well, we can do this using the `.dockerignore` file, that works like a normal `.gitignore, but for Docker.

Now, what do we have to specify inside the .dockerignore, well, first of all, we do not need the Dockerfile itself, once the Container is running. Moreover, since the dependencies are installed using the command `RUN npm install`, we do not have to copy our node_modules folder.

In this specific scenario, the .dockerignore can also be omitted, since we are working with a small project, and ignoring some elements do not have such an important impact in the Image's building process. However, is bigger project, is strictly recommended, since we can reduce the final size of an Image, from GB to MB.

## Environment Variables & Build Arguments

In this brief example project, as you can see, there is a .env file, used by Node.js to read the environment variables used to work. Docker allows to pass environment variables, to an Image or a Container, using the commands `ENV` or `ARG`.

Now, why should Docker use two different keywords, representing the same concept? As we saw with `CMD` and `RUN`, both of these commands, works and are used in different instances of Docker's building process. Moreover, while `ARG` is used to build an Image, then is used inside the Dockerfile; `ENV` is used to pass environment variables to the application, that will be deployed in the Container. Furthermore, both variables can be used as arguments outside the Dockerfile, and inside the Image or Container commands, that is: `--build-arg` is used to pass variables using the command `docker build`; while, `--env` is used to pass variables to the Container using `docker run` command.

### Environment Variables

As we said, environment variables are used by creating a Container from an Image. There are three different ways to specify and pass environment variables to a Container.

The first and simpler way to define an environment variable for a Container, consists in using the `ENV` keyword inside the Dockerfile. As we can observe inside [Dockerfile](./Dockerfile), we added this commands:

```dockerfile
ENV PORT 80
EXPOSE ${PORT}
```

now, `ENV` does not work as you could expect. In fact, it does not declare an environment variable named PORT having as value 80. Moreover, it checks if the PORT variable has been set, and eventually assign to it the default value 80, if no environment variable has been found. If we would like to use the environment variable inside the Dockerfile, we have to use the syntax `${}`.

The second way to declare an environment variable for a Docker Container, is to use the option `--env`, inside the Container's run command, just like in the following way:

```bash
    docker run
        -d
        -p=80:80
        --rm
        --env PORT=80
        --volume=${pwd}:/var/www
        --volume=data-and-volumes:/var/www
        <your-image-name>
```

Eventually, you can specify the environment variables inside a .env file, and indicating to Docker that can find the environment variables inside that file, using the `--env-file`, inside the previous command. Moreover, this last option is the safest, because, defining environment variables hard coded, or using them as command-line variables, allows users to read them. On the other hand, defining variables inside a separate .env file, means that they won't be read from other uses, until you commit the file with all the data.

### Build Arguments

Now, there is still a problem in using environment variables in this ways, that is: we defined environment variables for Containers based on an Image where the default port is 80, and cannot be changed. That is, we cannot build Containers from the same Image, without specifying a different exposed port.

As we said before, while environment variables works for Containers, build arguments are used by Image. That is, we have to define a build argument for the Image, such that, we can create different Images with different ports. Using the `ARG` command, we can specify a build argument having a default value, as we can observe inside the [Dockerfile](./Dockerfile):

```dockerfile
ARG DEFAULT_PORT=80

ENV PORT ${DEFAULT_PORT}

EXPOSE ${PORT}
```

every time that we build an Image, the DEFAULT_PORT build argument is set to 80, until a different value is specified inside the `docker build` command. Moreover, notice that we did not defined the `ARG` command at the top of the Dockerfile, because, remind that Docker builds Images using a layered approach, if the DEFAULT_PORT will change, the whole Image's layer will be re-build again.
