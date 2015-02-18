/*jslint node:true, white: true, plusplus: true, vars: true */

'use strict';

var fs = require( 'fs' );
var exec = require( 'child_process' ).exec;
var split = require( 'split' );
var through = require( 'through' );

var configurationFilePath = __dirname + '/.dpkg/etc/riak/riak.conf';

if ( !fs.existsSync( configurationFilePath ) ) {
	console.error( 'Configuration file path does not exists: ' + configurationFilePath );
	process.exit( 1 );
}


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
		console.log( '  checking configuration line: ' + line  );
		if ( line.indexOf( configurations[ i ].key ) >= 0 ) {
			console.log( '  line to change: ' + line );
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
var updateConfiguration = function( callback ) {
	console.log( '  Updating configuration' );
	console.log( '------------------------' );
	fs.createReadStream( configurationFilePath )
	.pipe( split( '\n') )
	.pipe( through( updateConfigurationLine ) )
	.pipe( fs.createWriteStream( configurationFilePath ) )
	.on( 'end', callback );
};

var showConfiguration = function( callback ) {
	console.log( 'Riak configuration' );
	console.log( '------------------' );
	fs.createReadStream( configurationFilePath )
	.pipe( split( '\n') )
	.on( 'data', function ( data ) {
		if ( data.trim().indexOf( '#') !== 0 ) {
			console.log( data.trim() );
		}
	} )
	.on( 'end', callback );
};

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
	updateConfiguration( function () {
		showConfiguration( function () {
			exec( __dirname + '/.dpkg/usr/sbin/riak start' , execHandler( 'Failed to start Riak.', pings ) );
		} );
	} );
};

var stop = function () {
	exec( __dirname + '/.dpkg/usr/sbin/riak stop' , execHandler( 'Failed to stop Riak.', process.exit ) );
};


// stop the dyno
process.on( 'SIGTERM', stop );

// start riak
start();