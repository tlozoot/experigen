var http = require("http");
/*var https = require("https");*/
var express = require("express");
var fs = require("fs");

/*var key = fs.readFileSync("server.key");
 *var crt = fs.readFileSync("server.crt");*/

var app = express();

app.set("view engine", "ejs");



app.use(express.static(__dirname + "/../web"));


app.listen(3000);
/*httpsServer = https.createServer({key:key, cert:crt}, app);
 *httpsServer.listen(3443);*/
		
