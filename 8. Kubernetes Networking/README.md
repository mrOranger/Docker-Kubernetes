# Networking in Kubernetes

Kubernetes networking module works such as each Pod has its own independent internal network, separated from the cluster's network and the host machine network. Moreover, each Pod can communicate easily with other Pods inside the same Cluster without using additional network's configurations.

In this chapter we will see how implement connections between Pods belonging to the same Cluster. Moreover, we will see how Containers in the same Pod can communicate each other.

## Pod Internal Communication

The simplest scenario consists in having different Containers running inside the same Pod. The following figure shows correctly the scenario that we are going considering:

<div style="width: 100%; display: flex; justify-content: center; margin: 1em 0em">
    <img style="max-width: 500px" src="../assets/8. Kubernetes Networking/internal-pod-communication.png" alt="Internal Pod Communication"/>
</div>

Both of these services communicate each other using the same network, that is the Pod's internal network. In this specific scenario, Kubernetes allows us to use the `localhost` keyword as endpoint for making an HTTP call. Of course, exposing a specific service deployed inside a Pod, to the external network, it is necessary to create a Service.

## Pod to Pod Communication

Things are getting harder when we are facing with real-world applications and architecture. Attached to this chapter, I created a pseudo Micro-Service application composed of three Applications using an own Database.

The entire project's structure is represented by the following image:

<div style="width: 100%; display: flex; justify-content: center; margin: 1em 0em">
    <img style="max-width: 500px" src="../assets/8. Kubernetes Networking/project-architecture.png" alt="Project Architecture"/>
</div>

Looking at the image, we notice that applications' deployments must communicate with databases' Pods using the cluster's internal network. That is, communication between Pods inside the same Cluster must be done using the exposed Services.

Moreover, each service should expose a stable internal IP address, that can be used as reference by each Pod. However, you will probably agree with me that updating the Environment Variables reading the IP address of each Service, is a cumbersome action. Lucky, Kubernetes has a built-in DNS service assigning the IP address of the Service to its own name defined inside the Kubernetes configuration file.
