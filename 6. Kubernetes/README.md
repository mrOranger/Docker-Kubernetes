# Kubernetes

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

Inside a Cluster there are different Virtual Machine or Server, composing our environment. The whole environment must be orchestrated by a single and shared entrypoint, that is the __Master Node__. This type of service, runs inside of them a control panel through which we can monitor the whole environment.

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

## Deployment
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

moreover, if you would like to have a visual representation of the final result, you can use the minikube dashboard using following command: 

```bash
minikube dashboard
```

Concluding this introduction to Deployments resources, we have to notice that the command `kubectl` stands for kube-control that is used to indicate to the Master Node, to create a new Pod, based on the first available Worker Node in the Cluster. The first available Worker Node, is represented by the less busy node in the Cluster.
