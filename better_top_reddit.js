//Get the subreddit "top links" link from the dropdown menu
var top_link = $('div.drop-choices > form:nth-child(1)').attr('action');


var html_to_insert = "";
for(var i = 2; i < 7; i++) //Build out HTML string to be inserted for "past X days"
{
	html_to_insert += '<form method="POST"><a href="'+top_link+'" class="choice" onclick="window.location.href = \''+top_link+'?sort=top&t=week&specifically='+i+'days\';return false;">past '+i+' days</a></form>';
}

if($('div.drop-choices').find('form > a:contains("past 24 hours")').length) //If "past 24 hours" link exists, add "past X days" links after that
{
	$('div.drop-choices').find('form > a:contains("past 24 hours")').parent().after(html_to_insert);
}
else //Otherwise the user is currently already searching "past 24 hours", so add "past X days" links after "past hour"
{
	$('div.drop-choices').find('form > a:contains("past hour")').parent().after(html_to_insert);
}


if(param = parseInt(getUrlParameter("specifically"))) //If the URL contains the parameter "specifically" that is set by this plugin, apply changes to items on page.
{
	var today = new Date(); //We need todays date
	var specific_date = new Date(); //Will hold the selected date

	$('div.dropdown > span.selected').text('past '+param+' days'); //Set the "links from: past week" item to say "past X days"
	$('div.drop-choices').find('form > a:contains("past '+param+' days")').parent().hide(); //Hide the link we created and added for the day we have selected
	
	specific_date.setDate(specific_date.getDate() - param); //Set the selected date to "X days in the past"
	
	$("[id^=thing]").each(function( index ) //Loop through each posting on the page, AKA "things"
	{
		var thing_timestamp = $(this).find('time').attr('datetime'); //Get the timestamp of this post
		var thing_date = new Date(thing_timestamp); //Convert it to a date

		if(thing_date <= today && thing_date >= specific_date) //If the timestamp of this thing is between now and X days ago, keep it
		{
			//console.log("keeping item");
		}
		else //Otherwise it doesn't fit our specific search, so hide it.
		{
			//console.log("hiding item");
			$(this).hide();
		}
	});
}


//Returns URL parameter values.  Example usage in this script:
//===Reddit Videos -> Top -> links from: past 4 days===
//https://www.reddit.com/r/videos/top/?sort=top&t=week&specifically=4days
//getUrlParameter("specifically") will find specifically=4days and return "4days"
function getUrlParameter(param)
{
	var page_parameters = decodeURIComponent(window.location.search.substring(1)); //Get all of the parameters, decude URIs if they have been encoded
	var individual_parameters = page_parameters.split('&'); //Split each key=value into an array

	for (var i = 0; i < individual_parameters.length; i++) //Loop through all of the key=value items in the individual_parameters array
	{
		var parameter = individual_parameters[i].split('='); //Split this key=value into key and value

		if (parameter[0] === param) //If we have found the key we were looking for
		{
			if(parameter[1] === undefined) //Check if value is undefined
			{
				return true;
			}
			else
			{
				return parameter[1]; //Value is real, so return it.
			}
		}
	}
}