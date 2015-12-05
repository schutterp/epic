// assume winter solstice occurs at midnight on 12/21
// winter: [x, -23.5, 0   ]
// spring: [x,  0,   -23.5]
// summer: [x,  23.5, 0   ]
// fall:   [x,  0,    23.5]
// over the course of the year:
// -yaw (x) will travel between -180 and 180 degrees over 24 hours
// -pitch (y) will travel between -23.5 and 23.5 degrees over six months
// -roll (z) will travel between -23.5 and 23.5 degrees over six months
// start at assumed winter solstice

// create a start/stop button that affects time (and earth's position)

// rotation needs to maintain direction. Am I increasing?
// example: start at -180, count up to 180 then reset to -180
var rotationAngle = -180.0;
function rotateEarthByMinutes (minutes) {
	var rotateByDegrees = minutes * (360 / (24 * 60));
	if (rotateByDegrees > 360) {
		rotateByDegrees = rotateByDegrees % 360;
	}
	var newAngle = rotationAngle + rotateByDegrees;
	if (newAngle > 180) {
		newAngle = newAngle - 360;
	}
	rotationAngle = newAngle;
}

// pitch needs to increase for 47 degrees and then decrease 47 degrees,
// 	fluctuating between -23.5 and 23.5
var pitchAngle = -23.5;

// roll needs to increase for 47 degrees and then decrease 47 degrees,
// 	fluctuating between -23.5 and 23.5
var rollAngle = 0;

var minutesSinceWinterSolstice = 0;
var minutesInOneYear = 365 * 24 * 60;
var radius = 23.5;
function adjustPitchAndRollByMinutes (minutes) {
	minutesSinceWinterSolstice = minutes + minutesSinceWinterSolstice;
	var newAngle = minutesSinceWinterSolstice / minutesInOneYear * 360;
	var pitchRadians = Math.cos(newAngle);
	var rollRadians = Math.sin(newAngle);
	rollAngle = radius * rollRadians;
	pitchAngle = radius * pitchRadians;
}
