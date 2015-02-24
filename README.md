# About

This project enable any one to deploy **one** Riak Server into the Heroku plateform.

# Install button

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/corentinway/Riak4Heroku)

<!-- https://heroku.com/deploy?template=https://github.com/heroku/button-sample -->

# How I have works on that subjects

Heroku is [polyglot](https://devcenter.heroku.com/articles/cedar#polyglot-platform) 
and use [buildpacks](https://devcenter.heroku.com/articles/buildpacks) 
to build what ever application we design to run on their servers.

Behind Heroku dynos are a Ubuntu stack. The [Cedar-14](https://devcenter.heroku.com/articles/cedar) Heroku stack 
is an Ubundu Trusty version. I wanted to use apt-get to install Riak. However, I did not manage to run 
this command from an Heroku terminal.

You will need [heroku toolbelt](https://toolbelt.heroku.com/) for easily play with Heroku.

To get the ubuntu version of the stack of your current application, run this :

```
$ heroku run "lsb_release -a"
Running `lsb_release -a` attached to terminal... up, run.3146
Detected 512 MB available memory, 512 MB limit per process (WEB_MEMORY)
Recommending WEB_CONCURRENCY=1
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 14.04.1 LTS
Release:        14.04
Codename:       trusty
```


Hence, I change my mind and wanted to build everything from source: building Basho's Erlang and Riak.
But I was facing writing issue and build timeout. Each time you deploy on Heroku, your project source is build from source.
The build phase is [limited to 15 minutes](https://devcenter.heroku.com/articles/slug-compiler#time-limit).

Heroku support team told me to try both Erlang and Multi buildpack. The first one will install a standard Erlang distribution
and the second one enable you to use multiple others buildpack for anything else.

I decided to give a try to the multi buildpack and to two others ones : heroku-buildpack-apt and heroku-buildpack-dpkg.

# How does it works



For the purpose of depolying Riak on it, I use severals buildbacks:

* the multi buildpack so I can the use severals other buildback.
Other buildpacks are set into the file .buildpacks

* heroku-buildpack-apt enable the use of apt-get to install components into Heroku. 
Components are set into the file Aptfile
* heroku-buildpack-dpkg enable the use of dpkg to install components into Heroku. 
Components' URL are set into the file Debfile
* heroku-buildpack-nodejs enable to deploy a node.js application
I use node.js to 
  * start, stop and ping Riak server.
  * to have a post install feature to post install riak



Deploy steps are 
* deploy with apt-get
* deploy with dpkg
* deploy a node.


The heroku-buildpack-apt install everything into the folder ~/.apt.
The heroku-buildpack-dpkg install everything into the folder ~/.dpkg.

Nothing is installed into the / root folder. However, some riak files settings are relative to the root folder.

Hence I have to change some scripts and configuration file.

I have change 

* the run script riak that where installed into ~/.dpkg/usr/sbin/riak
* the configuration script env.sh that where installed into ~/.dpkg/usr/lib/riak/lib/env.sh
* and the configuration file riak.conf that where installed into ~/.dpkg/etc/riak.conf

I have uploaded thoses 3 files above into the folder riak_script. The bash script setup_riak.sh deploy 
the modified files at the end of the deploy phases.


Each file located into .profile.d folder are executed before the application is started. Hence I have put
a script to change the HTTP listener port. Riak must bind the local address 0.0.0.0:$PORT where $PORT is the 
HTTP port openned for the server.

The  file I put there is named .profile.d/z00_setup_riak.sh. Its name start with 'z00' so I have good change it
is the last file started among all others installed during the deploy phase. Actually, its seems there are one file
for each buildpack use.



.
