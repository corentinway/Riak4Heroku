/*jslint node:true, white: true, plusplus: true, vars: true */

'use strict';

var fs = require( 'fs' );
var exec = require( 'child_process' ).exec;
var split = require( 'split' );
var through = require( 'through' );

var configurationFilePath = __dirname + '/.dpkg/etc/riak/riak.conf';

// TODO move that in ~/.profile.d

var configurations = [
	{ key: 'listener.http.internal', value: 'listener.http.internal = 127.0.0.1:' + process.env.PORT }
];
/**
 * update one line of the configuration file
 */
var updateConfigurationLine = function ( line ) {
	var i;
	for ( i = 0; i < configurations.length; i++ ) {
		if ( line.indexOf( configurations[ i ].key ) >= 0 ) {
			this.queue( '# --- configuration changed for the key "' + configurations[ i ].key + '" for the old  value : ' + line + '\n' );
			this.queue( configurations[ i ].value + '\n' );
			return;
		}
	}
	this.queue( line + '\n' );
};
/**
 * update the configuration file
 */
var updateConfiguration = function() {
	fs.createReadStream( configurationFilePath )
	.pipe( split( '\n') )
	.pipe( through( updateConfigurationFile ) )
	.pipe( fs.createWriteStream( configurationFilePath ) );
};

var showConfiguration = function() {
	console.log( 'Riak configuration' );
	console.log( '------------------' );
	fs.createReadStream( configurationFilePath )
	.pipe( split( '\n') )
	.on( 'data', function ( data ) {
		if ( data.trim().indexOf( '#') !== 0 ) {
			console.log( data.trim() );
		}
	} );
};

var execHandler = function ( errorMessage ) {
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
	};
}

var start = function () {
	updateConfiguration();
	showConfiguration();
	exec( __dirname + '/.dpkg/usr/sbin/riak start' , execHandler( 'Failed to start Riak.' ) );
};

var stop = function () {
	exec( __dirname + '/.dpkg/usr/sbin/riak stop' , execHandler( 'Failed to stop Riak.' ) );
	process.exit();
};

var ping = function () {
	exec( __dirname + '/.dpkg/usr/sbin/riak ping' , execHandler( 'Failed to ping Riak.' ) );
	console.log( 'pinging Riak server' );
};

// stop the dyno
process.on( 'SIGTERM', stop );

// start riak
start();

// ping riak forever
setTimeout( function () {
	setInterval( ping, 5000 );
}, 5000 );



