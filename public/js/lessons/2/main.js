// this is where I'll use d3 to make a globe!
var width = 1280,
height = 500;

// mercator is the most standard way of projecting the globe on a 2d surface
var projection = d3.geo.mercator()
	// center around austin
	.center([-97, 30])
	// zoom in a bit
	.scale(300)
	// ???
	.rotate([0]);

var svg = d3.select('.main').append('svg')
	.attr('width', width)
	.attr('height', height);

// creates a new geographic path generator
var path = d3.geo.path()
	.projection(projection);

var g = svg.append('g')
	.attr('class', 'world');

// load and display the World
d3.json('json/world-110m.json', function(error, topology) {
	g.selectAll('path')
		.data(
			topojson
				.feature(topology, topology.objects.countries)
				.features
		)
		.enter()
			.append('path')
			.attr('d', path)
});
