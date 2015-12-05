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
// 47 degree change in six months
var minutesInSixMonths = 365 / 2 * (24 * 60);
var degreeChangePerMinute = 47 / minutesInSixMonths;
var maxPitch = 23.5;
var minPitch = -23.5;
var pitchIsIncreasing = true;
function adjustPitchByMinutes (minutes) {
	var newAngle;
	var adjustPitchByDegrees = minutes * degreeChangePerMinute;
	if (pitchIsIncreasing) {
		newAngle = pitchAngle + adjustPitchByDegrees;
	}
	else {
		newAngle = pitchAngle - adjustPitchByDegrees;
	}
	if (pitchIsIncreasing && newAngle > maxPitch) {
		newAngle = maxPitch - (newAngle - maxPitch);
		pitchIsIncreasing = false;
	}
	else if (!pitchIsIncreasing && newAngle < minPitch) {
		newAngle = minPitch - (newAngle - minPitch);
		pitchIsIncreasing = true;
	}
	pitchAngle = newAngle;
}

// TODO: DRY this as pitch and roll are handled the same
// roll needs to increase for 47 degrees and then decrease 47 degrees,
// 	fluctuating between -23.5 and 23.5
var rollAngle = 0;
var maxRoll = 23.5;
var minRoll = -23.5;
var rollIsIncreasing = false;
function adjustRollByMinutes (minutes) {
	var newAngle;
	var adjustRollByDegrees = minutes * degreeChangePerMinute;
	if (rollIsIncreasing) {
		newAngle = rollAngle + adjustRollByDegrees;
	}
	else {
		newAngle = rollAngle - adjustRollByDegrees;
	}
	if (rollIsIncreasing && newAngle > maxRoll) {
		newAngle = maxRoll - (newAngle - maxRoll);
		rollIsIncreasing = false;
	}
	else if (!rollIsIncreasing && newAngle < minRoll) {
		newAngle = minRoll - (newAngle - minRoll);
		rollIsIncreasing = true;
	}
	rollAngle = newAngle;
}
