
/*-------------------------------------------------------------------------------------------------
Configure options display
-------------------------------------------------------------------------------------------------*/
$(function() {
    $( "#options" ).accordion( {
    	collapsible: true,
    	heightStyle: "content",
		// event: "click hoverintent" - need to add hoverintent handler to use this feature
    });

	$(document).ready( function () {
		$('#roster-table').dataTable( {
					"aaSorting": [[ 4, "asc" ]]
				});
	});
});

/*-------------------------------------------------------------------------------------------------
 Global variables to collect data from input actions
-------------------------------------------------------------------------------------------------*/
var gender = "none";
var dateObject = "";
var racetype ="";
var site = "";
var school = "Unselected";

// current choices
var racerPick;
var bibPick;
var assignmentPick;

// School and bib parameters - hard coded
numBibs = 10;  // always 10 for now, not all are required to be assigned
// Schools with girls and boys
var schools = ['St Sebastian', 'Sacred Heart', 'Belmont High',
				'Scituate', 'Hingham', 'Natick', 'Norwell', 'Needham'];
// Girls only
var girlsSchools = ['Notre Dame Academy'];
// Boys only
var boysSchools = ['BC High'];

var girlsBibs = {
	'Notre Dame Academy' : 0,
	'St Sebastian' : 20,
	'Sacred Heart' : 40,
	'Belmont High' : 50,
	'Scituate' : 60,
	'Hingham' : 70,
	'Natick' : 90,
	'Norwell' : 100,
	'Needham' : 110
};

var boysBibs = {
	'BC High' : 200,
	'St Sebastian' : 220,
	'Sacred Heart' : 240,
	'Belmont High' :250,
	'Scituate' : 260,
	'Hingham' : 270,
	'Natick' : 290,
	'Norwell' : 300,
	'Needham' : 310
};

// div names
id_of_bibsDiv = "";
id_of_bibsAssignmentDiv = "";

// track constructed board
boardGender = "";
boardSchool = "";

/*-------------------------------------------------------------------------------------------------
Initialize the board based on gender and team
-------------------------------------------------------------------------------------------------*/
function boardSetup() {
	var	bibs = $('#' + id_of_bibsDiv);
	var pairs = $('#' + id_of_bibsAssignmentDiv);

	// If any selection doesn't match, we have to clear the board
	if (gender != boardGender || school != boardSchool) {
		// Empty the board and start over
		bibs.html("");
		pairs.html("");
	}

	// But we need Gender and School to setup bib number board and assignment board
	if (gender == "none" || school == "Unselected") {
		// Can't do anything yet
		return;
	}

	// Populate the bib number board and assignment boards
	var bibsStr = String();
	var pairStr = String();

	var bibStart;
	if (gender == 'Boys') {
		bibStart = boysBibs[school];
	} else {
		bibStart = girlsBibs[school];
	}

	// Setup the boards - bibs, assignment pairs
	// Loop over bib numbers starting with BibStart
	bibNum = bibStart;
	for (var i = 0; i < numBibs; i++) {
		// Initialize the bib cards
		bibsStr += "<div class='bib clickable' id='bibNum" + bibNum + "'>" + bibNum + "</div>";
		bibNum++;
	}

	for (var i = bibStart; i < bibStart+numBibs; i++)	 {
		// Initialize assignment cards
		// Index the bibAssignment by bibNum
		pairStr += "<div class='assignment clickable unassigned' id='assign" + i + "'></div>";
	}

	// Inject strings into its board
	bibs.html(bibsStr);
	pairs.html(pairStr);

	// Record which school and gender is being displayed
	boardGender = gender;
	boardSchool = school;

	// If both school and racers are available, display the racers, bibs and assignment board
	// Racers are currently hardcoded
	bibs.show();
	pairs.show();
	$('#racer-bib').show();

	// Setup click handlers to select a racer or a bib
	$('.bib').on('click', function() {
		bibPick = select_it($(this), bibPick, '2px solid blue', '1px solid blue');
	});

	$('#racer-bib').click(function() {
		var err1 = false;
		var err2 = false;

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
			assign_a_bib(racerPick, bibPick);
		}
	});


	/*-------------------------------------------------------------------------------------------------
	Select an assignment
	-------------------------------------------------------------------------------------------------*/
	$('.assignment').click(function() {
		assignmentPick = select_it($(this), assignmentPick, '3px solid green', '2px solid blue');
	});

}

/*-------------------------------------------------------------------------------------------------
Select the roster Gender
-------------------------------------------------------------------------------------------------*/
$('.gender').click(function() {

	 // Boys or Girls
	 var radio_button = $(this);

	 // What is the label next to (i.e. after) that radio 
	 var label = radio_button.next();

	 // Now that we know the label, grab the text inside of it (That's our message!)
	 gender = label.html();

	 // Handle special cases for schools based on gender
	populateSchool();

	 console.log(gender);
	 // Determine if we need to setup or change the board
	 boardSetup();
});

