const request = require('request');

// This is the url we want to load
var URL = 'http://epic.gsfc.nasa.gov/api/images.php?dates';

var availableDates = [];
var BASE_ERROR_MSG = 'Something went wrong. ';

// maybe we create a page that constantly loops over all the images and displays them each in turn with the date embedded over the image itself
// little animation with the date dynamically embeded

// DISPLAY TIME IN USER-SELECTED TIMEZONE!
// Put a dot on the map for where your browser says you are
// create a library that enables marking the image based on coordinates (could be combined with mapmy api)
// project each earth image in the celestial sphere! would make it cool to see the night sky
// ping the api hourly
// apply crazy colors to earths image
// overlay earth image with exxon brand (brand like a cow would get branded)


/**
 * Loop over each date and:
 * -make a request to get the data for that date
 * -???download each image??? -> buffer requests so they don't all fire off at once
 * @param  {Array} dates  The dates that have epic image data
 * @return {undefined}
 */
function getAllImageDataFor (dates) {
	dates.forEach(function (date) {
		console.log(date);
	});
}

// request will go fetch `URL` and call the callback function when it's ready
request(URL, function (error, response, body) {
	// ensure the request was successful
	if (!error && response.statusCode === 200) {
		try {
			// body is expected
			eval(body);
			// enabledDates should be created by evaled body
			if (enabledDates instanceof Array) {
				availableDates = enabledDates;
			}
			else {
				throw new Error(BASE_ERROR_MSG + '`enabledDates` was not an instanceof Array.');
			}
		}
		catch (e) {
			console.log(BASE_ERROR_MSG + 'Could not eval response body');
		}
		getAllImageDataFor(availableDates);
	}
});
