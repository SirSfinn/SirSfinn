/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

//Shawn Finnigan
//Team Sonny
//Find the Gold Mod
//Mod 1: Changed grid size to 6x6 & removed bead border
//Mod 2: Changed bead color by default and upon click
//Mod 3: Added randomized "gold" placement
//Mod 4: Added "X" glyph upon clicking "non-gold" bead
//Mod 5: Added unique "metal detector" fx upon hovering over both "gold" and "non-gold" beads
//Mod 6: Added gold/miss counter via status text changes
//Mod 7: Added a score formula that is calculated upon victory.
//Mod 8: Added a unique effect that plays once victory has been achieved 

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

var score = {goldCounter : 0, missCounter : 0};

PS.init = function( system, options ) {

    // Establish grid dimensions
	
	PS.gridSize( 6, 6 );
	
	// Randomizes the PS.data of three beads, guaranteeing that pieces of gold will spawn. 
    // Note: I haven't run into a single iteration of two beads spawning in the same place.
    // Can that happen using this method?	
	
	PS.data(PS.random(5), PS.random(0), PS.COLOR_YELLOW)
	PS.data(PS.random(0), PS.random(5), PS.COLOR_YELLOW)
	PS.data(PS.random(5), PS.random(5), PS.COLOR_YELLOW)
	
	// Set background color to Perlenspiel logo gray
	
	PS.gridColor( PS.COLOR_GRAY );
	
	// Turns bead border brown, effectively removing it
	
	PS.border( PS.ALL, PS.ALL, 0)
	
	// Set all beads to starting color of brown
	
    PS.color(PS.ALL, PS.ALL, [94, 49, 0]);
	
	// Change status line color and text

	PS.statusColor( PS.COLOR_BLACK );
	PS.statusText( "You have a metal detector. Find the gold!" );
	
	// Preload detector beeps/blips and click sound

	PS.audioLoad( "fx_blip" );
	PS.audioLoad( "fx_click" );
	PS.audioLoad( "fx_coin2" );

	
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
	// Toggle color of touched bead from white to black and back again
	// NOTE: The default value of a bead's [data] is 0, which happens to be equal to PS.COLOR_BLACK

	//PS.color( x, y, data); // set color to current value of data
	
	
	// Decide what the next color should be.
	// If the current value was black, change it to white.
	// Otherwise change it to black.

	 let next; // variable to save next color

	PS.data( x, y, next );
	 
	
	//If the color "beneath" a bead is black, then add a black X on that bead, a +1 to the missCounter, and change the statusText message.
	
	if (data == PS.COLOR_BLACK ) {
	score.missCounter ++;
	PS.glyph( x, y, "X")
	PS.statusText( "Misses:" + score.missCounter )
	}
	
	//If the color is yellow (gold), send a statusText message and don't update the goldCounter.
	
	else { if (PS.color (x,y) == PS.COLOR_YELLOW) {
	PS.statusText( "Nice try, you already found that gold.")}
	
	// If the color "beneath" the bead is yellow, then add one to the gold counter, change the bead to yellow, and update the statusText.
	
	else {
		score.goldCounter++;
		PS.color(x, y, PS.COLOR_YELLOW)
	    PS.statusText( "Gold:" + score.goldCounter + "/3")
		}
	}
	
	//If the gold counter reaches 3, change all beads to green, add a $ glyph to them, and update the statusText.
	
	if (score.goldCounter == 3) {
		PS.color(PS.ALL, PS.ALL, PS.COLOR_GREEN)
		PS.glyph(PS.ALL, PS.ALL, "$")
		PS.statusText( "You're rich! Score:" + (((score.goldCounter) * 5) - score.missCounter) + "/15. Refresh to restart.")
	}

	// NOTE: The above statement could be expressed more succinctly using JavaScript's ternary operator:
	// let next = ( data === PS.COLOR_BLACK ) ? PS.COLOR_WHITE : PS.COLOR_BLACK;	

	// Play click sound.

	PS.audioPlay( "fx_click" );
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
	
	PS.audioPlay( "fx_blip" );
	
	//If the color "beneath" a bead is yellow, then a unique sound effect will play.
	
	if (data == PS.COLOR_YELLOW ) {
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
