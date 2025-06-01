# Networking in Docker

Now that we have a basic knowledge about Containers and Images, and data store inside of them, we can switch our focus on how Containers can communicate each other. Moreover, working with networks in Docker, requires to understand the different types of communication, between Containers and others. Briefly, we can summarize communications' models in Docker, in three different models:

1. __Container to Public Network__. In this scenario, our Container uses public network to communicate with another entity outside the Container itself, and the host machine. Fortunately, no extra configuration for Docker is needed, once the Container is started, it is ready to handle communication between itself and the World Wide Web.

2. __Container to Host Machine__. In this scenario, the Container should communicate with the hosting machine, where the Container is hosted.

3. __Container to Container_. Finally, the most complicated scenario involves the Container that should communicate with another Container inside the same host machine.

## Container to Host Machine Communication

Let's start considering the following example, consisting in a JavaScript application, making a request to another service hosted inside the host machine:

```javascript
const PORT = 8000;

const URL = `http://localhost:${PORT}/api/v1/resource`;

fetch(URL)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((exception) => console.error(exception));
```

with this simple example, deployed inside a Container based on the [node](https://hub.docker.com/_/node) image, we are making an HTTP request from the Container to the host machine. However, if you try to run this Container it won't work. The reason stands in the destination domain that is `localhost`. Moreover, since `localhost` is a keyword used referring to the current machine, it will reference to the Container itself, thus not to the host machine.

To resolve this problem, we have to use a special keyword that is `host.docker.internal`, indicating to Docker that the destination url will be hosted inside the host machine, not to the Container. Finally, re-writing our example in the following way, will resolve the problem:

```javascript
const PORT = 8000;

const URL = `http://host.docker.internal:${PORT}/api/v1/resource`;

fetch(URL)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((exception) => console.error(exception));
```

## Container to Container Communication

The previous scenario should be quite convenient to implement, because it does not require any extreme changes in the source code, however I would not encourage to implement. The reason stands in the Docker meaning itself, we are using Docker because, we would like to deploy a software solution without configuring our host machine, and using a sharable and independent development environment. That is, services hosted inside the host machine, should be deployed in a Container instead.

Now, let's consider the same example, a JavaScript application, that communicates with another application, hosted in a different Container. Unsurprisingly, the previous example won't work.

How can we solve the problem, and what is the URL of the Container hosting the other application? Once we ran the Container, where the service has been hosted, we can use the commando `docker <container-name> inspect`, to show the Container's configuration.

Under the voice `NetworkSettings`, there are shown all the Container's internal configuration about the network. Therefore, `IPAddress` indicates the current Container's IP Address, that could be `172.17.0.1`. Therefore, we can change the URL of the JavaScript's script like this:

```javascript
const PORT = 8000;

const URL = `http://172.17.0.1:${PORT}/api/v1/resource`;

fetch(URL)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((exception) => console.error(exception));
```

and it would work correctly. However, this is not a recommended approach because we IP Address is hard coded, and it can change once we rebuild the Image. Thus, how can we avoid these problems and making the application still working?

Before showing the solution, we have to understand that Containers are deployed inside the Docker environment having a sub-net detached from the host's machine subnet. The following image shows this concept graphically:

<div style="width: 100%">
    <img src="../assets/3. Networking/Docker Network.png" alt="Docker Neworking"/>
</div>

As you can see, Containers can communicate by each other using a sub-net defined by Docker and detached for the host machine's network. This means that, each Container has an independent IP Address, inside the Docker Network. Thus, like in the previous example, we can use the IP Address as a valid address to be used for communicate from a container to another. However, being in a separate sub-net means also that the Container can have an unique name, to be used in place of its IP Address.

Let's create now the network shared between the Containers, and that is used by them to communicate each other. In fact, differently from the Volume's commands, we cannot create a Network during the Container's creation process, we have to create the former prior creating the Container. To create a Network, we can use the following command `docker network create <network-name>`.

Once the Network has been created, we can connect two Containers, using the same Network, by using the `--network` option, just like the following example:

```bash
docker run -d -p=80:80 --rm --name=first-container --volume=${PWD}:/var/www --network=container-network first-container-image

docker run -d --rm --name=second-container --volume=${PWD}:/var/www --network=container-network second-container-image
```

Executing the previous command, we created an environment that can be represented in the following figure:

<div style="width: 100%">
    <img src="../assets/3. Networking/Network Example.png" alt="Network Example"/>
</div>

There is one last thing, we have to update the source code, changing the name of the URL used from our previous example. Now, Docker can automatically recognize the destination point, using the name of the Container, if both of these Containers are placed in the same Network. Therefore, it is just necessary to update the URL of the code in the following name:

```javascript
const PORT = 8000;
const CONTAINER_NAME = 'second-container';

const URL = `http://${CONTAINER_NAME}$:${PORT}/api/v1/resource`;

fetch(URL)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((exception) => console.error(exception));
```

Moreover, as you can see from the previous commands, it is not necessary to specify the `-p` option in the Container's build command, if two Containers in the same Network have to communicate. Because, `-p` is used only by a Containers that have to communicate with the Host Machine, with a specific port.

## Network Drivers

Creating a Network in Docker, requires to use a specific driver, that is a specific communication's model between Containers. The default driver is __bridge__, in fact, in the previous command `docker network create <container-name>`, is it not necessary to specify the name of the driver, using the `--driver` option, since it is the default one.

Moreover, there are different drivers, that can be used in different scenarios:

* __host__ removes the isolation between the Container's Network and the Host Machine network, making the Containers as processes running directly on the Host Machine.

* __overlay__ allows different Containers hosted in different Docker Daemon, to communicate each other.

* __ipvlan__ gives to the user the control over the IPv4 and IPv6 addresses, such that the user can assign independently the addresses to a Container.

* __macvlan__ works similarly to __ipvlan__, however works on MAC Addresses. This is a recommended approach working with legacy software.

* __none__ isolate completely the Container from the Network.

## Attached Example

For this chapter, I would have to create a more complex example to show the truth power of Networks in Docker. Attached to this README, you will find three different folders, representing three different services that can communicate each other, that is: [database](./database/), [book](./book/) and [author](./author/).

Each of these services will be deployed in different Containers, exposing an unique port's number, except the database service, that will not expose any port to the host machine, since it is no needed. The following figure should help you in having a better understand of the whole example:

<div style="width: 100%">
    <img src="../assets/3. Networking/Example.png" alt="Example"/>
</div>

Moreover, to understand deeper how the example works, you have to have a look on [entrypoint](entrypoint.sh), where all the Docker's commands are written. Notice, how volumes are used to make data persisted, and how ports are connected using the custom internal network.
