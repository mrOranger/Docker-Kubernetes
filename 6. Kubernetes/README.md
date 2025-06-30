## Introduction to Kubernetes

Docker is a powerful tool to create Containers, reducing deploy and development time. On the other hand, it is not a complete solution for all real-world problems. In larger companies, working with thousands of clients, we have to deal with many problems, that cannot be afforded by Docker.

Let's consider an application developed using different services, just like the previous project. What's happening if one or more Service goes down? If we cannot restore the Service in an acceptable problem, the whole application will be completely unavailable soon. How can we overcome to this problem with Docker? The answer is that we can't, it is impossible to create immediately another instance of the same Service, using Docker or Docker Compose, while the broken Service will be recovered.

Working we thousands of clients, it is impossible to use a single application that must handle all the incoming requests. We can increase the computational capability of our Service (also known as __Vertical Scalability__), however, sooner or later we will reach the limit for the instantiable hardware. Alternatively, we can increase the number of instances of our application, and distribute the incoming traffic over the working instances and using a measurement like the CPU's consumptions (contrarily to Vertical Scalability, this approach is known as __Horizontal Scalability__).

Each of these problems, cannot be afforded by Docker, on the other hand, __Kubernetes__ can. According to the official documentation of Kubernetes:

> Kubernetes, also known as K8s, is an open source system for automating deployment, scaling, and management of containerized applications.

That is, Kubernetes is not a standalone software, instead is an environment with different components that can be used to orchestrate a set of Containers in an efficient way. In fact, just like Docker, we will interact with Kubernetes using a configuration file, where we describe the infrastructure that we want, without using any programming concept.

Notice that Kubernetes it is not a cloud service, even if it is used by many Cloud Providers in their infrastructure. Known how Kubernetes work it is not mandatory, working with cloud application, however, it is recommended since any cloud's Container's orchestrator has its own feature, and it not compatible with other cloud's application.

Moreover, Kubernetes is not an alternative to Docker, since it works together with Docker to create and run Services. To understand Kubernetes it is mandatory to known Docker too.

## Core Architecture

Kubernetes' architecture is quite complex, however, we can represent it using the following figure:

<div style="width: 100%; display: flex; justify-content: center; margin: 1em 0em">
    <img style="max-width: 500px" src="../assets/6. Kubernetes/architecture.png" alt="Kubernetes Architecture"/>
</div>

An alternative way to see and understand the Kubernetes architecture, consists in examining in terms of layer. Each layer abstracts the work of below layer. That is, the top layer is the __Cluster__, that is the Kubernetes environment where we are running our application, and where instances or virtual machines can communicate each other, using a shared and private network.

Inside a Cluster there are different Virtual Machine or Server, composing our environment. The whole environment must be orchestrated by a single and shared entry-point, that is the __Master Node__. This type of service, runs inside of them a control panel through which we can monitor the whole environment.

The Master Node orchestrates a set of services known as __Worker Node__. A Worker Node could be a single Virtual Machine, or a Server hosted somewhere in the internet, that is running a part of our application.

Finally, inside the Worker Node there is running a __Pod__ or a set of Pod, that is a single Docker Container. However, since multiple Pod can be executed inside a Worker Node, it is necessary to configure a __Proxy Server__ through which manage the income and outcome network traffic between the clients and the Worker Node.

## The Worker Node

Let's start analyzing the Kubernetes' architecture deeper. As we noticed, the basis element of the whole environment is the Worker Node. A Worker Node is nothing more that a running device, just like the computer I'm writing now.

In a Worker Node we can install multiple application, like a Load Balancer or a Reverse Proxy. However, we can host an application's Container having multiple resources like Volume and Network, creating a __Pod__. Moreover, we can run many Pod inside a Worker Node, that will be managed automatically by Kubernetes.

Moreover, there are two software that are running by default inside a Worker Node: the __kubelet__ that is responsible of the communication between the Worker Node and the Master Node; then the __kube-proxy__ manages network between the Worker Node and the Pods running in it.

