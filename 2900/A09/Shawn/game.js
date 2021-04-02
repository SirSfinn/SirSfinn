/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

//Shawn Finnigan
//Team Sonny
//Find the Gold Mod
//Mod 1: Changed grid size to 6x6 & removed bead border.
//Mod 2: Changed bead color by default and upon click. Added fader. 
//Mod 3: Added randomized "gold" placement
//Mod 4: Added "X" glyph upon clicking "non-gold" bead
//Mod 5: Added unique "metal detector" fx upon hovering over both "gold" and "non-gold" beads
//Mod 6: Added gold/miss counter via status text changes
//Mod 7: Added a score & winscreen that is calculated and shared upon victory. 

"use strict"; // do not remove this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

//counter variables used to track gold found and number of times a non-gold bead is clicked

let score = {
	goldCounter : 0,
	missCounter : 0
};

let scoreCalculated = 0 // Variable that prevents the fx from replaying when clicking reset once game is over.

let won = false; // flag to indicate win

// Isolate code that restarts game

const GRID_SIZE = 6; // make this a constant in case you change your mind

const initGame = function () {
	PS.data( PS.ALL, PS.ALL, 0 ); // reset all bead data

	let x = PS.random( GRID_SIZE ) - 1;
	let y = PS.random( GRID_SIZE ) - 1;
	PS.data( x, y, PS.COLOR_YELLOW );

	// Make sure second gold is AT LEAST in a different column

	let val;
	do {
		val = PS.random( GRID_SIZE ) - 1;
	} while ( val === x );
	PS.data( val, PS.random( GRID_SIZE ) - 1, PS.COLOR_YELLOW );

	// Make sure third gold is AT LEAST in a different row

	do {
		val = PS.random( GRID_SIZE ) - 1;
	} while ( val === y );
	PS.data( PS.random( GRID_SIZE ) - 1, val, PS.COLOR_YELLOW );

	PS.gridColor( PS.COLOR_GRAY );

	// Set all beads to starting color of brown

	PS.color(PS.ALL, PS.ALL, [94, 49, 0]);
	PS.glyph(PS.ALL, PS.ALL, 0); // clear all glyphs

	// Change status line color and text

	PS.statusColor( PS.COLOR_BLACK );
	PS.statusText( "You have a metal detector. Find the gold!" );

	won = false;
	score.goldCounter = 0; // reset level score
};

PS.init = function( system, options ) {
	// Run one-time initialization

    // Establish grid dimensions
	
	PS.gridSize( GRID_SIZE, GRID_SIZE );

	// Preload detector beeps/blips and click sound

	PS.audioLoad( "fx_blip" );
	PS.audioLoad( "fx_click" );
	PS.audioLoad( "fx_coin2" );

	PS.border( PS.ALL, PS.ALL, 0);
	
	//Causes all beads to fade into a new color at a rate of 30 ticks
	
	PS.fade(PS.ALL, PS.ALL, 30);
	
	//Enables black drop-shadow behind grid
	
	PS.gridShadow (true, PS.COLOR_BLACK);

	initGame(); // call initializer
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
	PS.audioPlay( "fx_click" );
	if ( won ) {
		if ( scoreCalculated < 5 ) {
			initGame();
		}
		return;
	}

	// If bead data is 0, add a black X on that bead, a +1 to the missCounter, and change the statusText message.

	if ( !data ) {
		score.missCounter += 1;
		PS.glyph( x, y, "X" );
		PS.audioPlay( "fx_squawk" ); // a random sound I picked
		PS.statusText( "Misses: " + score.missCounter );
	}

	//If the color is yellow (gold), send a statusText message and don't update the goldCounter.

	else if ( PS.color( x, y ) === PS.COLOR_YELLOW ) {
		PS.audioPlay( "fx_squawk" ); // a random sound I picked
		PS.statusText( "Nice try. You already found that gold." );
	}

	// If the color "beneath" the bead is yellow, then add one to the gold counter, change the bead to yellow, and update the statusText.

	else {
		score.goldCounter += 1;
		PS.color( x, y, PS.COLOR_YELLOW );
		if ( score.goldCounter === 3 ) {
			won = true;
			PS.audioPlay( "fx_tada" );
			PS.color(PS.ALL, PS.ALL, PS.COLOR_GREEN);
			PS.glyph(PS.ALL, PS.ALL, "$");
			PS.statusText ( "You're rich! Click to play again!")
			//PS.statusText( "You're rich! Score: " + (((score.goldCounter) * 5) - score.missCounter) + "/15. Click to restart.");
			scoreCalculated += 1;
		}
		else {
			PS.audioPlay( "fx_coin1" ); // a random sound I picked
			PS.statusText( "Gold: " + score.goldCounter + "/3" );
		}
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

// UNCOMMENT the following code BLOCK to expose the PS.release() event handler:

/*

PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

*/

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.enter() event handler:



PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	//Causes detector blips upon entering a new bead
	
	if (score.goldCounter < 3){
	PS.audioPlay( "fx_blip" )};
	
	//If the color "beneath" a bead is yellow, then a unique sound effect will play.
	
	if (data == PS.COLOR_YELLOW && score.goldCounter < 3) {
	PS.audioPlay( "fx_coin2") ;
	}
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

// UNCOMMENT the following code BLOCK to expose the PS.exit() event handler:

/*

PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

*/

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exitGrid() event handler:

/*

PS.exitGrid = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

*/

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyDown() event handler:

/*

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

*/

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyUp() event handler:

/*

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

*/

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

// UNCOMMENT the following code BLOCK to expose the PS.input() event handler:

/*

PS.input = function( sensors, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

*/

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

// UNCOMMENT the following code BLOCK to expose the PS.shutdown() event handler:

/*

PS.shutdown = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

*/
