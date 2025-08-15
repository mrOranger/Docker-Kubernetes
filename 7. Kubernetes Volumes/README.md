# Data Persistence in Kubernetes

Up to this moment, we set of a simple Docker Container, deployed inside a Kubernetes Cluster. Nevertheless, we did not configured any additional feature of the Container, and in this chapter we will focus on attach a Volume to our Docker Container, such a way the data will be persisted after that the Deployment has been shut down.

Why do we need to manage Volumes also in Kubernetes? It is enough not indicating to the Docker Engine, that Volumes are attached to the Container that will be run in the Worker Node? Unfortunately no. In the previous chapters, we were running the Container explicitly using the Docker CLI commands, or a Docker Compose file. However, from now on, Kubernetes will manage the Docker Container's for us. Therefore, we have to indicate to Kubernetes how Volumes - and data stored inside it - should be managed properly.

Volumes managed by Kubernetes are more complex than their Docker counterparts. While Volumes in both systems persist beyond Container's removal, a Volume attached to a Pod is destroyed when the Pod is removed from the Worker Node. Furthermore, Volumes in Kubernetes support a large set of drivers, since Kubernetes is designed to be executed in a cloud environment.

## Volumes in Kubernetes

Volumes in Kubernetes are defined in two way: __Volumes__ and __Persistent Volumes__. A Volume is a persistence unit attached to a specif Pod. When the Pod in destroyed, the attached Volume will be destroyed too. However, Persistent Volumes are not attached to a specific Pod, making the file stored inside the Volume persistent and not affected by any configuration's change.

## Attached Example

Attached to this folder, `deployment.yaml` and `service.yaml` files are used to create a new Deployment named kubernetes-volumes, having a single running Pod. Starting the deployment using the command: `kubectl apply -f=deployment.yaml -f=service.yaml`. Making a GET request on `/` will return the list of all the available books; while making a POST request on `/book` having a body structured in the following way, will store a new book inside the `/book` directory:

```json
{
    "title": string,
    "publishedAt": string,
}
```

Let's try to crash the whole application, making a PATCH request to `/error` endpoint. Waiting that Kubernetes restart the Pod, we will notice that, making a GET request on `/book` will return any book no more. In fact, as we mentioned before, Kubernete's volumes are attached to a single Pod, then if it fails the whole volume will be lost forever.

Changing the default's Kubernetes behavior requires to specify a driver through which the Volumes will be defined. According to the official Kubernetes documentation, there are many different drivers to chose, however we will see only a small part of them.

## Volumes Drivers

### `emptyDir` driver

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

### `hostPath` driver

The `emptyDir` driver creates a new empty directory inside of the current Pod. Suppose that our Kubernetes cluster is composed of a single Worker Node, having three Pods running. Each running Pod has an `emptyDir` driver attached to it, implying that each Pod has an independent volume where data are stored, that is, making multiple HTTP POST request will store a new entity inside a Pod, and then the HTTP GET request will return only the data of the current Pod, not the 'global' information available in the Worker Node.

Working with multiple Pod requires a better approach in storing data using Volume. `hostPath` attaches a Volume directly into the Worker Node file system. Containers running inside the Pod will use this 'shared' Volume, that is, will be synchronized when updated are made.

Furthermore, there are many options that can be specified to this driver:

- __DirectoryOrCreate__. Creates an empty directory in the path specified inside the Volume configuration. By default, the directory's permissions will be set to 0755.

- __Directory__. Attach the volume to an existing directory.

- __FileOrCreate__. Creates an empty file if not exists, assigning by default le 0644 permission, having the same group and ownership of Kubelet.

- __File__. Attach the Volume to an existing file.

- __Socket__. An Unix socket must exists at the given path.

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

## Persistent Volume \& Persistent Volume Claim

Persistent Volumes (PV) are Cluster's resources used to persist data independently from any Pods' lifecycle. Because Persistent Volumes are defined separately by any Pod, communication between the latter and the former must be done with another Resource that is the Persistent Volume Claim (PVC). In other words, a Persistent Volume Claim is a formal request made by a Pod, requiring access to a persistence unit defined by the Persistent Volume. The request must be accomplished by specifying the size of the Persistent Volume, coining it with the access mode.

Since Persistent Volume and Persistent Volume Claim are Kubernetes' resources, we have to define them in two separate declaration files: [`volume.yaml`](./volume.yaml) and [`volume-claim.yaml`](./volume-claim.yaml). Let's start examining the first file:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: book-volume
spec:
  capacity:
    storage: 1Giclients_database
  volumeMode: Filesystem
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /var/www/data
    type: DirectoryOrCreate
```

The most important section is `spec`, inside the following properties stand:

- `capacity` defines the maximum storage capacity of this resource;

- `volumeMode` defines how the volume is mounted and attached to the Pod, there are two options that can be used: `Filesystem` and `Block`. The former mounts a directory inside the Pod, the latter acts like an external device attached to the Pod.

- `storageClassName` defines the type of storage object to be used.

- `accessModes` declares how the Persistent Volume will be used, just like the previous example with normal Volume.

- Finally, `hostPath` indicates where the Volume will be attached to the Pod, and which type will be used.

## Environment Variables

Using environment variables in Kubernetes can be done with different approaches. The commonest and most intuitive consists in storing the environment variables inside a project's folder to persist inside a Volume. Moreover, another approach cloud be use environment variables to pass inside the Docker Container.

Both of these approaches are not as flexible as we would like. The ideal configuration could be consts in defining the environment variables inside the Kuberentes configuration file. Fortunately, using the `env` properties inside the Container's configuration of our Deployment, we can pass a set of environment variables to the Containers that will compose the Deployment.

Analyzing the [`deployment.yaml`](./deployment.yaml) file, you will probably notice the following part:

```yaml
containers:
  - name: kubernetes-volumes
    image: mroranger/kubernetes-volumes:3
    env:
      - name: APP_NAME
        value: 'KUBERNETES_VOLUMES'
      - name: APP_PORT
        value: '80'
```

Using the `env` directive, we are indicating to all the Containers defined inside the following Deployment, that some environment variables will be used. Each environment variable must have a name and a corresponding value. Moreover, in the YAML file, strings must be used to indicate values of the variables.

### Config Map

Passing variables to Containers inside a Deployment, using the previous method is not as flexible as we would like. Alternatively, we can use the __Config Map__ to associate variables to Deployment. A Config Map is a Kubernetes resources, that defines a set of environment variable. Inside the following directory the [`config-map.yaml`](./config-map.yaml) file declares this resources:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kubernetes-volumes
data:
  APP_NAME: 'kubernetes-volumes'
  APP_PORT: '80'
```

Inside the following configuration file, `kind: ConfigMap` declares the type of the Kubernetes Resource; `name: kubernetes-volumes` declares the actual name of this ConfigMap that must be used in connecting the Config Map to a Deployment Resource. Finally, `data` declares the environment variables using the same key-value pair list.

Furthermore, we have to update the [`deployment.yaml`](./deployment.yaml), connecting the two resources. The updated part is the following:

```yaml
env:
  - name: APP_NAME
    valueFrom:
      configMapKeyRef:
        name: kubernetes-volumes
        key: APP_NAME
  - name: APP_PORT
     valueFrom:
       configMapKeyRef:
         name: kubernetes-volumes
         key: APP_PORT
```

Up to this moment, if the environment variable must be connected to a Config Map, we have to declare it using the `valueFrom`, `configMapKeyRef` directives. Moreover, `name` indicates the name of the Config Map to use to resolve the environment variable, and `key` is key name of the environment variable to use.