<div style="width: 100%; display: flex; justify-content: center; margin: 1em 0em">
    <img style="max-width: 500px" src="../assets/6. Kubernetes/worker-node.png" alt="Worker Node"/>
</div>

## Master Node

As we saw previously, we can run many Worker Node inside a Cluster. Each of these Worker Node are managed by a single entity that must be configured, that is the __Master Node__.

<div style="width: 100%; display: flex; justify-content: center; margin: 1em 0em">
    <img style="max-width: 300px" src="../assets/6. Kubernetes/master-node.png" alt="Master Node"/>
</div>

Inside a Master Node there are many services used by it:

* __etcd__ contains the actual configuration of the Master Node, is a sort of key-value archive.

* __kube-apiserver__ is responsible of communication between the Master Node and the Worker Node. That is the counter-part of the kubelet service, that is running inside a Worker Node.

* Selecting and running Pods inside the Worker Nodes, is made by the __kube-scheduler__.

* While the Scheduler manages the starting and working process of the Worker Node. The __kube-controller-manager__ controls that Worker Node and Pods are running correctly, that controls if it is necessary to run more Pod, based on workload configuration.

* Finally, the __cloud-controller-manager__ works like the Kube-Control Manager, however focuses on managing cloud resources.

## Resources in Kubernetes

Up to this point, we have a general overview of Kubernetes' architecture. We have understand that a Cluster is defined in terms of Worker Node managed by a Master Node. Going deeper in this hierarchy there are the so called __Resources__, that we will study in this chapter.

### Pod

A __Pod__ is the smallest computational unit that can host one or multiple Containers. Typically, one Container is enough for a Pod, because, scaling horizontally for many Containers in the same Pod, is a waste of resources. Instead, deploying Containers in different Pods, require less resources to scale horizontally.

Moreover, Containers in the same Pod shares an internal private network, that guarantees the isolation between the Containers and the external network. Moreover, each Container inside the same Pod, can communicate each other using the `localhost` address.

Kubernetes will automatically manage Pods for us, that is, we don't have to care about start and stop Pods, or replace one of them with another if the former fails. That is the core concept below Kubernetes, thus having an unique platform through which orchestrate or application that is divided in multiple atomic computational unit.

### Deployment

Pod are managed by another Kubernetes resource that is the __Deployment__. A Deployment is nothing more that a set of instructions, indicating to Kubernetes the final state that must be achieved in terms of Pod. That is, using a Deployment, we can define the set of Pods that we want to achieve, and then Kubernetes will automatically create and manage the Pod using the Deployment. Moreover, if one or more Pod fail, the Deployment will replace or restore the failed ones.

Let's start creating our first Deployment. First of all, we need an Image that will be used by Kubernetes to create the Pod. Attached to this folder, there is a [Dockerfile](./Dockerfile), which is used to create a dummy image containing a node.js application.
The first thing to do is to create the Image, however, we have to remind that Kubernetes is working on a separate environment (that is Docker in my case), that is not connected to the host's machine network. That is, the only way, for now, allowing Kubernetes to use an Image, is to push that Image on a Docker Registry, giving a name.

After that the Image has been pushed correctly on the Docker Registry, we can create our first deployment, using the following command:

```bash
kubectl create deployment hello-world --image=<your-dockerhub-username>/hello-world-kubernetes
```

Once the deployment has been created, we can observe the result by using the command, that will show the list of Deployments available on our Cluster:

```bash
kubectl get deployments
```

Moreover, if you would like to have a visual representation of the final result, you can use the minikube dashboard using following command:

```bash
minikube dashboard
```

Concluding this introduction to Deployments resources, we have to notice that the command `kubectl` stands for kube-control that is used to indicate to the Master Node, to create a new Pod, based on the first available Worker Node in the Cluster. The first available Worker Node, is represented by the less busy node in the Cluster.

