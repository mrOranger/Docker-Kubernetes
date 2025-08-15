# Networking in Kubernetes

Kubernete's networking module works such as each Pod has its own independent internal network, separated from the cluster's network and the host machine network. Moreover, each Pod can communicate easily with other Pods inside the same Cluster without using additiona network's configurations. 

In this chapter we will see how implement connections between Pods belonging to the same Cluster. Moreover, we will see how Containers in the same Pod can communicate each other.

## Pod Internal Communication
The simplest scenario consists in having different Containers running inside the same Pod. The following figure shows correctly the scenario that we are going considerating:

<div style="width: 100%; display: flex; justify-content: center; margin: 1em 0em">
    <img style="max-width: 500px" src="../assets/8. Kubernetes Networking/internal-pod-communication.png" alt="Internal Pod Communication"/>
</div>

Both of these services communicate each other using the same network, that is the Pod's internal network. In this specific scenario, Kubernetes allows us to use the `localhost` keywork as endpoint for making an HTTP call. Of course, exposing a specific service deployed inside a Pod, to the external network, it is necessary to create a Service.

## Pod to Pod Communicatio
Things are getting harder when we are facing with real-world applications and architecture. Attached to this chapter, I created a pseudo Micro-Service application composed of three Applications using an own Database. 





