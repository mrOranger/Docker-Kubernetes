# Data Persistence in Kubernetes

Up to this moment, we set of a simple Docker Container, deployed inside a Kubernetes Cluster. Nevertheless, we did not configured any additional feature of the Container, and in this chapter we will focus on attach a Volume to our Docker Container, such a way the data will be persisted after that the Deployment has been shut down.

Why do we need to manage Volumes also in Kubernetes? It is enough not indicating to the Docker Engine, that Volumes are attached to the Container that will be run in the Worker Node? Unfortunately no. In the previous chapters, we were running the Container explicitly using the Docker CLI commands, or a Docker Compose file. However, from now on, Kubernetes will manage the Docker Container's for us. Therefore, we have to indicate to Kubernetes how Volumes - and data stored inside it - should be managed properly.

Volumes managed by Kubernetes are more complex than their Docker counterparts. While Volumes in both systems persist beyond Container's removal, a Volume attached to a Pod is destroyed when the Pod is removed from the Worker Node. Furthermore, Volumes in Kubernetes support a large set of drivers, since Kubernetes is designed to be executed in a cloud environment.

Attached to this folder, `deployment.yaml` and `service.yaml` files are used to create a new Deployment named kubernetes-volumes, having a single running Pod. Starting the deployment using the command: `kubectl apply -f=deployment.yaml -f=service.yaml`. Making a GET request on `/` will return the list of all the available books; while making a POST request on `/book` having a body structured in the following way, will store a new book inside the `/book` directory:

```json
{
    "title": string,
    "publishedAt": string,
}
```

Let's try to crash the whole application, making a PATCH request to `/error` endpoint. Waiting that Kubernetes restart the Pod, we will notice that, making a GET request on `/book` will return any book no more. In fact, as we mentioned before, Kubernete's volumes are attached to a single Pod, then if it failes the whole volume will be lost forever.

Chaning the default's Kubernetes behaviour requires to specify a driver through which the Volumes will be defined. According to the official Kubernetes documentation, there are many different drivers to chose, however we will see only a small part of them.

## `emptyDir` driver

The first and simplest Volume's type is the `emptyDir`. As the name suggest, it creates an empty directory outside the Pod, and persists data permanently. Using this driver requires to specify the driver inside the Container's configuration. Opening the [`deployment.yaml`](./deployment.yaml) file, you will notice the following lines below the Pod specification:

```yaml
spec:
    containers:
        - name: kubernetes-volumes
          image: mroranger/kubernetes-volumes:1
        - volumeMounts:
            - mountPath: /var/www/book
              name: book-volumes
    volumes:
        - name: book-volumes:
          emptyDir: {}
```

using the `volumes` directory we are defining a new volume having a name, and the type of its driver. Below the `containers` directive, `volumeMounts` defines how the Kubernetes volume should be attached to the current Pod. In this case, we would like to attach the volume book-volumes, which stores the content of the `/var/ww/book` folder.

## `hostPath` driver

The `emptyDir` driver creates a new empty directory inside of the current Pod. Suppose that our Kubernetes cluster is composed of a single Worker Node, having three Pods running. Each running Pod has an `emptyDir` driver attached to it, implying that each Pod has an independent volume where data are stored, that is, making multiple HTTP POST request will store a new entity inside a Pod, and then the HTTP GET request will return only the data of the current Pod, not the 'global' information available in the Worker Node.

Working with multiple Pod requires a better approach in storing data using Volume. `hostPath` attaches a Volume directly into the Worker Node file system. Containers running inside the Pod will use this 'shared' Volume, that is, will be synchronized when updated are made.

Furthermore, there are many options that can be specified to this driver:

- **DirectoryOrCreate**. Creates an empty directory in the path specified inside the Volume configuration. By default, the directory's permissions will be set to 0755.

- **Directory**. Attach the volume to an existing directory.

- **FileOrCreate**. Creates an empty file if not exists, assigning by default le 0644 permission, having the same group and ownership of Kubelet.

- **File**. Attach the Volume to an existing file.

- **Socket**. An Unix socket must exists at the given path.

A configuration example of this driver is the following:

```yaml
spec:
    containers:
        - name: kubernetes-volumes
          image: mroranger/kubernetes-volumes:
          volumeMounts:
            - mountPath: /var/www/books
              name: book-volumes
    volumes:
        - name: book-volumes
          hostPath:
            path: /var/www/books
            type: DirectoryOrCreate

```