### Service

When we created a Deployment, Kubernetes will manage automatically the Pods defined inside of them, replacing the failing ones with new instances. Despite this distribution's model could seems very efficient, it contains a weak point, that is: communicating from client to a specific Pod is quite hard. That is, even though a Pod has an internal Ip address, we cannot be sure that the same Ip address will be maintained inside the Deployment.

Therefore, we need an internal services allowing us to communicate easily to a specific Pod. That is, the __Service__ component, could be represented as an abstraction's layer acting like a bridge between the Deployment and an external Client.

Supposing that you have created a Deployment using the commands above, we can "attach" a Service to the previous Deployment, using the following command:

```bash
kubectl expose deployment hello-world --type=LoadBalancer --port=80
```

By using this command, we are creating a new Service, attaching it directly to a Deployment named "hello-world", using the port 80that is the port exposed by the Pod, where the application is actually running. There a different strategies that we can use indicating the Service how requests are dispatched between Pods inside the Deployment, however, for this moment we will use only the __LoadBalancer__ strategy, which uses a Kubernetes internal Load Balancer.

Now that we created the Service, we can observe the list of available Services, using the command:

```bash
kubectl get services
```

However, you will probably notice that, below the voice `external-ip` there is the `<pending>` label. That is, the service is working correctly, however, it cannot be reached from outside the cluster. Moreover, the port that we indicated in the previous command (that is 80), is mapped to another port number, manage automatically by the Deployment. To expose the Deployment outside the Cluster, we have to use a minikube command:

```bash
minikube service hello-world
```

This command will expose the Service named hello-world (the name of the Service is the same of the Deployment attached to), outside the minikube cluster. However, in real scenarios, most of the time the cloud will have a specific cluster command to expose the deployment.

Once the command has been execute successfully, Kubernetes will indicate to you the Ip address through which we can reach our Deployment. Moreover, you will notice that the final Ip address is not the same inside the Cluster.

## Node Management

You probably notice that, in the [app.js](./app.js) file there is a route `/error` that crashes the application. In the previous section, we affirmed that a Deployment in a Kubernetes Cluster, will manage automatically Pods that are crashed, trying to restart again. This is the reason behind the impossibility of communicating with Pods inside a Deployment, using only the Ip address.

Now, if we generate a failure to that specific Pod, you will probably notice that after a while, Kubernetes will recreate the same up, and the service will be available again. This is an important feature in real-world application, because it guarantees us to maintain an acceptable failure-resistance of our web-service. Therefore, even after a general failure, the application will still running.

Up to this moment, we created a single Deployment with only a Pod inside of it. This means that, if the Pods will goes down, the whole application will be unavailable, until the Pod will be restarted. However, what happens if the Pod crashes and it cannot be restarted, let's suppose that an infinite loop cause the crashed of the Pod. How can we manage a scenario like this one?

Solving the previous scenario, requires to known the concept of __Replica__. A Replica is nothing more that a copy of a Pod, that is distributed under the same Deployment. If you remember, at the beginning we created the Deployment using the `--type=LoadBalancer` option, that is: each requests made by a client to a Deployment, will be distributed over the Pods inside the Deployments, using a Load Balancer, managed by Kubernetes.

Therefore, if we create a Deployment with three replicas, each incoming request will be dispatched by the Load Balancer on the most idle Pod. Moreover, if a Pod in the Deployment will fail, the remaining two Pods will continue to work, and the traffic will be distributed over them, as long as the Pod will be restarted or not.

To create a Replica, we have to use the `scale` command with the `replicas` option:

```bash
kubectl scale/deployment hello-world --replicas=3
```

That is: we are scaling our deployment `hello-world` assigning 3 replicas to the deployment (that is adding two more Pods to the current deployment). Now, making a request to `/error` endpoint will cause a crash of the current Pod, however, the application will still running because the other two Pods are up and running.

### Update Deployments

