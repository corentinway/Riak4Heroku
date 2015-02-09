var fs = require( 'fs' );
var path = require( 'path' );

/**
 * rename a file with the '.back' extension
 */
function backupFile( filename ) {
	var target = filename + '.back';
	if ( !fs.existsSync( target ) ) {
		fs.renameSync( filename, target );
	}
}
/**
 * copy a file into a folder. the original target file is backed up
 */
function copy( filename, folder ) {
	var target = folder + '/' + path.basename( filename );
	backupFile( target );
	var options = {
		mode: '0777'
	};
	fs.createReadStream( filename ).pipe( fs.createWriteStream( target, options ) );
}


copy( __dirname + '/riak_script/riak', '/app/.dpkg/usr/sbin' );
copy( __dirname + '/riak_script/env.sh', '/app/.dpkg/usr/lib/riak/lib/' );
copy( __dirname + '/riak_script/riak.conf', '/app/.dpkg/etc/riak' );