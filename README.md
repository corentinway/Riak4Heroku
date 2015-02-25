# About

This project enable any one to deploy **one** Riak Server into the Heroku plateform.

# Install button

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/corentinway/Riak4Heroku)

<!-- https://heroku.com/deploy?template=https://github.com/heroku/button-sample -->

# How I have works on that subjects

## About Heroku

Heroku is [polyglot](https://devcenter.heroku.com/articles/cedar#polyglot-platform) 
and use [buildpacks](https://devcenter.heroku.com/articles/buildpacks) 
to build what ever application we design to run on their servers.

Behind Heroku dynos are a Ubuntu stack (a set of software selected by Heroku team that will run the server). 
The [Cedar-14](https://devcenter.heroku.com/articles/cedar) Heroku stack 
is an Ubundu Trusty version. 

To get the ubuntu version of the stack of your current application, 
run this (you will need [heroku toolbelt](https://toolbelt.heroku.com/)) :

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


## From a terminal with apt-get

My first idea to install Riak was to use apt-get to but I *fail* doing it from an Heroku terminal.

## Compile from source

Hence, I change my mind and wanted to build everything from source: building Basho's Erlang and Riak.
But I was facing writing issue and build timeout. Each time you deploy on Heroku, your project source is build from source.
The build phase is [limited to 15 minutes](https://devcenter.heroku.com/articles/slug-compiler#time-limit).

Heroku support team told me to try both Erlang and Multi buildpack. The first one will install a standard Erlang distribution
and the second one enable you to use multiple others buildpack for anything else.

## With Heroku buildpack 

I decided to give a try to the multi buildpack and to two others ones : heroku-buildpack-apt and heroku-buildpack-dpkg. 
That was *the good solution*.

For the purpose of depolying Riak on it, I use severals buildbacks:

* the [multi buildpack](https://github.com/heroku/heroku-buildpack-multi) so I can the use severals other buildback.
Other buildpacks are set into the file <code>.buildpacks</code>

* [heroku-buildpack-apt](https://github.com/ddollar/heroku-buildpack-apt) enable the use of apt-get to install components into Heroku. 
For that purpose you write into the file <code>Aptfile</code> all the *name* of the component you want to install
* [heroku-buildpack-dpkg](https://github.com/rricard/heroku-buildpack-dpkg) enable the use of dpkg to install components into Heroku. 
For that purpose you write into the file <code>Depfile</code> all the *URLs* of the component you want to download and install
* [heroku-buildpack-nodejs](https://github.com/heroku/heroku-buildpack-nodejs) enable to deploy a node.js application
I use node.js to 
  * start, stop and ping Riak server.
  * to have a post install feature to post install riak. In the node.js <code>package.json</code>
  file, you can define a set of scripts that will define a deployement [lifecycle](https://docs.npmjs.com/misc/scripts).

### Steps

Deployement steps are :
* deploy with apt-get
* deploy with dpkg
* deploy a node.


The [heroku-buildpack-apt](https://github.com/ddollar/heroku-buildpack-apt) install everything into the folder <code>~/.apt</code>.
The [heroku-buildpack-dpkg](https://github.com/rricard/heroku-buildpack-dpkg) install everything into the folder <code>~/.dpkg</code>.

Nothing is installed into the <cod>/</cod> root folder. However, some riak files settings are *relative to the root folder*.

Hence I have to change some scripts and configuration file.

I have changed the following files:

| file                   | path                                         | Description              |
|------------------------|----------------------------------------------|--------------------------|
| <code>riak</code>      | <code>~/.dpkg/usr/sbin/riak</code>           | Riak run script          |
| <code>env.sh</code>    | <code>~/.dpkg/usr/lib/riak/lib/env.sh</code> | Riak environement script |
| <code>riak.conf</code> | <code>~/.dpkg/etc/riak/riak.conf</code>      | Riak configuration file  |

I have uploaded thoses 3 files above into the folder <code>riak_script</code> to customize them to fits Heroku requirements.
The bash script <code>setup_riak.sh</code> deploy the modified files at the end of the deployment process.

Each file located into <code>.profile.d</code> folder are executed before the application is started.
At Heroku, only one HTTP port is accessible from the outside. The environement variable <code>$PORT</code> is set to have this value.
This HTTP port can change from time to time. So, before each Riak startup, we must change the configuration file to fit that 
need.

I have put a script (<code>z00_setup_riak.sh</code>) to change the HTTP listener port. 
Riak must bind the local address <code>0.0.0.0:$PORT</code>
The script name start with 'z00' so I have good change it
is the last file started among all others installed during the deploy phase. Actually, its seems there are one file
for each buildpack use.



# Content of the project

```.
.profile.d/			folder	script to be executed before starting Riak
.riak_script/		folder	script and configuration file from Riak adapted to suite Heroku instakll
.buildpacks			file	list all buildpack to execute
.env				file	list of environement variable _not usefull now_
.gitignore			file	list files to be ignored by GIT
app.json			file	Application descriptor to deploy the it on Heroku
Aptfile             file	list all dependencies to install with apt-get
Debfile             file    list all URLs to download and install with <code>dpkg</code>
package.json        file	node.js application descriptor (start, ping and stop Riak)
Procfile    		file	file that describe each process to launch. [More details here](https://devcenter.heroku.com/articles/procfile)
README.md			file	this file
run_riak.js			file	Main file that will [start](https://devcenter.heroku.com/articles/dynos#startup), ping, and [stop](https://devcenter.heroku.com/articles/dynos#shutdown) Riak
setup_riak.sh		file	deploy Riak script for Heroku
TODO.md				file	list things to do.
```.

# TODO

* change other script to fits Heroku
  * riak-admin
  
  
  