Let's suppose that we made an update to our Deployment. Since a Deployment is based on a Docker Image, how can we propagate updates also to the Deployments, since we know that Images have to be re-build to see the updates. Let's start creating the new Image based on our Dockerfile, using the command:

```bash
docker build --tag=<your-username>/hello-world-kubernetes
```

Now that the Image has been successfully updated, we can update the Deployment, using the following command:

```bash
kubectl set image deployment/hello-world hello-world-kubernetes=<your-username>/hello-world-kubernetes
```

the first argument `deployment/hello-world` indicates the name of the deployment that we want update; then, `hello-world-kubernetes=<your-username>/hello-world-kubernetes`, specifies in the left-hand part, the name of the Container that we want to update (automatically, Kubernetes assign to the Container the same name of the Image based on), then, the right-hand part is the name of the new Image to use. Running this command ... Nothing changed.

The reason being this anomalous behavior is that: if the name of the Image is not changed, then Kubernetes will propagate no updates to the deployment. To make the updated operatively, we have to update the name of the Image, specifically, we have to assign a different tag, making the Image's name different from the previous one. That is, running once again the previous command, using a different tag, will change the Deployment internal configuration:

```bash
docker build --tag=<your-username>/hello-world-kubernetes:2
kubectl set image deployment/hello-world hello-world-kubernetes=<your-username>/hello-world-kubernetes:2
```

Let's suppose that this update will fail soon ... How can we restore the Cluster to the previous version? Fortunately, Kubernetes has a built-in mechanism of rollback, thanks to we can restore a previous Image used by our Deployment, using the command:

```bash
kubectl rollout undo deployment/hello-world
```

This command will rollback the Image to the previous one. However, how can we restore the Image not just to a previous one, but to an older one? We have to introduce a new concept that is the __History__. Each time an update is made on a Kubernetes cluster, it is stores inside an internal memory known as History. Using this memory and the command:

```bash
kubectl rollout history deployment/hello-world
```

a list of all the previous revisions that we used is shown, with an incremental identifier that we can use in the next command:

```bash
kubectl rollout undo deployment/hello-world --to-revision=1
```

That will restore the status of the Deployment named `hello-world` to the version identified by the revision 1.

## Imperative vs Declarative Approach

Up to this moment, we executed Kubernetes' commands in our terminal. You probably agree with me that writing command inside the terminal, each time that we have to create a Cluster, is quite cumbersome. On the other hand, this approach is known as __Imperative Approach__, and an alternative to the Imperative Approach is the __Declarative Approach__, consisting in writing a configuration file, having a specific semantic understandable by Kubernetes, and that can be used to configure easily our Cluster.

Attached to this chapter, you will find [deployment.yaml](./deployment.yaml), that is the configuration file we will use to distribute our deployment using the Declarative Approach, without using the `kubectl` command. Now, we will have a look on the structure of this configuration file:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: hello-world
spec:
    replicas: 3
    selector:
        matchLabels:
           deployment: hello-world 
    template:
        metadata:
            labels:
                deployment: hello-world
        spec:
            containers:
                - name: hello-world
                  image: mroranger/hello-world-kubernetes:2.4
```

* Just like Docker, we have to specify which API Version Kubernetes have to use to configure the Deployment. Common values are: `v1` and `apps/v1`, indicating to use the v1 common version, under the apps API group.

* Since we can use the configuration file to create different resources in Kubernetes, we have to specify which kind of resource we are going to create. In this specific example, we would like to create a Deployment, therefore, using `kind: Deployment` we are specifying our Deployment resource.

* `metadata` is used to specify the metadata attached to the resource that we are creating. In this specific example, since we are creating a Deployment, we would like to indicate only the name of the Deployment itself. Moreover, there are many values that can be specified under this key, and a complete list can be found in the official Kubernetes documentation.

* Finally, under the `spec` keyword we have to specify the core elements of our Deployment. Since we are creating a configuration file for a Deployment, we want to specify the number of replicas of our Pod, that is `replicas` is the key used to specify this feature, in our case 3.

Before to continue, we have to now that: when a Deployment is going to be created inside a configuration file, it does not known automatically who are the Pods that will be managed by them. Therefore, we have to indicate to the deployment, the Pods that should be included, using a set of labels. For the moment, it is enough to know that using this keys, we are indicating the set of labels that should be match with the Pod's labels, and are used to attach the Pod to the Deployment we are creating:

```yaml
selector:
    matchLabels:
        deployment: hello-world
