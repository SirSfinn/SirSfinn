/*
game.js for Perlenspiel 3.3.xd
Last revision: 2021-04-22 (SF)
Shawn Finnigan
Team Sonny

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

const GRID_WIDTH = 6;
const GRID_HEIGHT = 6;
const PASTEL_GREEN = [153, 255, 153];
var BEAD_COLOR = ([])
var SHADOW_COLOR = ([])
let won = false; //Flag to indicate win
let k = 0 //Counter variable used to detect number of loops

// This array stores the glyphs in rows/columns that resemble the grid.
// They can be stored as Unicode strings (as shown) or as numbers.
// The glyph in the bottom right corner is defined as zero (no glyph).

const GLYPHS = [
	"⓵", "⓶", "⓷", "⓸", "⓹", "⓺"]
	//"♙", "♘", "♗", "♖", "♕", "♔",
	//"Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ",
	//"➊", "➋", "➌", "➍", "➎", "➏",
	//"⒈", "⒉", "⒊", "⒋", "⒌", "⒍",
	//"☼", "☽", "☿", "♀", "♁", 0
//];

// These variables store the current x/y location of the empty bead

let empty_x, empty_y;

var randomColor = function () { //Function to assign random colors to variables r, g, and b
	var r = 0;
	var g = 0;
	var b = 0;

	r = PS.random(128) + 127;
	g = PS.random(128) + 127;
	b = PS.random(128) + 127;

	BEAD_COLOR = ([r, g, b]);

}

var randomColor2 = function () { //Function to assign random colors to variables r, g, and b
	var r2 = 0;
	var g2 = 0;
	var b2 = 0;

	r2 = PS.random(128) + 127;
	g2 = PS.random(128) + 127;
	b2 = PS.random(128) + 127;

	SHADOW_COLOR = ([r2, g2, b2]);

}

var randomizeGlyphs = function() {  //Function to randomize the placement of the glyphs
	let xt = PS.random(5);
	let yt = PS.random(5);

	if (((PS.glyph(xt, yt)) == 0) && (k <= 5)) {
		PS.glyph(xt, yt, GLYPHS[k]);
		k += 1;
		randomizeGlyphs();
	}
	if (((PS.glyph(xt, yt)) > 0) && (k <= 5)) {
		randomizeGlyphs();
	}
	if (k == 6) {
		randomizeEmpty();
	}
}

var randomizeEmpty = function() {  //Function to randomize the placement of the empty bead
	let xt = PS.random(5);
	let yt = PS.random(5);
	if (((PS.glyph(xt, yt)) == 0)) {
		PS.color(xt, yt, PS.COLOR_WHITE);
		k += 1;
		empty_x = xt;
		empty_y = yt;
	}
	else {
		randomizeEmpty();
	}
}

var initGame = function() { //Function to reset board fully randomized once more
	k = 0;
	won = false;
	PS.active(PS.ALL, PS.ALL, true);
	randomColor();
	PS.color(PS.ALL, PS.ALL, BEAD_COLOR);
	PS.statusText("Use the arrow keys to order beads at the top.");
	PS.glyph(PS.ALL, PS.ALL, 0);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_GRAY);
	randomColor2();
	PS.gridShadow(true, SHADOW_COLOR);
	randomizeGlyphs();
}



PS.init = function( system, options ) {
    randomColor();
    randomColor2();
	//PS.bgAlpha( PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
	//PS.bgColor(PS.ALL, PS.ALL, BEAD_COLOR);
    PS.gridSize( GRID_WIDTH, GRID_HEIGHT );
	PS.gridColor ( PS.COLOR_GRAY );
	PS.color( PS.ALL, PS.ALL, BEAD_COLOR); // Sets all beads to pastel green
	PS.fade (PS.ALL, PS.ALL, 15);
	PS.gridShadow(true, SHADOW_COLOR);

	// Initialize location of empty bead

	empty_x = 0;
	empty_y = 0;

	randomizeGlyphs();
	const TEAM = "sonny";

	PS.statusText("Use the arrow keys to order beads at the top.");

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
	}, { active : false } );
	
	// Change the false in the final line above to true
	// before deploying the code to your Web site.

    //initGame(); // call initializer



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

// Swap the positions of bead (x, y) and bead (empty_x, empty_y)

const swap = function ( x, y ) {
	let glyph = PS.glyph( x, y ); // get glyph in this location
	PS.glyph( x, y, 0 ); // remove glyph
	PS.color( x, y, PS.COLOR_WHITE ); // change to blank color

	PS.glyph( empty_x, empty_y, glyph ); // switch in new glyph
	PS.color( empty_x, empty_y, BEAD_COLOR ); // change color

	// Update location of empty bead

	empty_x = x;
	empty_y = y;

	PS.audioPlay( "fx_click" ); // move sound
};

PS.touch = function( x, y, data, options ) {
	// Check to see if this bead is either directly above, below, left or right of empty square

	if (won == true) {
		PS.active(PS.ALL, PS.ALL, false);
		initGame();
	}

	if ( x === empty_x ) { // same column?
		let ny = empty_y - 1; // directly above?
		if ( y === ny ) { // yes!
			swap( x, y );
			return;
		}
		ny = empty_y + 1 // directly below?
		if ( y === ny ) { // yes!
			swap( x, y );
			return;
		}
	}
	else if ( y === empty_y ) { // same row?
		let nx = empty_x + 1; // directly left?
		if ( x === nx ) { // yes!
			swap( x, y );
			return;
		}
		nx = empty_x - 1; // directly right?
		if ( x === nx ) { // yes!
			swap( x, y );
			return;
		}
	}

	PS.audioPlay( "fx_squawk" ); // bad move sound

	if ((PS.glyph(0, 0) == 9461) && (PS.glyph(1, 0) == 9462) && (PS.glyph(2, 0) == 9463) && (PS.glyph(3, 0) == 9464) && (PS.glyph(4, 0) == 9465) && (PS.glyph(5, 0) == 9466)) {
		PS.audioPlay("fx_tada");
		PS.borderColor(PS.ALL, PS.ALL, PASTEL_GREEN);
		PS.statusText("Puzzle Completed! Click/Press a button to restart");
		PS.glyph(PS.ALL, PS.ALL, 0);
		PS.color(PS.ALL, PS.ALL, PASTEL_GREEN);
		won = true;
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


};




//PS.enter ( x, y, button, data, options )
//Called when the mouse cursor/touch enters bead(x, y).
//This function doesn't have to do anything. Any value returned is ignored.
//[x : Number] = zero-based x-position (column) of the bead on the grid.
//[y : Number] = zero-based y-position (row) of the bead on the grid.
//[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
//[options : Object] = A JavaScript object with optional data properties; see API documentation for details.

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

	//PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.

	if (won == true) {
		initGame();
	}

	//Code that moves the empty space in the direction of a selected arrow key

	if ((key == 1006) && (empty_y >= 0)) {  //If key up is chosen
	if(empty_y == 0) {
		return;
	}
	else (swap(empty_x, (empty_y - 1)));
}

if ((key == 1008) && (empty_y >= 0)) {  //If key down is chosen
	if(empty_y == 5) {
		return;
	}
	else (swap(empty_x, (empty_y + 1)));
}

if ((key == 1007) && (empty_y >= 0)) {  //If key right is chosen
	if(empty_x == 5) {
		return;
	}
	else (swap((empty_x + 1), empty_y));
}


if ((key == 1005) && (empty_y >= 0)) {  //If key left is chosen
	if(empty_x == 0) {
		return;
	}
	else (swap((empty_x - 1), empty_y));
}

	if ((PS.glyph(0, 0) == 9461) && (PS.glyph(1, 0) == 9462) && (PS.glyph(2, 0) == 9463) && (PS.glyph(3, 0) == 9464) && (PS.glyph(4, 0) == 9465) && (PS.glyph(5, 0) == 9466)) { //Checks if win condition has been met
		PS.audioPlay("fx_tada");
		PS.borderColor(PS.ALL, PS.ALL, PASTEL_GREEN);
		PS.statusText("Puzzle Completed! Press a button to restart!");
		PS.glyph(PS.ALL, PS.ALL, 0);
		PS.color(PS.ALL, PS.ALL, PASTEL_GREEN);
		won = true;
	}

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

	PS.input = function (sensors, options) {
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

	PS.shutdown = function (options) {
		// Uncomment the following code line to verify operation:

		// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

		// Add code here to tidy up when Perlenspiel is about to close.
	};

