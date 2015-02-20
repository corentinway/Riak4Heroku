#!/usr/bin/env node

var fs = require( 'fs' );

var configurationFilePath = __dirname + '/../.dpkg/etc/riak/riak.conf';
var target = configurationFilePath + '.target.txt';

if ( !fs.existsSync( configurationFilePath ) ) {
	console.error( 'Configuration file path does not exists: ' + configurationFilePath );
	process.exit( 1 );
}

var configurations = [
	{ re: /listener.http.internal = 127.0.0.1:27180/, value: 'listener.http.internal = 127.0.0.1:' + process.env.PORT + '\n' }
];

// ***********************
/*
var text = 'Bonjour le monde\n' + 'salut ca va\n' + 'listener.http.internal = 127.0.0.1:27180\n' + '\n' + '------------';
console.log( text );
var newText = text;
configurations.forEach( function ( configuration ) {
	newText = newText.replace( configuration.re, configuration.value );
} );

console.log( '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
console.log( newText );

return;*/
// ***********************

var fileOptions = { 
	encoding: 'utf-8'
};

fs.readFile( configurationFilePath, fileOptions, function ( err, oldConfig ) {
	if ( err ) {
		console.error( err );
		process.exit( 2 );
	} else {
		var newConfig = oldConfig;
		configurations.forEach( function ( configuration ) {
			newConfig = newConfig.replace( configuration.re, configuration.value );
		} );
		fs.writeFile( target, newConfig, { encoding: 'utf-8' }, function ( err ) {
			if ( err ) {
				console.error( err );
				process.exit( 3 );
			}
		} );
	}
} );