```

That is: the Pods having as label the key `deployment` having as value `hello-world` will be included in this Deployment.

Now, the next lines:

```yaml
template:
    metadata:
        labels:
            deployment: hello-world
```

Could seems redundant, in fact, since the configuration file can be used to specify a Pod too, the same structure have to be used. Therefore, below the `template` keyword, we are repeating the configuration of the Pod, using the specifying a metadata that is the label that the Pod will assume.

Once again, using the `spec` keyword, we are going to specify the Pod internal configuration:

```yaml
spec:
    containers:
```

Moreover, under the `containers` keyword, we can specify the set of Containers that will be execute in the Pod. However, as we said, a good practice is to create a single Container inside a Pod, in order to make the Pod maintainable and make easier to track errors in the Deployment.

Under this keyword, we have to write the specification of the Pod, including the name that the Pod will assume, and the Docker Image that will use:

```yaml
- name: hello-world
  image: mroranger/hello-world-kubernetes:2.4
```

Now we are ready to create our Deployment, and we can do that using the command:

```bash
kubectl apply -f=deployment.yaml
```

If the creating of the Deployment was successfully, we cannot access to the Pods still, because there is no available Service that can be used by the Cluster allowing connection between the Clients and our Deployment. That is, we have to create a Service and we will do this using the declarative approach too.

```yaml
apiVersion: v1
kind: Service
metadata:
    name: backend
spec:
    selector: 
        deployment: hello-world
    ports:
        - protocol: 'TCP'
            port: 80
            targetPort: 80
    type: LoadBalancer
```

Let's skip the first four lines because, we understood their meanings. However, we have to know that, in creating declarations for Services, the `apiVersion` must be set to `v1` not to `app/v1`, just like we made for the Deployments' declaration.

```yaml
selector:
    deployment: hello-world
```

is used to connect the Pods definition with their corresponding Service. The most tricky part stands here:

```yaml
ports:
    - protocol: 'TCP'
      port: 80
      targetPort: 80
```

If you remember the command that we used in the Imperative Approach `kubectl create service hello-world --port=80 --type=LoadBalancer`, we indicate that the following Service must expose the Container using the port 80. In a similar manner, we are indicating to Kubernetes, to expose the Containers using the port 80 in the internal Kubernetes network, to the port 80 of the Host Machine where the Minikube Cluster is working. Last but not least, we have to indicate the type of Service that we want to expose, that is, like the previous configuration, the LoadBalancer.

Now, I would like to raise a doubt: "How can Kubernetes known, using these configuration file, which Pod is running and which one no?". Luckily, Kubernetes can check if a Container is still running by observing the processes on the Worker Node hosting the Pod. However, if we would like to change this default behaviour, we have to define a __Liveness Probe__:

```yaml
containers:
    - name: hello-world
        image: mroranger/hello-world-kubernetes
        livenessProbe:
            httpGet:
                path: /health 
                port: 80
            periodSeconds: 60
            initialDelaySeconds: 10
```

With these command, we are indicating to Kubernetes to make an HTTP GET request to `/health` endpoint, each 60 seconds to check if the Container is still up and running. Moreover, only the first time after that the Container has been started, the request will be made only after 10s. 

Finally, using the same command: `kubectl apply -f=service.yaml` we can communicating to Kubernetes to create the Service using the following configuration file.
