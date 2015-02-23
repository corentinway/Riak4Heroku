# About

This project enable any one to deploy <strong>one</strong> Riak Server into the Heroku plateform.

## How does it works

Heroku is polyglot and use buildpacks to build what ever application we design to run on their servers.

For this purpose I use severals buildbacks.

* the multi buildpack so I can the use severals other buildback.
Other buildpacks are set into the file .buildpacks
* heroku-buildpack-apt enable the use of apt-get to install components into Heroku. 
Components are set into the file Aptfile
* heroku-buildpack-dpkg enable the use of dpkg to install components into Heroku. 
Components' URL are set into the file Debfile
* heroku-buildpack-nodejs enable to deploy a node.js application
I use node.js to start and stop Riak server

