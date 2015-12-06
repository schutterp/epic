// assume winter solstice occurs at midnight on 12/21
// winter: [x, -23.5, 0   ]
// spring: [x,  0,   -23.5]
// summer: [x,  23.5, 0   ]
// fall:   [x,  0,    23.5]
// over the course of the year:
// -yaw (x) will travel between -180 and 180 degrees over 24 hours
// -pitch (y) will travel between -23.5 and 23.5 degrees over six months
// -roll (z) will travel between -23.5 and 23.5 degrees over six months

var DEGREES_PER_MIN = 360 / (24 * 60);
// var INITIAL_ROTATION = {
// 	lat: 180,
// 	// winter solstice
// 	lng: -23.5,
// 	roll: 0
// };
var Positioner = function (date) {
	// TODO audit date is Date
	// winter solstice assumed to be utc midnight 12/21/2014
	this.prevWinterSolstice = new Date(Date.UTC(2014, 11, 21));
	// convert ms to minutes
	this.minSinceWinterSolstice = (date - this.prevWinterSolstice) / 60 / 1000;
	// use real life getters/setters
	var lat = Positioner.getLat(this.minSinceWinterSolstice);
	var rotationAxis = Positioner.getRotationAxis(this.minSinceWinterSolstice);
	return [lat, rotationAxis[0], rotationAxis[1]];
};

Positioner.getLat = function (minSinceWinterSolstice) {
	if (!minSinceWinterSolstice) {
		return 180;
	}
	var rotateByDegrees = minSinceWinterSolstice * DEGREES_PER_MIN;
	if (rotateByDegrees > 360) {
		rotateByDegrees = rotateByDegrees % 360;
	}
	var newAngle = Positioner.getLat(0) + rotateByDegrees;
	if (newAngle > 180) {
		newAngle = newAngle - 360;
	}
	return newAngle;
};

// WTF?? why do I need this:
var CORRECTION_DEGREES = -90;

var MINUTES_IN_ONE_YEAR = 365 * 24 * 60;
var RADIUS = 23.5;
var DEGREES_PER_RADIAN = 360 / (2 * Math.PI);
Positioner.getRotationAxis = function (minSinceWinterSolstice) {
	// defines the axis that lat rotates on
	var axisDegrees = minSinceWinterSolstice / MINUTES_IN_ONE_YEAR * 360 - CORRECTION_DEGREES;
	var axisRadians = axisDegrees / DEGREES_PER_RADIAN;
	var pitchRadians = Math.cos(axisRadians);
	var rollRadians = Math.sin(axisRadians);
	return [
		RADIUS * rollRadians,
		RADIUS * pitchRadians
	];
};


// create an object that given a time of year, returns the exact needs of the rotate method
//
// it can also return what position the background images should be in based on the season and the width of the viewport...
//
//

// this.positioner = (function (global) {
// 	var rotationAngle = 180.0;
// 	var DEGREES_PER_MIN = 360 / (24 * 60);

// 	return {
// 		init: function (date) {
// 			return new Positioner(date);
// 		}
// 	};
// })(this);
