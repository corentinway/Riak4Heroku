/*jslint node:true, white: true, plusplus: true, vars: true */

'use strict';

var fs = require( 'fs' );
var exec = require( 'child_process' ).exec;


var execHandler = function ( errorMessage, callback  ) {
	return function ( error, stdout, stderr ) {
		if ( error ) {
			console.error( errorMessage );
			console.error( error );
		} 
		if ( stdout ) {
			console.log( 'output: ' + stdout );
		}
		if ( stderr ) {
			console.error( 'error: ' +  stderr );
		}
		if ( callback ) {
			callback();
		}
	};
};

/**
 * Ping once Riak
 */
var ping = function () {
	exec( __dirname + '/.dpkg/usr/sbin/riak ping' , execHandler( 'Failed to ping Riak.' ) );
	console.log( 'pinging Riak server' );
};
/**
 * pings forever Riak server
 */
var pings = function () {
	// ping riak forever
	setTimeout( function () {
		setInterval( ping, 5000 );
	}, 5000 );
};

var start = function () {
	exec( __dirname + '/.dpkg/usr/sbin/riak start' , execHandler( 'Failed to start Riak.', pings ) );
};

var stop = function () {
	exec( __dirname + '/.dpkg/usr/sbin/riak stop' , execHandler( 'Failed to stop Riak.', process.exit ) );
};


// stop the dyno
process.on( 'SIGTERM', stop );

// start riak
start();