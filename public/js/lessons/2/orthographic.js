var width = 960,
	height = 960;

var projection = d3.geo.orthographic()
		.scale(475)
		.translate([width / 2, height / 2])
		.clipAngle(90)
		.precision(.1)
		// using these values I can position the earth to overlay on each image
		.rotate([97,-32, 0]);

var path = d3.geo.path()
		.projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select('.main').append('svg')
		.attr('width', width)
		.attr('height', height);

var dragMove = function () {
	var p = d3.mouse(this);
	projection.rotate([λ(p[0]), φ(p[1])]);
	svg.selectAll("path").attr("d", path);
};

var drag = d3.behavior.drag()
	.origin(function() {
		var r = projection.rotate();
		return {
			x: r[0],
			y: -r[1]
		};
	})
	.on("drag", dragMove);

svg.append('defs').append('path')
		.datum({type: 'Sphere'})
		.attr('id', 'sphere')
		.attr('d', path);

svg.append('use')
		.attr('class', 'stroke')
		.attr('xlink:href', '#sphere');

svg.append('use')
		.attr('class', 'fill')
		.attr('xlink:href', '#sphere');

svg.append('path')
		.datum(graticule)
		.attr('class', 'graticule')
		.attr('d', path);

var λ = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

var φ = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);

d3.json('json/world-50m.json', function(error, world) {
	if (error) throw error;

	svg.insert('path', '.graticule')
			.datum(topojson.feature(world, world.objects.land))
			.attr('class', 'land')
			.attr('d', path)
			.call(drag);

	svg.insert('path', '.graticule')
			.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
			.attr('class', 'boundary')
			.attr('d', path);
});

d3.select(self.frameElement).style('height', height + 'px');


function doRotation (minutes) {
	console.log('euler angles: ', [rotationAngle, pitchAngle, rollAngle]);
	projection.rotate([rotationAngle, pitchAngle, rollAngle]);
	svg.selectAll("path").attr("d", path);
	// jump by week
	rotateEarthByMinutes(minutes);
	adjustPitchByMinutes(minutes);
	adjustRollByMinutes(minutes);
}

function continueRotating(minutes) {
	setTimeout(function () {
		doRotation(minutes);
		continueRotating(minutes);
	}, 500)
}
// uncomment to start moving earth by minutes provided to `continueRotating`
// continueRotating(7*60*24);
