/* Collect data from input actions
*/
var gender = "";
var dateObject = "";
var racetype ="";
var site = "";
var school = "";

var racerPick;
var bibPick;

/*-------------------------------------------------------------------------------------------------
Gender
-------------------------------------------------------------------------------------------------*/
$('.gender').click(function() {

	 // Boys or Girls
	 var radio_button = $(this);

	 // What is the label next to (i.e. after) that radio 
	 var label = radio_button.next();

	 // Now that we know the label, grab the text inside of it (That's our message!)
	 gender = label.html();	
});

/*-------------------------------------------------------------------------------------------------
Site
-------------------------------------------------------------------------------------------------*/
$('.site').click(function() {

	 // Site
	 var radio_button = $(this);

	 // What is the label next to (i.e. after) that radio 
	 var label = radio_button.next();

	 // Now that we know the label, grab the text inside of it
	 site = label.html();	
});

/*-------------------------------------------------------------------------------------------------
Race type
-------------------------------------------------------------------------------------------------*/
$('.racetype').click(function() {

	 // Type
	 var radio_button = $(this);

	 // What is the label next to (i.e. after) that radio 
	 var label = radio_button.next();

	 // Now that we know the label, grab the text inside of it 
	 racetype = label.html();	
});

/*-------------------------------------------------------------------------------------------------
Team / School 
-------------------------------------------------------------------------------------------------*/
$('.team').click(function() {
	// This is not working either
	console.log("got here");

	// Dropdown value
	school = $('#team').val();
	console.log(school);
});

/*-------------------------------------------------------------------------------------------------
Race Date
-------------------------------------------------------------------------------------------------*/
$("#datepicker").datepicker(
{
    onSelect: function()
    { 
        dateObject = $(this).datepicker('getDate'); 
        console.log(dateObject);
    }
});

/*-------------------------------------------------------------------------------------------------
Preview Roster
-------------------------------------------------------------------------------------------------*/
$('#preview-roster').click(function() {

	// TBD:  this is not working, how do you get the drop down value if the displayed on is the one you want
	// click function is defined above
	school = $('#team').val();
	console.log(school);

	var title = gender + " " + racetype + " at " + site + " - " + school + " - " + dateObject
	console.log("title is " + title);
	$('#title-report').html(title);

});






/**
*
* Roster Board
* @class Roster
* @constructor setup_roster
*
*  Setup the racer slots, bib numbers, assignment board
*  Extra: Import a list of names into the roster
*  Extra: Record both boys and girls roster on the same page
*  Display the roster in a table
*  Extra: Export the roster to a csv
*  Extra: Import the roster from a csv, to be able to record race times
*  Submit race times for each racer/bib number
*  Display the roster and race times in a table
*  Extra: Export the roster with race times to a csv
*
*/
// An array indexed by bib number, each entry contains the racer name
var bibAssignment = [];

var Roster = {

	// HTML objects
	racers: '',
	bibs: '',
	pairs: '',

	racerSelected: 0,
	bibSelected: 0,

	setup: function(id_of_racers, id_of_bibs, racerNames, bibStart, numRacers) {
		// First, identify the board and the scoreboard objects
		this.racers = $('#' + id_of_racers);
		this.bibs   = $('#' + id_of_bibs);
		this.pairs = $('#pairs');

		// Strings to hold the racer and bib divs
		var racersStr = String();
		var bibsStr = String();
		var assignStr = String();

		var racersArr = [];
		var bibsArr = [];

		// Loop over bib numbers starting with BibStart for numRacers
		bibNum = bibStart;

		for (var i = 0; i < numRacers; i++)	 {
			// Initialize the racer and bib cards
			// add draggable to class here if dragging to match
			racersArr[i] = "<div class='racer clickable' id='racer" + i + "'>" + racerNames[i] + "</div>"

			bibsArr[i] = "<div class='bib clickable' id='bibNum" + bibNum + "'>" + bibNum + "</div>";
			bibAssignment[bibNum] = "<div class='assignment' id='assign" + bibNum + "'></div>";
			console.log(bibAssignment[bibNum]);
			bibNum++;
			console.log(bibsArr[i]);

		}

		// Now load the each array into respective strings
		for(var i in racersArr) {
			racersStr = racersStr + racersArr[i];
		}
		for(var i in bibsArr) {
			bibsStr = bibsStr + bibsArr[i];
							console.log("got here " + bibsStr);
		}				
		for (var i = bibStart; i < bibStart+numRacers; i++)	 {
			console.log(bibAssignment[i]);
			assignStr = assignStr + bibAssignment[i];
			console.log("got here " + assignStr);
		}

		console.log("after loop " + assignStr);


		console.log("got here 1");
		// Now inject each string into its board
		this.racers.html(racersStr);
		console.log("got here 2");
		this.bibs.html(bibsStr);
		console.log("got here 3");

		this.pairs.html(assignStr);
	
		console.log("got here 4");
		console.log("pairs:");
		console.log(this.pairs);
		console.log("end pairs");

		$('.racer').on('click', function() {
	
			Roster.select_a_racer($(this));
		});

		// $( ".assignment" ).droppable({
		// 	accept: function(d) { 
		// 	    if(d.hasClass("racer")||d.hasClass("bib")){ 
		//             return true;
	 //        	}
	 //        },
	 //      drop: function( event, ui ) {
	 //        $( this )
	 //          .addClass( "ui-state-highlight" )
	 //          .find( "p" )
	 //            .html( "Dropped!" );
	 //      }
	 //    });

		$('.bib').on('click', function() {
			Roster.select_a_bib($(this.bibs));
		});

	// },


	},  // end of function

	select_a_racer: function(racerObj) {
		if (!jQuery.isEmptyObject(racerPick)) {
			console.log("racer pick is not empty");
			// deselect the current chosen one
			racerPick.css('border', '1px solid grey');
			console.log(racerPick);
			console.log(racerObj);

			if (racerPick.attr('id') == racerObj.attr('id')) {
				console.log("racer pick is the same as the selected one");
				// user selected the highlighted one, so remove the pick
				racerPick = $();
			} else {
				console.log("set and highlight");
				// highlight this object
				racerObj.css('border', '3px solid red');
				// set the racerPick to the selected racer
				racerPick = racerObj;
			}
		} else {
			console.log("set and highlight");
			// highlight this object
			racerObj.css('border', '3px solid red');
			// set the racerPick to the selected racer
			racerPick = racerObj;
			// racerObj.fadeOut(300);
		}
	},

	select_a_bib: function(bibObj) {
		if (!jQuery.isEmptyObject(bibPick)) {
			// deselect the current chosen one
			bibPick.css('border', '1px solid grey');
		}
		
		// highlight this object
		bibObj.css('border', '3px solid red');
		// set the bibPick to the selected bib
		bibPick = bibObj;
		// racerObj.fadeOut(300);

	},

	assign_a_bib: function(racerObj, bibObj) {

	}



}; // eoc


/*-------------------------------------------------------------------------------------------------
Roster File picker
-------------------------------------------------------------------------------------------------*/
// $('#fill-roster').click(function() {

//     console.log("click on fill-roster");
//     // get the file
//     // read the file
//     // fill in an array of values
//     // right now only 1 value per row, but will be an array of array values

//     $(document).ready( function () {
// 	$('#table_id').dataTable();
//     } );	

// });

