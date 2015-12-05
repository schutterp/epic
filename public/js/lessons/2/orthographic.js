var width = 960,
	height = 960;

var projection = d3.geo.orthographic()
	.scale(475)
	.translate([width / 2, height / 2])
	.clipAngle(90)
	// how does this affect perf?
	// .precision(.1)
	.rotate([-180, 23.5, 0]);

var path = d3.geo.path()
	.projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select('.main').append('svg')
	.attr('width', width)
	.attr('height', height);

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

var grat = svg.append('path')
	.datum(graticule)
	.attr('class', 'graticule')
	.attr('d', path);

d3.json('json/world-110m.json', function(error, world) {
	if (error) throw error;

	var land = svg.insert('path', '.graticule');
	land.datum(topojson.feature(world, world.objects.land))
		.attr('class', 'land')
		.attr('d', path);

	// var countryBoundaries = svg.insert('path', '.graticule');
	// countryBoundaries.datum(
	// 	topojson.mesh(
	// 		world,
	// 		world.objects.countries,
	// 		function(a, b) {
	// 			return a !== b;
	// 		}
	// 	))
	// 	.attr('class', 'boundary')
	// 	.attr('d', path);

	var ctr = 500;
	var prevT = 0;
	d3.timer(function (t) {
		var deltaMs = t - prevT;
		prevT = t;
		console.log('time travel forward ' + deltaMs + ' minutes');
		// console.log('euler angles: ', [rotationAngle, pitchAngle, rollAngle]);

		var minutes = deltaMs; // 7*24*60;
		projection.rotate([rotationAngle, pitchAngle, rollAngle]);

		land.attr('d', path);
		grat.attr('d', path);

		rotateEarthByMinutes(minutes);
		adjustPitchAndRollByMinutes(minutes);

		ctr--;
		return ctr < 0;
	});
});

d3.select(self.frameElement).style('height', height + 'px');