/*-------------------------------------------------------------------------------------------------
Select the race Site
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
Select the Race type
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
Select the Team / School 
-------------------------------------------------------------------------------------------------*/
$('#team').click(function() {
	// Get the dropdown value
	school = $('#team').val();

	 // Determine if we need to setup or change the board
	 boardSetup();
});

/*-------------------------------------------------------------------------------------------------
Select the Race Date
-------------------------------------------------------------------------------------------------*/
$("#datepicker").datepicker(
{
    onSelect: function()
    { 
        var datexxx = $(this).datepicker('getDate'); 
        dateObject = $.datepicker.formatDate( "yy-mm-dd", datexxx );
    }
});


/*-------------------------------------------------------------------------------------------------
Export the Roster event handler - not implemented
-------------------------------------------------------------------------------------------------*/
$('#export-table').click(function() {
	alert('export-btn clicked');
});

/*-------------------------------------------------------------------------------------------------
Close the preview window
-------------------------------------------------------------------------------------------------*/
$('#close-preview').click(function() {
	$('#preview').hide();
});

/*-------------------------------------------------------------------------------------------------
Print the Roster event handler
-------------------------------------------------------------------------------------------------*/
$('#print-table').click(function() {

	// Goal: Open the roster table in a new tab that can be printed
   
    // Take the existing card on the page (in the #canvas div) and clone it for the new tab
    var table_clone = $('#roster-table').clone();
    var title_clone = $('#title-report').clone();
        
    // Get the title and the table
    var table = table_clone.prop('outerHTML');
    var title = title_clone.prop('outerHTML');
    
    // For the new tab, we need to basically construct all the pieces we need for any HTML page starting with a start <html> tag.
    var new_tab_contents  = '<html>';
    
    // (Note the += symbol is used to add content onto an existing variable, so basically we're just adding onto our new_tab_contents variable one line at a time)
    new_tab_contents += '<head>';
    new_tab_contents += '<link rel="stylesheet" href="css/main.css" type="text/css">'; // Don't forget your CSS so the card looks good in the new tab!
    new_tab_contents += '<link rel="stylesheet" href="css/features.css" type="text/css">';
    new_tab_contents += '</head>';
    new_tab_contents += '<body>'; 
    new_tab_contents += title; 
        new_tab_contents += table; 
    new_tab_contents += '</body></html>';
    
	// Ok, our card is ready to go, we just need to work on opening the tab
    
    // Here's how we tell JavaScript to create a new tab (tabs are controlled by the "window" object).
    var new_tab =  window.open();

	// Now within that tab, we want to open access to the document so we can make changes
    new_tab.document.open();
    
    // Here's the change we'll make: we'll write our card (i.e., new_tab_contents) to the document of the tab
    new_tab.document.write(new_tab_contents);
    
    // Then close the tab. This isn't actually closing the tab, it's just closing JS's ability to talk to it.
    // It's kind of like when you're talking to a walkie-talkie and you say "over and out" to communicate you're done talking
    new_tab.document.close();
    		
});



/*-------------------------------------------------------------------------------------------------
Preview Roster
-------------------------------------------------------------------------------------------------*/
$('#preview-roster').click(function() {
	$('#preview').show();
	$('#controls').blur();
	school = $('#team').val();

	var title = gender + " " + racetype + " at " + site + " - " + school + " - " + dateObject
	$('#title-report').html(title);

	// Clear table previously displayed
	$('#roster-table').dataTable().fnClearTable();

	// Iterate over the bib assignment divs to insert rows in the table body
	$('#pairs').children('div').each(function () {
		if ($(this).children().length > 0) {
			var thisRacer = $(this).find(".racer").html();
			var thisBib   = $(this).find(".bib").html();
			$('#roster-table').dataTable().fnAddData( [
				thisBib,
				thisRacer]);
		}
	});

});

/*-------------------------------------------------------------------------------------------------
Undo All Assignments
-------------------------------------------------------------------------------------------------*/
$('#refresh-btn').click(function() {
	var pairs = $('#' + id_of_bibsAssignmentDiv);

	// Get all assignments
	// Restore each racer and bib
	// Empty the assignments and start over
	var assignments = pairs.children();
	$(assignments).each(function () {
		restore($(this));
	});
	// Clear the picks
	racerPick = null;
	bibPick = null;
	assignmentPick = null;
});

/*-------------------------------------------------------------------------------------------------
Restore racer and bib
-------------------------------------------------------------------------------------------------*/
function restore(pick) {
	var pair   = pick.children();
	console.log($(pair));
	var BibId;
	var RacerId;
	$(pair).each(function () {
		if ($(this).hasClass('racer')) {
			racerId = $(this).attr('id');
			racerId = racerId.split('-')[1];

		}
		if ($(this).hasClass('bib')){
			bibId = $(this).attr('id');
			bibId = bibId.split('-')[1];
		}
	});

	racerPick = $('#' + racerId);
	bibPick = $('#' + bibId);
	$('#' + racerId).fadeIn(300);
	$('#' + racerId).css('border', '1px solid blue');
	$('#' + bibId).fadeIn(300);
	$('#' + bibId).css('border', '1px solid blue');

	// Clear out the assignment div - remove content, highlighting, and assignment class
	pick.empty();
	pick.css('border', '2px solid blue');
	pick.removeClass('assigned');
	pick.addClass('unassigned');
}

