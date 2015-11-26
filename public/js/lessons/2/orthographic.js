var width = 960,
		height = 960;

var projection = d3.geo.orthographic()
		.scale(475)
		.translate([width / 2, height / 2])
		.clipAngle(90)
		.precision(.1)
		// using these values I can position the earth to overlay on each image
		.rotate([97,-52, 30]);

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

svg.append('path')
		.datum(graticule)
		.attr('class', 'graticule')
		.attr('d', path);

d3.json('json/world-50m.json', function(error, world) {
	if (error) throw error;

	svg.insert('path', '.graticule')
			.datum(topojson.feature(world, world.objects.land))
			.attr('class', 'land')
			.attr('d', path);

	svg.insert('path', '.graticule')
			.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
			.attr('class', 'boundary')
			.attr('d', path);
});

d3.select(self.frameElement).style('height', height + 'px');
