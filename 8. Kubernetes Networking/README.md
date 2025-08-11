# Networking in Kubernetes

Kubernete's networking module works such as each Pod has its own independent internal network, separated from the cluster's network and the host machine network. Moreover, each Pod can communicate easily with other Pods inside the same Cluster without using additiona network's configurations. 

In this chapter we will see how implement connections between Pods belonging to the same Cluster. Moreover, we will see how Containers in the same Pod can communicate each other. 
