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
