# Lightweight Experigen server

This folder contains a lightweight server that you can run on your laptop or desktop, using any operating system. Experigen can be tested on localhost fully only with a server -- especially with plugins since AJAX cannot request a file from file://.

## What do I need to install?

In order to run this server, you have to install [`node.js`](http://nodejs.org) on your computer. It is not too heavy and is available for Unix, Mac and Windows.

Further, when you have `node.js` installed, you should get in a terminal/command line and run `npm install` in this very directory. This will install all the needed modules and nothing more from an online repository.

## How do I run the server?

Simply enter `node server.js` in the terminal *in this directory*, and it should be up and running. You will be able to navigate to `http://localhost:3000/index.html` and find your experiment there.

