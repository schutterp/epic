// Example coords after parsing response from `epic.gsfc.nasa.gov/api/images.php`
// Response is js text, so we must eval it and assign to `res` and then `var coords = JSON.parse(res[0].coords);`
var coords = {
	centroid_coordinates: {
		lat: -12.728536,
		lon: 165.497986
	},
	dscovr_j2000_position: {
		x: -796261.125,
		y: -1105544.75,
		z: -308132.8125
	},
	lunar_j2000_position: {
		x: 363256.1875,
		y: -54409.085938,
		z: -18617.169922
	},
	sun_j2000_position: {
		x: -77992344,
		y: -115192160,
		z: -49936508
	},
	attitude_quaternions: {
		q0: -0.04641,
		q1: -0.14773,
		q2: 0.43952,
		q3: 0.88479
	}
}