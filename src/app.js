// Require

const express = require( 'express' );
const fs = require( 'fs' );
const bodyParser = require( 'body-parser' );
const path = require( 'path' );

// App

const app = express( );

// Use

app.use( express.static( path.join( __dirname, '../public' ) ) );
app.use( bodyParser.json( ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

// Set

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );

// HTTP get

app.get( '/', function( req, res ) {
	res.render( 'index' );
} );

app.get( '/users', function( req, res ) {
	fs.readFile( './users.json', 'utf8', function( err, data ) {
		let content;
		if ( err ) {
			throw "Error!";
		}
		let parsedJson = JSON.parse( data );
		let listUsers = [ ];

		for ( var i = 0; i < parsedJson.length; i++ ) {
			listUsers.push( parsedJson[ i ].firstname )
		};
		res.render( 'users', { all: listUsers } );
	} );
} );

app.get( '/searchuser', function( req, res ) {
	res.render( 'searchuser' )
} );

app.get( "/newuser", function( req, res ) {
	res.render( 'newuser' );
} )

// HTTP post

app.post( '/search_user', function( req, res ) {
	fs.readFile( './users.json', 'utf8', function( err, data ) {
		if ( err ) {
			throw "Error!";
		}
		let parsedJson = JSON.parse( data );
		let matching_users = [ ];
		for ( var i = 0; i < parsedJson.length; i++ ) {
			if ( req.body.search_bar.toLowerCase( ) === parsedJson[ i ].firstname.toLowerCase( ) || req.body.search_bar.toLowerCase( ) === parsedJson[ i ].lastname.toLowerCase( ) ) {
				matching_users.push( parsedJson[ i ].firstname + " " + parsedJson[ i ].lastname )
			};
		}
		res.render( 'matchinguser', { a: matching_users } );
	} );
} );

app.post( '/new_user', function( req, res ) {
	fs.readFile( './users.json', 'utf8', function( err, data ) {
		if ( err ) {
			throw "Error!";
		}
		let parsedJson = JSON.parse( data );
		let listUsers = [ ];
		parsedJson.push( req.body );
		console.log( parsedJson );

		let newJson = JSON.stringify( parsedJson );
		let fileContents = newJson;
		fs.writeFile( "./users.json", fileContents, function( err ) {
			if ( err ) { throw err; }
		} );

		for ( let i = 0; i < parsedJson.length; i++ ) { listUsers.push( parsedJson[ i ].firstname ) }
		res.render( 'users', { all: listUsers } );
	} );
} );

// Listen

app.listen( 3000, function( ) {
	console.log( "server listening on port 3000" );
} );