/*-------------------------------------------------------------------------------------------------
Undo Assignment
-------------------------------------------------------------------------------------------------*/
// Event handler for the remove assignment
$('#remove-assignment').on("click", function() {
	// Clear any previous error message
	$('#remove-error').html("");

	if ((assignmentPick == undefined) ||jQuery.isEmptyObject(assignmentPick) ) {
		$('#remove-error').html("Pick an assignment");
		return;
	}
	if (assignmentPick.children().length == 0) {
		$('#remove-error').html("Nothing to unassign");
		return;
	}

	restore(assignmentPick);
	// Deselect the pick
	assignmentPick = null;
});

/*-------------------------------------------------------------------------------------------------
Select or deselect an object
-------------------------------------------------------------------------------------------------*/
function select_it(Obj, chosen, select, deselect) {

	if (!jQuery.isEmptyObject(chosen)) {
		// deselect the current chosen one
		chosen.css('border', deselect);

		if (chosen.attr('id') == Obj.attr('id')) {
			// user selected the highlighted one, so remove the pick
			chosen = null;
		} else {
			// highlight this object
			Obj.css('border', select);
			// set the chosen to the selected racer
			chosen = Obj;
		}
	} else {
		// highlight this object
		Obj.css('border', select);
		// set the chosen to the selected racer
		chosen = Obj;

	}
	return chosen;
}

/*-------------------------------------------------------------------------------------------------
Create an assignment between a racer and a bib
-------------------------------------------------------------------------------------------------*/
function assign_a_bib(racerObj, bibObj) {

	// Clear any error message
	$('#assign-error').html("");

	var racerId = racerObj.attr('id');
	var bibId   = bibObj.attr('id');

	// clone the chosen ones and change their ids
	var racerChosen = racerObj.clone().attr('id', "clone-" + racerId);
	var bibChosen   =   bibObj.clone().attr('id', "clone-" + bibId);
	racerChosen.removeClass('clickable');
	bibChosen.removeClass('clickable');

	var racerStr = "<div class='racer' id=" + racerId + "'>" + racerId + "</div>";
	var	bibStr   = "<div class='bib' id="   + bibId   + "'>" + bibId + "</div>";

	// Find the first available div in pairs
	var availToAssign = $('#pairs').children(".unassigned").eq(0);
	console.log("div to assign");
	console.log(availToAssign);

	$(availToAssign).prepend(bibChosen);
	$(availToAssign).prepend(racerChosen);

	$(availToAssign).removeClass('unassigned');
	$(availToAssign).addClass('assigned');

	// make the chosen ones disappear
	racerObj.fadeOut(300);
	bibObj.fadeOut(300);

	// Clear the picks
	racerPick = null;
	bibPick = null;
}

/*-------------------------------------------------------------------------------------------------
Fill school dropdown values with common list and list based on gender
-------------------------------------------------------------------------------------------------*/
function populateSchool() {
	// Populate the dropdown with the list of schools
	var schoolSelect = $('#school').find("select");
	schoolSelect.first().html("<option value='Unselected'>Select a school</option>");
	for (var i = 0; i < schools.length; i++) {
		var sch = "<option value='"+ schools[i] + "'>" + schools[i] + "</option>";
		schoolSelect.append(sch);
	}
	if (gender == 'Girls') {
		for (var i = 0; i < girlsSchools.length; i++) {
			var sch = "<option value='"+ schools[i] + "'>" + girlsSchools[i] + "</option>";
			schoolSelect.append(sch);
		}
	} else {
		for (var i = 0; i < boysSchools.length; i++) {
			var sch = "<option value='"+ schools[i] + "'>" + boysSchools[i] + "</option>";
			schoolSelect.append(sch);
		}
	}
}

/**
*
* Roster Board
* @class Roster
* @constructor setup
*
**/
var Roster = {
	// HTML objects
	racers: '',

	setup: function(id_of_racers, id_of_bibs, id_of_pairs, racerNames) {
		// Setup the racers board
		this.racers = $('#' + id_of_racers);
		var racersStr = String();
		for (var i = 0; i < racerNames.length; i++)	 {
			// Initialize the racer cards
			racersStr += "<div class='racer clickable' id='racer" + i + "'>" + racerNames[i] + "</div>"
		}
		// Inject racer strings into its board
		this.racers.html(racersStr);

		// Setup click handlers to select a racer or a bib
		$('.racer').on('click', function() {
			racerPick = select_it($(this), racerPick, '2px solid red', '1px solid blue');
		});

		id_of_bibsDiv = id_of_bibs;
		id_of_bibsAssignmentDiv = id_of_pairs;

	},  // end of function

}; // eoc
