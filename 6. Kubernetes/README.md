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

<div style="width:100%">
    <img src="../assets/6. Kubernetes/architecture.png" alt="Kubernetes Architecture"/>
</div>

An alternative way to see and understand the Kubernetes architecture, consists in examining in terms of layer. Each layer abstracts the work of below layer. That is, the top layer is the __Cluster__, that is the Kubernetes environment where we are running our application, and where instances or virtual machines can communicate each other, using a shared and private network.

Inside a Cluster there are different Virtual Machine or Server, composing our environment. The whole environment must be orchestrated by a single and shared entrypoint, that is the __Master Node__. This type of service, runs inside of them a control panel through which we can monitor the whole environment.

The Master Node orchestrates a set of services known as __Worker Node__. A Worker Node could be a single Virtual Machine, or a Server hosted somewhere in the internet, that is running a part of our application.

Finally, inside the Worker Node there is running a __Pod__ or a set of Pod, that is a single Docker Container. However, since multiple Pod can be executed inside a Worker Node, it is necessary to configure a __Proxy Server__ through which manage the income and outcome network traffic between the clients and the Worker Node.
