/*jslint node: true, white: true, vars:true */
'use strict';
var http = require( 'http' );
var path = require( 'path' );
var express = require( 'express' );
var serveIndex = require('serve-index');

var router = express( );
var server = http.createServer( router );

var CLIENT_DIR = 'production' === process.env.NODE_ENV ? 'static' : 'client';
router.use( express.static( path.resolve( __dirname ) ) );
router.use('/', serveIndex( __dirname , {'icons': true}))

var port = process.env.PORT || 3000;
var ip = process.env.IP || "0.0.0.0";

server.listen(  port , ip, function(){
  var addr = server.address();
  console.log("BuildServer server listening at", addr.address + ":" + addr.port);
} ); 
