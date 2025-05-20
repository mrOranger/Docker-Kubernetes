# Docker And Kubernetes

Understanding Docker means having a step back, and analyze past development situations. Back 20 years ago, you would probably developed your solution on-premise, that is: configure you local machine with you stack development, and then starting to work. Weeks later you would probably ready to deploy your first solution on the server, therefore, you would sent the code to the system administrator, and few minutes later ... nothing works.

In fact, the problems was that: despite you set up correctly your local machine; there is still a difference between your computer and the server. Moreover, there are differences between you device and anyone else.

Therefore, Docker was born initially to solve this problem, that is: provide a shared and portable configured environment, without use a virtual machine, requiring more resources than Docker.

Docker's definition given by the official documentation, is enough clear to understand what Docker actually is:

> Docker is an open platform for developing, shipping, and running applications. Docker enables you to separate your applications from your infrastructure so you can deliver software quickly. With Docker, you can <ins>manage your infrastructure in the same ways you manage your applications</ins>. By taking advantage of Docker's methodologies for shipping, testing, and deploying code, you can significantly reduce the delay between writing code and running it in production.

Theoretically, Docker is based on the concept of **Container**, that is the smallest piece of execution's environment, easy sharable between different devices. Later, we will see how configure a Container for our purposes, and how can be shared in a common repository known as Docker Hub.


