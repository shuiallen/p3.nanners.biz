p3.nanners.biz
==============

Project 3 for CSCI-E15

* Jquery and Jquery UI features
*	Options are in accordion sections
*	Use of fadeout and fadein when racer and bibs are selected or unasssigned
*	Click handlers for button operations
*	Fill dropdown list conditionally based on option selection (gender/school)
*	Use show/hide for roster preview (although some issues with layout and buttons)
*   Use dataTable plugin to display roster in a table with sorting functions
*
* Minor issues/incomplete functionality
*	I would spend more time on this but I want to get started on P4
*	The preview roster layout is terrible, the buttons are not displaying correctly
*	and I haven't had time to figure out how to print
*
* Roster Assignment Features
*
*  Setup the racer slots - racer names are still hardcoded
*  Initialize bib and assignment board based on gender and school selection*
*  
*  Implemented actions:
*      Select and deselect a racer
*      Select and deselect a big number
*      Assign a racer to a bib number using a click event handler, remove race and bib number from display
*      Remove an assignment - put the racer and bib number back, un-highlighted
*      Display the roster in a table - currently pops up, layout is not good
*
* Lots of ideas for more functionality, but would work better with a server and php framework
* 		Record both boys and girls roster on the same page
* 		Import a list of names into the roster
* 		Export the roster to a csv
*		Extend the tool to track race times
*  		Import the roster from a csv, to be able to record race times
*      	Submit race times for each racer/bib number
*      	Display the roster and race times in a table 
*      	Export the roster with race times to a csv
*      	Collate rosters from several schools
*  
* Fancier matching:
*     Attempted to use dragging but the action is not necessarily more intuitive or usable to make a pair
*         If I used slots 1-10 for assignment and computed the bib number based on school, it might make more sense
*         There is a formula for bib numbers, based on school, gender, rank, that can be computed