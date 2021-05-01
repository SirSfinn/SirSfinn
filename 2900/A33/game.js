/*
game.js for Perlenspiel 3.3.xd
Last revision: 2021-04-08 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-21 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

//Commonly used colors


const MAP_GROUND = 1;
const MAP_WALL = 0;
const MAP_PLANE = 0;
var GRID_X = 10;
var GRID_Y = 10;

const WHITE = PS.COLOR_WHITE;
const LIGHT_GRAY = [210, 210, 210];
const GRAY = [170, 170, 170];
const DARK_GRAY = [110, 110, 110];
const BLACK = PS.COLOR_BLACK;
const GRASS = ([140, 200, 110]);
const DARK_GRASS = ([20, 100, 0])
const DIRT = ([200, 180, 100])
const CHAT_1 = ([250, 230, 20])
const CHAT_2 = ([160, 210, 40])
const CHAT_3 = ([110, 200, 210])
const CHAT_BACK = ([210, 0, 10])
const CHAT_FRWD = ([0, 150, 10])

//Player Characters

const  FROG = ([80, 230, 50]);
const HEDGEHOG = ([220, 130, 0]);
const RACCOON = ([130, 130, 130]);
const DEER = ([190, 160, 100]);
const FOX = ([150, 40, 30]);

//NPCs

 const BLUE_OWL = ([50, 85, 210]);
const GREEN_TORTOISE = ([50, 130, 80]);
const SALMON_SALMON = ([200, 100, 100]);
const YELLOW_MOUSE = ([230, 220, 120]);
const BROWN_BEAR = ([130, 80, 50]);
const BLACK_CROW = PS.COLOR_BLACK;

//Actor Stuff
var actor_color;
var actor_x = 2;
var actor_y = 13;
var actor_glyph = 0;
var actor_path = null;
var actor_position;
var actor_sprite;

var timer_id;
var pathmap;

var i = 0;
var xt = 0;
var yt = 0;

//Triggers & Checks

var mapInit = false;
var charSelect = false;
var isChat = false;

var makeCharacter = function(x, y, color) {
	PS.color(x, y, color);
	PS.color(x+1, y, BLACK);
	PS.color(x-1, y, BLACK);
	PS.color(x+1, y+1, BLACK);
	PS.color(x-1, y+1, BLACK);
	PS.color(x+1, y-1, BLACK);
	PS.color(x-1, y-1, BLACK);
	PS.color(x, y+1, BLACK);
	PS.color(x, y-1, BLACK);
};

var placeNPCS = function() {
	PS.color(2, 2, BLUE_OWL);
	PS.color(6, 2, BLACK_CROW);
	PS.color(12, 3, BROWN_BEAR);
	PS.color(12, 13, GREEN_TORTOISE);
	PS.color(1, 8, YELLOW_MOUSE);
	PS.color(7, 14, SALMON_SALMON);
}

var actor_place = function ( x, y ) {
	PS.spriteMove( actor_sprite, x, y );
	actor_x = x;
	actor_y = y;
};

var actor_step = function ( h, v ) {
	var nx, ny;

	// Calculate proposed new location.

	nx = actor_x + h;
	ny = actor_y + v;

	if ((PS.color(nx, ny)) == BLACK) {
		return;
	}
};

var actor_animate = function () {
	var point, x, y;

	if ( actor_path ) {
		point = actor_path[ actor_position ];
		x = point[ 0 ];
		y = point[ 1 ];
		// if ( is_wall( x, y ) ) {
		// 	actor_path = null;
		// 	return;
		// }
		actor_place( x, y );
		actor_position += 1;
		if ( actor_position >= actor_path.length ) {
			actor_path = null;
		}
	}
};

var imagemap = {
	width : 16,
	height : 16,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0,
		0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0,
		0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0,
		0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0,
		0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0,
		0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0,
		0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0,
		0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
};

var draw_map = function ( map ) {

	mapInit = true;

	if (i == 255) {
		PS.color(15, PS.ALL, GRASS);
		return;
	}

	if (xt == 15) {
		yt += 1;
		xt = 0;
		i += 1;
		draw_map(imagemap);
	}

	if (map.data[ i ] == 0) {
		PS.color(xt, yt, GRASS);
		xt += 1;
		i += 1;
		draw_map(imagemap);
	}

	if (map.data[ i ] == 1) {
		PS.color(xt, yt, DIRT);
		xt += 1;
		i += 1;
		draw_map(imagemap);
	}
};

var setMap = function() {
	GRID_X = 16;
	GRID_Y = 16;
	PS.gridSize(GRID_X, GRID_Y);
};

var setChat = function() {
	isChat = true;
	PS.statusText("Owl: Hello! I'm glad you've come...")
	PS.gridSize(15, 15);
	PS.color(PS.ALL, 0, CHAT_1);
	PS.color(PS.ALL, 1, CHAT_1);
	PS.color(1, 1, BLACK);
	PS.color(PS.ALL, 2, CHAT_1);
	PS.color(PS.ALL, 3, BLACK);
	PS.color(PS.ALL, 4, CHAT_2);
	PS.color(PS.ALL, 5, CHAT_2);
	PS.color(1, 5, BLACK);
	PS.color(3, 5, BLACK);
	PS.color(PS.ALL, 6, CHAT_2);
	PS.color(PS.ALL, 7, BLACK);
	PS.color(PS.ALL, 8, CHAT_3);
	PS.color(PS.ALL, 9, CHAT_3);
	PS.color(1, 9, BLACK);
	PS.color(3, 9, BLACK);
	PS.color(5, 9, BLACK);
	PS.color(PS.ALL, 10, CHAT_3);
	PS.color(PS.ALL, 11, BLACK);

};

var shade = function ( color ) {
	var RANGE, vary, r, g, b;

	RANGE = 32;

	vary = function ()  {
		return ( PS.random( RANGE * 2 ) - RANGE );
	};

	r = color.r + vary();
	g = color.g + vary();
	b = color.b + vary();

	return PS.makeRGB( r, g, b );
};

var testChat = function() {
	if ((actor_x == 2) && (actor_y == 2)) {
		setChat()
		mapInit = false;
	}
};

PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	PS.gridSize( GRID_X, GRID_Y );
	PS.statusText("Pick your character!");

	makeCharacter(2, 2, FROG);
	makeCharacter(7, 2, HEDGEHOG);
	makeCharacter(2, 7, FOX);
	makeCharacter(7, 7, DEER);

	charSelect = true;

	timer_id = PS.timerStart( 6, actor_animate );
	PS.timerStart( 6, testChat );



	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	// PS.statusText( "Game" );

	// Add any other initialization code you need here.

	// Change this TEAM constant to your team name,
	// using ONLY alphabetic characters (a-z).
	// No numbers, spaces, punctuation or special characters!

	const TEAM = "sonny";

	// This code should be the last thing
	// called by your PS.init() handler.
	// DO NOT MODIFY IT, except for the change
	// explained in the comment below.

	PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
		if ( user === PS.ERROR ) {
			return;
		}
		PS.dbEvent( TEAM, "startup", user );
		PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
	}, { active : true } );
	
	// Change the false in the final line above to true
	// before deploying the code to your Web site.
};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.

//if ((mapInit == true) && (PS.color(x,y) !== 0)) {}
	pathmap = PS.pathMap( imagemap );
	var path;
	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	path = PS.pathFind( pathmap, actor_x, actor_y, x, y );
	if ( (path.length > 0) && (mapInit == true)) {
		actor_position = 0;
		actor_path = path;
	}

	if (((PS.color(x,y)) !== 0) && ((PS.color(x,y)) !== WHITE) && (charSelect == true)) { //If you're at the character select screen
		actor_color = PS.color(x,y);
		setMap();                                     //and a glyph is clicked, do this...
		draw_map(imagemap);
		placeNPCS();
		PS.statusText("Blue Owl said to meet with him today!");
		actor_sprite = PS.spriteSolid( 1, 1 ); // Create 1x1 solid sprite, save its ID
		PS.spritePlane ( actor_sprite, 1 );
		PS.spriteSolidColor( actor_sprite, actor_color); // assign color
		actor_place(2, 13);
		charSelect = false;
	}

};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

	//	 var device = sensors.wheel; // check for scroll wheel
	//
	//	 if ( device ) {
	//	   PS.debug( "PS.input(): " + device + "\n" );
	//	 }

	// Add code here for when an input event is detected.
};

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

PS.shutdown = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

