const request = require('request');
const htmlParser = require('htmlparser2');

// This is the name of the id of the element we are interested in
var ID_TO_FIND = 'geofilter';
// THis is the url we want to load
var URL = 'http://epic.gsfc.nasa.gov/';
// I have to turn on logging when the parser sees `ID_TO_FIND`
var isLoggingOn = false;
// Keeps track of how many nested divs we've seen since logging was turned on.
// A stack would be another way to do it ... push/pop instead of inc/dec
var divCt = 0

var fileNameParser = new htmlParser.Parser({
	// look for the image name
});

// request will go fetch `URL` and call the callback function when it's ready
request(URL, function (error, response, body) {
	// ensure the request was successful
	if (!error && response.statusCode === 200) {
		var parser = new htmlParser.Parser({
			onopentag: function(name, attributes) {
				if (name === 'div' && attributes.id === ID_TO_FIND) {
					console.log('Found the ' + ID_TO_FIND + ' element!');
					isLoggingOn = true;
				}
				else if (isLoggingOn && name === 'div') {
					console.log(attributes.class);
					divCt++;
				}
			},
			ontext: function(text) {
				if (isLoggingOn) {
					console.log('-->', text);
				}
			},
			onclosetag: function(name) {
				if (isLoggingOn && name === 'div') {
					divCt--;
					if (divCt < 0) {
						isLoggingOn = false
					}
				}
			}
		}, {decodeEntities: true});

		parser.write(body);
		parser.end();
	}
});

// Keeping this down here so I don't forget about this `trumpet` library.
// It's a much cleaner api for parsing html if you are ready to work with streams.

// var trumpet = require('trumpet');
// var tr = trumpet();

// tr.select('.b span', function (node) {
// 	node.html(function (html) {
// 		console.log(node.name + ': ' + html);
// 	});
// });

// var fs = require('fs');
// fs.createReadStream(__dirname + '/select.html').pipe(tr);
