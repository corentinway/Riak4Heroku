var fs = require( 'fs' );
var path = require( 'path' );

var split = require( 'split' );
var through = require( 'through' );

/**
 * rename a file with the '.back' extension
 */
function backupFile( filename ) {
	var target = filename + '.back';
	if ( fs.existsSync( filename ) && !fs.existsSync( target ) ) {
		fs.renameSync( filename, target );
	}
}
/**
 * copy a file into a folder. the original target file is backed up
 */
function copy( filename, target, duplex ) {
//	var target = folder + '/' + path.basename( filename );
	backupFile( target );
	var options = {
		mode: '0777'
	};
	
	if ( !duplex ) {
		fs.createReadStream( filename ).pipe( fs.createWriteStream( target, options ) );
	} else {
		fs.createReadStream( filename )
		.pipe( split( '\n' ) )
		.pipe( duplex )
		.pipe( fs.createWriteStream( target, options ) );
		
	}
}

console.log( 'setting up riak from: ' + __dirname );

copy( __dirname + '/riak_script/riak', __dirname + '/.dpkg/usr/sbin/riak' );
copy( __dirname + '/riak_script/env.sh', __dirname + '/.dpkg/usr/lib/riak/lib/env.sh' );
copy( __dirname + '/riak_script/riak.conf', __dirname + '/.dpkg/etc/riak/riak.conf' );