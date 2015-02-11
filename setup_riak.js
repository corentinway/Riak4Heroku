var fs = require( 'fs' );
var path = require( 'path' );

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
function copy( filename, target ) {
//	var target = folder + '/' + path.basename( filename );
	backupFile( target );
	var options = {
		mode: '0777'
	};
	fs.createReadStream( filename ).pipe( fs.createWriteStream( target, options ) );
}

console.log( 'setting up riak from: ' + __dirname );


copy( __dirname + '/riak_script/riak', __dirname + '/.dpkg/usr/sbin/riak' );
copy( __dirname + '/riak_script/env.sh', __dirname + '/.dpkg/usr/lib/riak/lib/env.sh' );
copy( __dirname + '/riak_script/riak.config', __dirname + '/.dpkg/etc/riak/riak.config' );