const request = require('request');

// This is the url we want to load
var URL = 'http://epic.gsfc.nasa.gov/api/images.php?dates';

var availableDates = [];
var BASE_ERROR_MSG = 'Something went wrong. ';

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
