/* Collect data from input actions
*/
var gender = "";
var dateObject = "";
var racetype ="";
var site = "";
var school = "";

// current choices
var racerPick;
var bibPick;

// Roster parameters
var assignCount = 0;
var assignLimit = 0;

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



var Roster = {

	// HTML objects
	racers: '',
	bibs: '',
	pairs: '',

	racerSelected: 0,
	bibSelected: 0,

	setup: function(id_of_racers, id_of_bibs, racerNames, bibStart, numRacers) {
		// Keep track of what needs to be assigned
		assignCount = bibStart;
		assignLimit = numRacers;

		// Setup the boards - racers, bibs, assignment pairs
		this.racers = $('#' + id_of_racers);
		this.bibs   = $('#' + id_of_bibs);
		this.pairs = $('#pairs');

		// Strings to hold the racer and bib divs
		var racersStr = String();
		var bibsStr = String();
		var pairStr = String();

		var racersArr = [];
		var bibsArr = [];
		// Build a board to hold the assignments
		var bibAssignment = [];

		// Loop over bib numbers starting with BibStart for numRacers
		bibNum = bibStart;

		for (var i = 0; i < numRacers; i++)	 {
			// Initialize the racer and bib cards
			// add draggable to class here if dragging to match
			racersArr[i] = "<div class='racer clickable' id='racer" + i + "'>" + racerNames[i] + "</div>"
			bibsArr[i] = "<div class='bib clickable' id='bibNum" + bibNum + "'>" + bibNum + "</div>";

			// Index the bibAssignment by bibNum so we can find the assignment more easily
			bibAssignment[bibNum] = "<div class='assignment clickable' id='assign" + bibNum + "'></div>";
			bibNum++;
		}

		// load each array of objects into respective strings
		for(var i in racersArr) {
			racersStr = racersStr + racersArr[i];
		}
		for(var i in bibsArr) {
			bibsStr = bibsStr + bibsArr[i];
		}
		for (var i = bibStart; i < bibStart+numRacers; i++)	 {
			pairStr = pairStr + bibAssignment[i];
		}

		// Now inject each string into its board
		this.racers.html(racersStr);
		this.bibs.html(bibsStr);
		this.pairs.html(pairStr);

		// Setup click handlers
		$('.racer').on('click', function() {
			Roster.select_it($(this), 'racer', 'red');
		});

		$('.bib').on('click', function() {
			Roster.select_it($(this), 'bib', 'blue');
		});

		$('#racer-bib').click(function() {
			var err1 = false;
			var err2 = false;
			console.log(racerPick);
			console.log(bibPick);
			if (jQuery.isEmptyObject(racerPick))
				err1 = true;
			if (jQuery.isEmptyObject(bibPick))
				err2 = true;
			if (err1 && err2)
				$('#assign-error').html("Pick a racer and a bib number");
			else if (err1 || err2) {
				if (err1)
					$('#assign-error').html("Pick a racer too");
				else
					$('#assign-error').html("Pick a bib too");
			} else {
				console.log("assign it");
				Roster.assign_a_bib(racerPick, bibPick);
			}
		});

		$('#preview-roster').click(function() {
			// Clear table previously displayed
			$('#roster-table > tbody').empty();

			// Iterate over the bib assignment divs to insert rows in the table body
			$('#pairs').children('div').each(function () {
				console.log("entry in bib assignment div");
				console.log($(this).children().length);

				if ($(this).children().length > 0) {
				    var thisRacer = $(this).find(".racer").html();
				    var thisBib   = $(this).find(".bib").html();
				    $('#roster-table > tbody').append("<tr><td>" + thisBib + "</td><td>" + thisRacer + "</td></tr>");
				}
			});

			// Use DataTable to display table nicely
			// TBD/Defect : sorting on the columns in the DataTable table loses the data ?
/*		    $(document).ready( function () {
				$('#roster-table').dataTable();
		    });*/
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

	// },


	},  // end of function

	select_it: function(Obj, objType, color) {
		var chosen;
		console.log(objType);
		if (objType=='bib')
			chosen = bibPick;
		else
			chosen = racerPick;
		if (!jQuery.isEmptyObject(chosen)) {
			// deselect the current chosen one
			chosen.css('border', '1px solid grey');

			if (chosen.attr('id') == Obj.attr('id')) {
				// user selected the highlighted one, so remove the pick
				chosen = null;
			} else {
				// highlight this object
				Obj.css('border', '3px solid ' + color);
				// set the chosen to the selected racer
				chosen = Obj;
			}
		} else {
			// highlight this object
			Obj.css('border', '3px solid ' + color);
			// set the chosen to the selected racer
			chosen = Obj;

		}
		if (objType=='bib')
			bibPick = chosen;
		else
			racerPick = chosen;
	},


	assign_a_bib: function(racerObj, bibObj) {

		// Clear any error message
		$('#assign-error').html("");

		var racerId = racerObj.attr('id');
		var bibId   = bibObj.attr('id');

		// clone the chosen ones and change their ids
		var racerChosen = racerObj.clone().attr('id', "clone-" + racerId);
		var bibChosen   =   bibObj.clone().attr('id', "clone-" + bibId);

		var racerStr = "<div class='racer' id=" + racerId + "'>" + racerId + "</div>";
		var	bibStr   = "<div class='bib' id="   + bibId   + "'>" + bibId + "</div>";

		// TBD : decide if we need to change the class on the clones to make them retrievable
		// racerChosen.addClass('stickers_on_card');

		// Setup for the assignment div
		var assignId = "#assign" + assignCount;
		assignCount++;

/*		var assigned = "<div class='assignment clickable' id=" + assignId + "'></div>";
		console.log(assigned);*/

		// Inject the new image into the canvas
		//$('#pairs').prepend(assigned);
		$(assignId).prepend(bibChosen);
		$(assignId).prepend(racerChosen);

		console.log(this.pairs);

		// make the chosen ones disappear
		racerObj.fadeOut(300);
		bibObj.fadeOut(300);

		// Clear the picks
		racerPick = null;
		bibPick = null;
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

